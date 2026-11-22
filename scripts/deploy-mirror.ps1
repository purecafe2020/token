# 国内镜像部署：把 index.html 同步到腾讯云 CloudBase 静态托管
# 由 publish.ps1 在推送成功后调用；未配置时静默跳过，失败不影响主站
$ErrorActionPreference = 'Stop'

$Root    = Split-Path -Parent $PSScriptRoot
$LogDir  = Join-Path $Root 'logs'
$LogFile = Join-Path $LogDir 'mirror.log'

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log([string]$Message) {
    $line = '{0}  {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
    Write-Host $line
    Add-Content -Path $LogFile -Value $line -Encoding UTF8
}

Set-Location $Root

try {
    $configPath = Join-Path $Root 'mirror.config.json'
    if (-not (Test-Path $configPath)) {
        Write-Log '未找到 mirror.config.json，跳过国内镜像。'
        exit 0
    }

    $config = Get-Content -Path $configPath -Raw -Encoding UTF8 | ConvertFrom-Json
    if (-not $config.enabled) {
        Write-Log 'mirror.config.json 中 enabled=false，跳过国内镜像。'
        exit 0
    }
    if ([string]::IsNullOrWhiteSpace($config.envId)) {
        Write-Log 'envId 为空，跳过国内镜像（见 MIRROR.md 第三节）。'
        exit 0
    }

    $tcb = Get-Command tcb -ErrorAction SilentlyContinue
    if (-not $tcb) {
        Write-Log '未找到 tcb 命令：请先执行 npm i -g @cloudbase/cli 并 tcb login。'
        exit 1
    }

    $targets = @(
        'index.html', 'en/index.html', 'og-image.png', 'og-image-en.png', 'sitemap.xml', 'robots.txt', 'ads.txt',
        'about/index.html', 'privacy/index.html', 'contact/index.html',
        'en/about/index.html', 'en/privacy/index.html', 'en/contact/index.html',
        'favicon.svg', 'favicon-32.png', 'favicon-192.png', 'apple-touch-icon.png'
    ) | Where-Object { Test-Path (Join-Path $Root $_) }

    $failed = @()
    foreach ($file in $targets) {
        $prev = $ErrorActionPreference
        $ErrorActionPreference = 'Continue'
        $output = & tcb hosting deploy $file $file -e $config.envId 2>&1
        $code = $LASTEXITCODE
        $ErrorActionPreference = $prev

        $text = (($output | ForEach-Object { "$_" }) -join "`n").Trim()
        if ($text) { Write-Log ("[$file] " + $text) }
        if ($code -ne 0) {
            $failed += $file
            Write-Log "[$file] 部署失败（退出码 $code）。"
        }
    }

    if ($failed.Count -gt 0) {
        Write-Log ('以下文件部署失败：' + ($failed -join '、'))
        exit 1
    }

    Write-Log ('镜像部署成功（' + ($targets -join '、') + '）。')
    exit 0
}
catch {
    Write-Log ('错误：' + $_.Exception.Message)
    exit 1
}