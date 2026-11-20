# 生成站点图标：favicon-32.png / favicon-192.png / apple-touch-icon.png
# 用法：powershell -ExecutionPolicy Bypass -File scripts\make-icons.ps1
Add-Type -AssemblyName System.Drawing

$Root = Split-Path -Parent $PSScriptRoot

function New-RoundIcon([int]$Size, [string]$File) {
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Transparent)

    $radius = [int]($Size * 0.22)
    $d = $radius * 2
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($Size - $d, 0, $d, $d, 270, 90)
    $path.AddArc($Size - $d, $Size - $d, $d, $d, 0, 90)
    $path.AddArc(0, $Size - $d, $d, $d, 90, 90)
    $path.CloseFigure()

    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(255, 78, 0),
        [System.Drawing.Color]::FromArgb(255, 176, 0),
        45.0
    )
    $g.FillPath($brush, $path)

    $font = New-Object System.Drawing.Font(
        'Segoe UI', [float]($Size * 0.42), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel
    )
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $layout = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $g.DrawString('TK', $font, [System.Drawing.Brushes]::White, $layout, $sf)

    $g.Dispose()
    $bmp.Save((Join-Path $Root $File), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "已生成 $File ($Size x $Size)"
}

New-RoundIcon 32 'favicon-32.png'
New-RoundIcon 192 'favicon-192.png'
New-RoundIcon 180 'apple-touch-icon.png'