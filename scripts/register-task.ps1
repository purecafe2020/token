# 注册 Windows 计划任务：每天定时执行 publish.ps1
# 用法：powershell -ExecutionPolicy Bypass -File scripts\register-task.ps1
#      自定义时间：... -File scripts\register-task.ps1 -At 08:30
param(
    [string]$At = '09:00'
)

$ErrorActionPreference = 'Stop'
$TaskName = 'AI-Token-Daily-Publish'
$Script   = Join-Path $PSScriptRoot 'publish.ps1'

if (-not (Test-Path $Script)) { throw "找不到脚本：$Script" }

$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$Script`""

$trigger = New-ScheduledTaskTrigger -Daily -At $At

$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 30)

$principal = New-ScheduledTaskPrincipal `
    -UserId "$env:USERDOMAIN\$env:USERNAME" `
    -LogonType Interactive `
    -RunLevel Limited

try {
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger `
        -Settings $settings -Principal $principal -Force `
        -Description '每天把已核实的 AI Token 看板推送到 Cloudflare Pages（内容由 Agent 先在会话中更新）' | Out-Null

    Write-Host "已注册计划任务：$TaskName（每天 $At）" -ForegroundColor Green
    Write-Host "查看状态：Get-ScheduledTaskInfo -TaskName $TaskName"
    Write-Host "立即测试：Start-ScheduledTask -TaskName $TaskName"
    Write-Host "删除任务：Unregister-ScheduledTask -TaskName $TaskName -Confirm:`$false"
}
catch {
    Write-Host ('注册失败：' + $_.Exception.Message) -ForegroundColor Red
    Write-Host '可尝试用「以管理员身份运行 PowerShell」后重试。' -ForegroundColor Yellow
    exit 1
}