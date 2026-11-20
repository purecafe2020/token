# 每日自动发布：把当天已核实的最新看板推到远端，触发 Cloudflare Pages 重建
# 设计原则：内容由 Agent 在会话中更新，本脚本只负责「发布」，绝不伪造更新
$ErrorActionPreference = 'Stop'

$Root    = Split-Path -Parent $PSScriptRoot
$LogDir  = Join-Path $Root 'logs'
$LogFile = Join-Path $LogDir 'publish.log'

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log([string]$Message) {
    $line = '{0}  {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
    Write-Host $line
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
}

# git 会把进度写到 stderr；PowerShell 5.1 在 Stop 模式下会把 stderr 当终止错误，
# 所以在调用期间降级为 Continue，并显式取回 ExitCode。
function Invoke-Git {
    param([string[]]$GitArgs)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $output = & git @GitArgs 2>&1
    $code = $LASTEXITCODE
    $ErrorActionPreference = $prev
    $text = (($output | ForEach-Object { "$_" }) -join "`n").Trim()
    [pscustomobject]@{ Output = $text; ExitCode = $code }
}

# 日志轮转：超过 512KB 归档一次
if ((Test-Path $LogFile) -and ((Get-Item $LogFile).Length -gt 512KB)) {
    Move-Item -Path $LogFile -Destination "$LogFile.1" -Force
}

Set-Location $Root

try {
    if (-not (Test-Path (Join-Path $Root 'index.html'))) {
        throw '当前目录下找不到 index.html'
    }

    $html = Get-Content -Path 'index.html' -Raw -Encoding UTF8
    $match = [regex]::Match($html, 'const UPDATED = "(\d{4}-\d{2}-\d{2})')
    if (-not $match.Success) { throw 'index.html 中找不到 UPDATED 标记' }

    $updated = $match.Groups[1].Value
    $today   = Get-Date -Format 'yyyy-MM-dd'

    if ($updated -ne $today) {
        Write-Log "跳过：页面最后核实日期为 $updated，今天 $today 尚未更新。请先在会话里说「更新今日看板」。"
        exit 0
    }

    $remoteNames = (Invoke-Git 'remote').Output
    if ([string]::IsNullOrWhiteSpace($remoteNames)) {
        Write-Log '跳过：尚未配置 git remote（见 DEPLOY.md 第 2 步）。'
        exit 0
    }

    # 先同步结构化数据（分享图与外部工具依赖 deals.json）
    $exportScript = Join-Path $Root 'scripts\export-data.js'
    if ((Test-Path $exportScript) -and (Get-Command node -ErrorAction SilentlyContinue)) {
        $prevEap = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        $dataOut = & node $exportScript 2>&1
        $dataCode = $LASTEXITCODE
        $ErrorActionPreference = $prevEap
        $dataText = (($dataOut | ForEach-Object { "$_" }) -join ' ').Trim()
        if ($dataCode -eq 0) { Write-Log ('DATA：' + $dataText) }
        else { Write-Log ('DATA 导出失败（不影响发布）：' + $dataText) }
    }

    # 发布前刷新静态 SEO 内容（JSON-LD / noscript / sitemap），失败不阻断发布
    $seoScript = Join-Path $Root 'scripts\build-seo.js'
    if ((Test-Path $seoScript) -and (Get-Command node -ErrorAction SilentlyContinue)) {
        $prevEap = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        $seoOut = & node $seoScript 2>&1
        $seoCode = $LASTEXITCODE
        $ErrorActionPreference = $prevEap
        $seoText = (($seoOut | ForEach-Object { "$_" }) -join ' ').Trim()
        if ($seoCode -eq 0) { Write-Log ('SEO：' + $seoText) }
        else { Write-Log ('SEO 生成失败（不影响发布）：' + $seoText) }
    }

    # 刷新分享图（统计数字与日期跟随数据，失败不阻断）
    $ogScript = Join-Path $Root 'scripts\make-og-image.ps1'
    if (Test-Path $ogScript) {
        try {
            & $ogScript | Out-Null
            Write-Log '分享图已刷新：og-image.png'
        }
        catch {
            Write-Log ('分享图生成失败（不影响发布）：' + $_.Exception.Message)
        }
    }

    (Invoke-Git 'add', '-A') | Out-Null
    $statusText = (Invoke-Git 'status', '--porcelain').Output
    $changes = @($statusText -split "`n" | Where-Object { $_.Trim() -ne '' })

    if ($changes.Count -gt 0) {
        $commit = Invoke-Git 'commit', '-m', "daily: update token board $updated"
        if ($commit.ExitCode -ne 0) {
            Write-Log ('提交失败：' + $commit.Output)
            exit 1
        }
        Write-Log "已提交 $($changes.Count) 个文件变更。"
    }

    # 关键：上次推送失败时工作区是干净的，但本地仍有未推送提交，必须继续补推
    $branch = (Invoke-Git 'rev-parse', '--abbrev-ref', 'HEAD').Output.Trim()
    $upstreamRef = "origin/$branch"
    $hasUpstream = (Invoke-Git 'rev-parse', '--verify', '--quiet', $upstreamRef).ExitCode -eq 0
    if ($hasUpstream) {
        $ahead = [int]((Invoke-Git 'rev-list', '--count', "$upstreamRef..HEAD").Output)
    } else {
        $ahead = 1
    }

    if ($changes.Count -eq 0 -and $ahead -eq 0) {
        Write-Log '无变更，无需发布。'
        exit 0
    }
    if ($ahead -gt 0) {
        Write-Log "检测到 $ahead 个未推送提交（上次发布可能未完成），继续推送。"
    }

    $ok = $false
    for ($i = 1; $i -le 3; $i++) {
        Write-Log "推送尝试 $i/3 → origin/$branch"
        $push = Invoke-Git 'push', 'origin', "HEAD:$branch"
        if ($push.Output) { Write-Log ('  ' + ($push.Output -replace "`n", "`n  ")) }
        if ($push.ExitCode -eq 0) { $ok = $true; break }
        if ($i -lt 3) { Start-Sleep -Seconds 60 }
    }

    if ($ok) {
        Write-Log '发布成功：Cloudflare Pages 将在 30~60 秒内自动重建。'

        $mirrorScript = Join-Path $Root 'scripts\deploy-mirror.ps1'
        if (Test-Path $mirrorScript) {
            & powershell -NoProfile -ExecutionPolicy Bypass -File $mirrorScript
            if ($LASTEXITCODE -eq 0) {
                Write-Log '国内镜像处理完成（未配置时会自动跳过）。'
            } else {
                Write-Log '国内镜像同步失败，主站不受影响，详见 logs\mirror.log。'
            }
        }
        exit 0
    }

    Write-Log '推送失败：请检查网络、git 凭据（PAT / SSH）与仓库写权限。'
    exit 1
}
catch {
    Write-Log ('错误：' + $_.Exception.Message)
    exit 1
}