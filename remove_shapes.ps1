$files = Get-ChildItem -Path 'c:\Users\learn\Videos\ORIZON-V2\control plane\src\frontend' -Recurse -Filter '*.tsx'
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, 'shadow-\[[^\]]+\]', '')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, '\bshadow(-sm|-md|-lg|-xl|-2xl|-inner|-none)?\b', '')
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($newContent, '\brounded(-sm|-md|-lg|-xl|-2xl|-3xl|-full|-t-[a-z]+|-b-[a-z]+|-l-[a-z]+|-r-[a-z]+|-none)?\b', '')
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
    }
}
