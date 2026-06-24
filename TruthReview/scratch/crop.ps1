[Reflection.Assembly]::LoadWithPartialName("System.Drawing")
$srcPath = "d:\reviewtraker\TruthReview\assets\hero_banner.jpg"
$destPath = "d:\reviewtraker\TruthReview\assets\hero_banner.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
# The image size is 1024x684. Let's crop out 25px bezel from top, bottom, left, right.
$rect = New-Object System.Drawing.Rectangle(25, 25, 974, 634)
$cropped = $src.Clone($rect, $src.PixelFormat)
$src.Dispose()

# Force overwrite the original file
if (Test-Path $destPath) {
    Remove-Item $destPath -Force
}

$cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$cropped.Dispose()
Write-Host "Cropping successful"
