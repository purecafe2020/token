# 生成分享缩略图 og-image.png（1200x630）
# 用法：powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1
Add-Type -AssemblyName System.Drawing

$W = 1200
$H = 630
$OUT = Join-Path (Split-Path -Parent $PSScriptRoot) 'og-image.png'

$bmp = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# 渐变背景：品牌橙 → 琥珀
$rect = New-Object System.Drawing.Rectangle(0, 0, $W, $H)
$bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 78, 0),
    [System.Drawing.Color]::FromArgb(255, 176, 0),
    15.0
)
$g.FillRectangle($bg, $rect)

# 装饰圆
$halo = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(26, 255, 255, 255))
$g.FillEllipse($halo, 830, -190, 520, 520)
$g.FillEllipse($halo, 980, 360, 400, 400)
$halo.Dispose()

$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$soft = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(225, 255, 255, 255))
$faint = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 255, 255, 255))

$fLabel = New-Object System.Drawing.Font('Microsoft YaHei', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fTitle = New-Object System.Drawing.Font('Microsoft YaHei', 66, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fSub = New-Object System.Drawing.Font('Microsoft YaHei', 32, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fNum = New-Object System.Drawing.Font('Segoe UI', 58, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fTag = New-Object System.Drawing.Font('Microsoft YaHei', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fSmall = New-Object System.Drawing.Font('Consolas', 24, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)

# 顶部标签
$g.DrawString('每日核实 · 什么值得买风格', $fLabel, $soft, 80, 86)

# 主标题
$g.DrawString('AI Token 羊毛日报', $fTitle, $white, 74, 138)

# 副标题
$g.DrawString('免费大模型 API 额度 / 限时优惠 / 新用户试用金', $fSub, $soft, 80, 236)

# 分隔线
$linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(90, 255, 255, 255), 2)
$g.DrawLine($linePen, 80, 318, 1120, 318)
$linePen.Dispose()

# 四个统计块
$stats = @(
    @{ X = 80;  Num = '24'; Tag = '已核实条目' },
    @{ X = 340; Num = '11'; Tag = '长期白嫖' },
    @{ X = 600; Num = '4';  Tag = '限时活动' },
    @{ X = 860; Num = '5';  Tag = '避坑提醒' }
)
foreach ($s in $stats) {
    $g.DrawString($s.Num, $fNum, $white, [float]$s.X, 356)
    $g.DrawString($s.Tag, $fTag, $faint, [float]$s.X, 432)
}

# 底部
$g.DrawString('token.879879.xyz', $fSmall, $soft, 80, 546)

$dateText = '2026-11-20'
$dateSize = $g.MeasureString($dateText, $fSmall)
$g.DrawString($dateText, $fSmall, $faint, [float](1120 - $dateSize.Width), 546)

# 右下角小提示
$g.DrawString('每日 09:00 自动更新', $fTag, $faint, 880, 500)

$g.Dispose()
$bmp.Save($OUT, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Host "已生成：$OUT ($W x $H)" -ForegroundColor Green