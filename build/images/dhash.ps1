param([string]$Dir, [string]$Out)
# Difference hash (9x8 grayscale): robust to renames, resizing and recompression.
Add-Type -AssemblyName System.Drawing
$rows = @()
Get-ChildItem $Dir -Recurse -File -Include *.jpg,*.jpeg,*.png,*.webp | ForEach-Object {
  try {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    $bmp = New-Object System.Drawing.Bitmap 9, 8
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, 9, 8)
    $bits = New-Object System.Text.StringBuilder
    for ($y = 0; $y -lt 8; $y++) {
      for ($x = 0; $x -lt 8; $x++) {
        $a = $bmp.GetPixel($x, $y); $b = $bmp.GetPixel($x + 1, $y)
        $la = 0.299*$a.R + 0.587*$a.G + 0.114*$a.B; $lb = 0.299*$b.R + 0.587*$b.G + 0.114*$b.B
        [void]$bits.Append($(if ($la -gt $lb) { '1' } else { '0' }))
      }
    }
    $rows += [pscustomobject]@{ path = $_.FullName; hash = $bits.ToString(); w = $img.Width; h = $img.Height }
    $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  } catch { Write-Output "skip $($_.FullName)" }
}
$rows | Export-Csv -Path $Out -NoTypeInformation -Encoding UTF8
Write-Output "hashed $($rows.Count)"
