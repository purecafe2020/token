# 生成分享缩略图（中/英双语）
# 用法：powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1 [-Lang en]
param([string]$Lang = 'zh')
Add-Type -AssemblyName System.Drawing

$W = 1200
$H = 630
$Root = Split-Path -Parent $PSScriptRoot
$isEn = $Lang -eq 'en'
$OUT = Join-Path $Root ($(if ($isEn) { 'og-image-en.png' } else { 'og-image.png' }))

$total = 31; $free = 13; $limit = 6; $trap = 5
$dealsPath = Join-Path $Root 'data\deals.json'
if (Test-Path $dealsPath) {
    $deals = Get-Content -Path $dealsPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $total = @($deals | Where-Object { -not $_.expired }).Count
    $free  = @($deals | Where-Object { $_.type -eq 'free' -and -not $_.expired }).Count
    $limit = @($deals | Where-Object { $_.type -eq 'limit' -and -not $_.expired }).Count
    $trap  = @($deals | Where-Object { $_.type -eq 'trap' }).Count
}

$dateText = Get-Date -Format 'yyyy-MM-dd'
$htmlPath = Join-Path $Root 'index.html'
if (Test-Path $htmlPath) {
    $m = [regex]::Match((Get-Content -Path $htmlPath -Raw -Encoding UTF8), 'const UPDATED = "(\d{4}-\d{2}-\d{2})')
    if ($m.Success) { $dateText = $m.Groups[1].Value }
}

if ($isEn) {
    $topLabel = 'Free AI credit intel - verified daily'
    $title    = 'Token Daily'
    $sub      = 'Free LLM API credits / limited deals / trial grants'
    $tags     = @('Verified', 'Free', 'Limited', 'Avoid')
    $update   = 'Rebuilt daily'
} else {
    $topLabel = '免费 AI 额度情报 · 每日核实'
    $title    = 'Token 日报'
    $sub      = '免费大模型 API 额度 / 限时优惠 / 新用户试用金'
    $tags     = @('已核实条目', '长期白嫖', '限时活动', '避坑提醒')
    $update   = '每日 09:00 自动更新'
}

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect, [System.Drawing.Color]::FromArgb(255, 78, 0), [System.Drawing.Color]::FromArgb(255, 176, 0), 15.0)
$g.FillRectangle($bg, $rect)

$halo = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(26, 255, 255, 255))
$g.FillEllipse($halo, 830, -190, 520, 520)
$g.FillEllipse($halo, 980, 360, 400, 400)
$halo.Dispose()

$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$soft = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(225, 255, 255, 255))
$faint = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 255, 255, 255))

$fLabel = New-Object System.Drawing.Font('Microsoft YaHei', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fTitle = New-Object System.Drawing.Font('Microsoft YaHei', $(if ($isEn) { 96 } else { 76 }), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fSub = New-Object System.Drawing.Font('Microsoft YaHei', $(if ($isEn) { 28 } else { 32 }), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fNum = New-Object System.Drawing.Font('Segoe UI', 58, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fTag = New-Object System.Drawing.Font('Microsoft YaHei', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fSmall = New-Object System.Drawing.Font('Consolas', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

$g.DrawString($topLabel, $fLabel, $soft, 80, 86)
$g.DrawString($title, $fTitle, $white, 74, 128)
$g.DrawString($sub, $fSub, $soft, 80, 244)

$linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), 2)
$g.DrawLine($linePen, 80, 318, 1120, 318)
$linePen.Dispose()

$values = @($total, $free, $limit, $trap)
$xs = @(80, 340, 600, 860)
for ($i = 0; $i -lt 4; $i++) {
    $g.DrawString([string]$values[$i], $fNum, $white, [float]$xs[$i], 356)
    $g.DrawString($tags[$i], $fTag, $faint, [float]$xs[$i], 432)
}

$g.DrawString('token.879879.xyz', $fSmall, $soft, 80, 546)
$g.DrawString($update, $fTag, $faint, 880, 500)
$dateSize = $g.MeasureString($dateText, $fSmall)
$g.DrawString($dateText, $fSmall, $faint, [float](1120 - $dateSize.Width), 546)

$g.Dispose()
$bmp.Save($OUT, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "已生成：$OUT" -ForegroundColor Green