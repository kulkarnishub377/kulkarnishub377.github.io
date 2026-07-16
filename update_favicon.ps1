$sourceImage = "C:\Users\127460\.gemini\antigravity-ide\brain\29d0b2af-9ef8-4789-b469-c8cfc5b23add\sk_logo_minimalist_1784178046840.png"
$targetDir = "d:\SK_docs\projet\kulkarnishub377.github.io\favicon"

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($sourceImage)

function Resize-Image($image, $width, $height, $path) {
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.DrawImage($image, 0, 0, $width, $height)
    $graphics.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Resize-Image $img 16 16 "$targetDir\favicon-16x16.png"
Resize-Image $img 32 32 "$targetDir\favicon-32x32.png"
Resize-Image $img 192 192 "$targetDir\android-chrome-192x192.png"
Resize-Image $img 512 512 "$targetDir\android-chrome-512x512.png"
Resize-Image $img 180 180 "$targetDir\apple-touch-icon.png"

$bmp = New-Object System.Drawing.Bitmap(32, 32)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.DrawImage($img, 0, 0, 32, 32)
$graphics.Dispose()
$bmp.Save("$targetDir\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Icon)
$bmp.Dispose()

$img.Dispose()
Write-Host "Favicons updated successfully!"
