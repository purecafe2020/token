# 国内镜像一键配置：检查 CLI → 登录 → 写入 envId → 首次部署
# 用法：powershell -ExecutionPolicy Bypass -File scripts\setup-mirror.ps1
#      非交互：... -File scripts\setup-mirror.ps1 -EnvId <环境ID>
#      只写配置不部署：... -File scripts\setup-mirror.ps1 -EnvId <环境ID> -DryRun
param(
    [string]$EnvId,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Fail([string]$Message) {
    Write-Host $Message -ForegroundColor Red
    exit 1
}

# 1. 检查 CLI
if (-not (Get-Command tcb -ErrorAction SilentlyContinue)) {
    Write-Host '未检测到 CloudBase CLI。' -ForegroundColor Yellow
    Write-Host '请先在本机 PowerShell 执行：' -ForegroundColor Yellow
    Write-Host '    npm i -g @cloudbase/cli' -ForegroundColor White
    Write-Host '安装完成后重新运行本脚本。'
    exit 1
}

Write-Host '已检测到 tcb：' -NoNewline
& tcb --version 2>&1 | Select-Object -First 1

# 2. 检查登录状态（兼容 v1 / v2 命令写法）
function Test-Login {
    $null = & tcb env list 2>&1
    if ($LASTEXITCODE -eq 0) { return $true }
    $null = & tcb env:list 2>&1
    return ($LASTEXITCODE -eq 0)
}

if (-not (Test-Login)) {
    Write-Host '尚未登录腾讯云，正在打开浏览器授权...' -ForegroundColor Yellow
    & tcb login
    if (-not (Test-Login)) {
        Fail '登录未完成。请手动执行 tcb login 成功后再运行本脚本。'
    }
}
Write-Host '登录状态正常。' -ForegroundColor Green

# 3. 取环境 ID
if ([string]::IsNullOrWhiteSpace($EnvId)) {
    Write-Host ''
    Write-Host '请到控制台「环境总览」复制环境 ID（形如 token-daily-1g2h3j4k）。'
    $EnvId = Read-Host '粘贴环境 ID'
}
$EnvId = $EnvId.Trim()
if ([string]::IsNullOrWhiteSpace($EnvId)) { Fail '环境 ID 不能为空。' }

# 4. 写配置（UTF-8 无 BOM，JSON 干净）
$configPath = Join-Path $Root 'mirror.config.json'
$config = [ordered]@{
    enabled  = $true
    provider = 'cloudbase'
    envId    = $EnvId
} | ConvertTo-Json
[IO.File]::WriteAllText($configPath, $config, (New-Object Text.UTF8Encoding($false)))
Write-Host "已写入 mirror.config.json（envId=$EnvId）" -ForegroundColor Green

if ($DryRun) {
    Write-Host 'DryRun：跳过首次部署。' -ForegroundColor Yellow
    exit 0
}

# 5. 首次部署
Write-Host '开始首次部署 index.html ...'
& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'deploy-mirror.ps1')
if ($LASTEXITCODE -ne 0) {
    Fail '首次部署失败：查看 logs\mirror.log，或手动执行 scripts\deploy-mirror.ps1 排查。'
}

Write-Host ''
Write-Host '配置完成。' -ForegroundColor Green
Write-Host '下一步：到控制台「静态网站托管 → 文件管理」确认根目录有 index.html，'
Write-Host '页面右上角就是默认域名（形如 https://<envId>-xxx.tcloudbaseapp.com），国内可直接访问。'
Write-Host '之后每天发布时，publish.ps1 会自动同步到这个镜像。'