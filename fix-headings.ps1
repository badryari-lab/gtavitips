<#
.SYNOPSIS
  Applies white+blue heading split to h1 and h2 elements across the hub.
.PARAMETER Apply
  Write changes to disk. Without this flag, runs as dry run only.
#>
param([switch]$Apply)

function Invoke-SplitHtml([string]$text, [bool]$inline) {
    # Strip any existing spans
    $clean = $text -replace '<span[^>]*>', '' -replace '</span>', ''
    $clean = $clean.Trim()

    $tokens = @($clean -split '\s+' | Where-Object { $_ -ne '' })
    $n = $tokens.Count

    # 1 word: no split — stays white via parent CSS
    if ($n -le 1) { return $clean }

    $s = if ($inline) { '<span style="color:var(--blue)">' } else { '<span>' }

    # & rule: text before &amp; = white, &amp; onward = blue
    if ($clean -match '&amp;') {
        if ($clean -match '^(.*?)\s*(&amp;.+)$') {
            $b = $Matches[1].Trim(); $a = $Matches[2].Trim()
            if ($b) { return "$b $s$a</span>" }
        }
        return $clean
    }

    # : rule: up to and including colon = white, rest = blue
    if ($clean -match '^(.+?:)\s*(.+)$') {
        return "$($Matches[1].Trim()) $s$($Matches[2].Trim())</span>"
    }

    # General: ceil(n/2) white + floor(n/2) blue
    $wc = [Math]::Ceiling($n / 2)
    $white = ($tokens[0..($wc - 1)]) -join ' '
    $blue  = ($tokens[$wc..($n - 1)]) -join ' '
    return "$white $s$blue</span>"
}

$hubPath = "C:\Users\HP Omen\Documents\GitHub\gtavitips\hub"
$files   = Get-ChildItem -Path $hubPath -Recurse -Filter "*.html"
$enc     = [System.Text.UTF8Encoding]::new($false)   # UTF-8 without BOM

$changedFiles = 0

foreach ($file in $files) {
    $content  = [System.IO.File]::ReadAllText($file.FullName, $enc)
    $original = $content

    # ── Step 1: Fix CSS color for h2 classes that are currently var(--blue) ──
    foreach ($cls in 'index-section__h2', 'faq-section__h2', 'section__h2') {
        $esc     = [regex]::Escape($cls)
        $content = [regex]::Replace(
            $content,
            "(\.$esc\s*\{[^}]*)color:\s*var\(--blue\)",
            '$1color: var(--t1)'
        )
    }

    # ── Step 2: Apply span split to static heading elements ──
    $isNewsPage = $file.FullName -match [regex]::Escape($hubPath + '\news\')

    $rules = @(
        if (-not $isNewsPage) {
            [pscustomobject]@{ re = '(<h1\s+class="page-header__h1">)(.*?)(</h1>)';        inline = $false }
        }
        [pscustomobject]@{ re = '(<h2\s+class="index-section__h2"[^>]*>)(.*?)(</h2>)';     inline = $true  }
        [pscustomobject]@{ re = '(<h2\s+class="faq-section__h2"[^>]*>)(.*?)(</h2>)';       inline = $true  }
        [pscustomobject]@{ re = '(<h2\s+class="section__h2"[^>]*>)(.*?)(</h2>)';           inline = $true  }
        [pscustomobject]@{ re = '(<h2\s+class="drop__title"[^>]*>)(.*?)(</h2>)';           inline = $true  }
    )

    $opts  = [System.Text.RegularExpressions.RegexOptions]::Singleline
    foreach ($rule in $rules) {
        $regex = [regex]::new($rule.re, $opts)
        $ms    = $regex.Matches($content)
        # Reverse order so replacements don't shift positions of earlier matches
        for ($i = $ms.Count - 1; $i -ge 0; $i--) {
            $m     = $ms[$i]
            $open  = $m.Groups[1].Value
            $inner = $m.Groups[2].Value
            $close = $m.Groups[3].Value
            $split = Invoke-SplitHtml $inner $rule.inline
            if ($split -ne $inner) {
                $content = $content.Substring(0, $m.Index) + $open + $split + $close + $content.Substring($m.Index + $m.Length)
            }
        }
    }

    # ── Step 3: JS template fix for dynamically generated index-section__h2 ──
    # Weapons and brands render h2s from JSON via JS. Inject a splitTitle helper
    # so dynamic h2s also get the white+blue split.
    $jsHelper = "      function splitTitle(t){" + [Environment]::NewLine +
                "        t=String(t).trim();var w=t.split(/\s+/).filter(Boolean),n=w.length;" + [Environment]::NewLine +
                "        if(n<=1)return t;" + [Environment]::NewLine +
                "        var s='<span style=""color:var(--blue)"">';" + [Environment]::NewLine +
                "        if(t.indexOf('&')!==-1){var m=t.match(/^(.*?)\s*(&.+)$/);if(m&&m[1])return m[1]+' '+s+m[2]+'</span>';return t;}" + [Environment]::NewLine +
                "        if(t.indexOf(':')!==-1){var m=t.match(/^(.+?:)\s*(.+)$/);if(m)return m[1]+' '+s+m[2]+'</span>';}" + [Environment]::NewLine +
                "        var wc=Math.ceil(n/2);return w.slice(0,wc).join(' ')+' '+s+w.slice(wc).join(' ')+'</span>';" + [Environment]::NewLine +
                "      }"

    if ($content -match [regex]::Escape("'+sec.title+'") -and $content -match 'index-section__h2') {
        if ($content -notmatch 'function splitTitle') {
            # Insert helper just before the fetch call
            $fetchPat = '(fetch\s*\(\s*[''"]\/assets\/data\/(?:weapons|brands)\.json[''"])'
            $content  = [regex]::Replace($content, $fetchPat, "$jsHelper`n      `$1")
        }
        $content = $content -replace [regex]::Escape("'+sec.title+'"), "'+splitTitle(sec.title)+'"
    }

    if ($content -ne $original) {
        $changedFiles++
        $rel = $file.FullName -replace [regex]::Escape($hubPath + '\'), ''
        Write-Host "CHANGED: $rel"
        if ($Apply) {
            [System.IO.File]::WriteAllText($file.FullName, $content, $enc)
        }
    }
}

Write-Host ""
Write-Host "Files changed: $changedFiles"
if (-not $Apply) { Write-Host "Dry run only - pass -Apply to write changes." }
