# 注册 Windows 计划任务：每天多次检查并发布（幂等，无变更自动跳过）
# 用法：powershell -ExecutionPolicy Bypass -File scripts\register-task.ps1
#      自定义起始时间：... -File scripts\register-task.ps1 -At 08:30
param(
    [string]$At = '09:00',
    [int]$EveryHours = 3,
    [int]$Times = 5
)

$ErrorActionPreference = 'Stop'
$TaskName = 'AI-Token-Daily-Publish'
$Script   = Join-Path $PSScriptRoot 'publish.ps1'

if (-not (Test-Path $Script)) { throw "找不到脚本：$Script" }

$base = [datetime]::ParseExact($At, 'HH:mm', $null)
$schedule = @()
for ($i = 0; $i -lt $Times; $i++) {
    $schedule += $base.AddHours($EveryHours * $i).ToString('HH:mm')
}

$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$Script`""

$triggers = @($schedule | ForEach-Object { New-ScheduledTaskTrigger -Daily -At $_ })

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
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $triggers `
        -Settings $settings -Principal $principal -Force `
        -Description "每天 $($schedule -join ' / ') 检查看板是否已更新：已更新则提交推送并触发 Cloudflare Pages 重建，未更新则跳过（不会伪造内容）。" | Out-Null

    Write-Host "已注册计划任务：$TaskName" -ForegroundColor Green
    Write-Host "运行时间（每天）：$($schedule -join ' / ')"
    Write-Host "查看状态：Get-ScheduledTaskInfo -TaskName $TaskName"
    Write-Host "立即测试：Start-ScheduledTask -TaskName $TaskName"
    Write-Host "删除任务：Unregister-ScheduledTask -TaskName $TaskName -Confirm:`$false"
}
catch {
    Write-Host ('注册失败：' + $_.Exception.Message) -ForegroundColor Red
    Write-Host '可尝试用「以管理员身份运行 PowerShell」后重试。' -ForegroundColor Yellow
    exit 1
}