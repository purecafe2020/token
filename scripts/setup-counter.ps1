# 一键部署计数器：登录 → 建 KV → 写配置 → 部署 → 绑自定义域名
# 用法：powershell -ExecutionPolicy Bypass -File scripts\setup-counter.ps1
#      不自动绑域名：... -File scripts\setup-counter.ps1 -NoDomain
#      指定域名：... -File scripts\setup-counter.ps1 -Domain counter.879879.xyz
param(
    [string]$Domain = 'counter.879879.xyz',
    [switch]$NoDomain
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Dir  = Join-Path $Root 'counter'
Set-Location $Dir

function Fail([string]$Message) {
    Write-Host $Message -ForegroundColor Red
    exit 1
}

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    Fail '未找到 npx：请先安装 Node.js（https://nodejs.org）后重试。'
}

Write-Host '== 1/4 检查登录状态 ==' -ForegroundColor Cyan
$prev = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
$who = (& npx --yes wrangler whoami 2>&1) -join "`n"
$ErrorActionPreference = $prev

if ($LASTEXITCODE -ne 0 -or $who -match 'not logged in|not authenticated|You are not logged in') {
    Write-Host '未登录，正在打开浏览器授权...' -ForegroundColor Yellow
    & npx --yes wrangler login
    if ($LASTEXITCODE -ne 0) { Fail '登录失败，请重试。' }
}
Write-Host '登录状态正常。' -ForegroundColor Green

Write-Host '== 2/4 准备 KV namespace ==' -ForegroundColor Cyan
$kvId = $null
$prev = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
$listRaw = (& npx --yes wrangler kv namespace list 2>&1) -join "`n"
$ErrorActionPreference = $prev

$start = $listRaw.IndexOf('[')
$end = $listRaw.LastIndexOf(']')
if ($start -ge 0 -and $end -gt $start) {
    try {
        $list = $listRaw.Substring($start, $end - $start + 1) | ConvertFrom-Json
        $hit = $list | Where-Object { $_.title -eq 'token-counter-COUNTER' } | Select-Object -First 1
        if ($hit) { $kvId = $hit.id }
    } catch { }
}

if ($kvId) {
    Write-Host "复用已有 KV：$kvId"
} else {
    Write-Host '创建 KV namespace: COUNTER'
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $out = (& npx --yes wrangler kv namespace create COUNTER 2>&1) -join "`n"
    $ErrorActionPreference = $prev
    Write-Host $out
    $m = [regex]::Match($out, 'id\s*=\s*"([^"]+)"')
    if ($m.Success) { $kvId = $m.Groups[1].Value }
}

if ([string]::IsNullOrWhiteSpace($kvId)) {
    Fail '未能自动获取 KV ID。请到 Cloudflare 后台创建 KV 后，手动填写 counter\wrangler.toml 的 id 字段。'
}
Write-Host "KV ID：$kvId" -ForegroundColor Green

Write-Host '== 3/4 写配置 ==' -ForegroundColor Cyan
$toml = @"
name = "token-counter"
main = "worker.js"
compatibility_date = "2026-11-01"

[[kv_namespaces]]
binding = "COUNTER"
id = "$kvId"
"@

if (-not $NoDomain) {
    $toml += @"

routes = [
  { pattern = "$Domain", custom_domain = true }
]
"@
}

[IO.File]::WriteAllText((Join-Path $Dir 'wrangler.toml'), $toml, (New-Object Text.UTF8Encoding($false)))
Write-Host '已写入 counter\wrangler.toml'

Write-Host '== 4/4 部署 ==' -ForegroundColor Cyan
$prev = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
& npx --yes wrangler deploy
$code = $LASTEXITCODE
$ErrorActionPreference = $prev

if ($code -ne 0) {
    Write-Host '' 
    Write-Host '部署失败。如果报错与自定义域名有关，可先只部署 Worker：' -ForegroundColor Yellow
    Write-Host "    powershell -ExecutionPolicy Bypass -File scripts\setup-counter.ps1 -NoDomain" -ForegroundColor Yellow
    Write-Host '然后到 Cloudflare 后台手动绑定 counter.879879.xyz。'
    exit 1
}

Write-Host ''
Write-Host '部署完成。' -ForegroundColor Green
if (-not $NoDomain) {
    Write-Host "验证：https://$Domain/stats"
    Write-Host "首页计数：https://$Domain/hit （POST）"
} else {
    Write-Host '别忘了在后台给 Worker 绑自定义域名 counter.879879.xyz。'
}
Write-Host '绑定生效后，刷新看板页脚就会出现「今日 N 次访问 · 累计 M 次」。'