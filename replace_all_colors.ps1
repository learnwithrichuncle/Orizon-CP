$files = Get-ChildItem -Path 'c:\Users\learn\Videos\ORIZON-V2\control plane\src\frontend' -Recurse -Filter '*.tsx'
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, 'text-zinc-[0-9]{2,3}', 'text-fg/80')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'border-zinc-[0-9]{2,3}', 'border-fg/15')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'bg-zinc-[0-9]{2,3}', 'bg-fg/5')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'hover:bg-zinc-[0-9]{2,3}', 'hover:bg-fg/10')
    
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'text-(rose|amber|emerald|cyan|teal|violet)-[0-9]{2,3}(/[0-9]{1,3})?', 'text-accent')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'border-(rose|amber|emerald|cyan|teal|violet)-[0-9]{2,3}(/[0-9]{1,3})?', 'border-accent/30')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'bg-(rose|amber|emerald|cyan|teal|violet)-[0-9]{2,3}(/[0-9]{1,3})?', 'bg-accent/10')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'fill-(rose|amber|emerald|cyan|teal|violet)-[0-9]{2,3}(/[0-9]{1,3})?', 'fill-accent')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'ring-(rose|amber|emerald|cyan|teal|violet)-[0-9]{2,3}(/[0-9]{1,3})?', 'ring-accent/30')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, 'hover:text-zinc-[0-9]{2,3}', 'hover:text-fg')

    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
    }
}
