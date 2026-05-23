$repoPath = "C:\Users\HP Omen\Documents\GitHub\gtavitips"
$files = Get-ChildItem -Path $repoPath -Recurse -Filter "*.html"

$fixed = 0
$skipped = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $changed = $false

    # NAV: Intel Drops in nav is always followed by newline + whitespace + </ul>
    # Footer Intel Drops is followed immediately by <li> (no newline) — safe to distinguish
    if ($content -notmatch '<li><a href="/map">Map</a></li>') {
        $navPattern = '(<li><a href="/intel-drops">Intel Drops</a></li>)(\r?\n\s*</ul>)'
        if ($content -match $navPattern) {
            $content = [regex]::Replace($content, $navPattern, '$1' + "<li><a href=`"/map`">Map</a></li>" + '$2')
            $changed = $true
        }
    }

    # FOOTER: add Map before Sitemap in Site column
    $oldFooter = '<li><a href="/intel-drops">Intel Drops</a></li><li><a href="/sitemap.xml">Sitemap</a></li>'
    $newFooter = '<li><a href="/intel-drops">Intel Drops</a></li><li><a href="/map">Map</a></li><li><a href="/sitemap.xml">Sitemap</a></li>'
    if ($content.Contains($oldFooter)) {
        $content = $content.Replace($oldFooter, $newFooter)
        $changed = $true
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "FIXED: $($file.Name)"
        $fixed++
    } else {
        $skipped++
    }
}

Write-Host ""
Write-Host "Klaar. Gefixed: $fixed | Geen actie nodig: $skipped"