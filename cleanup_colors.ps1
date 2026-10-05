$files = Get-ChildItem -Path 'c:\Users\learn\Videos\ORIZON-V2\control plane\src\frontend' -Recurse -Filter '*.tsx'
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content.Replace('bg-[#000000]', 'bg-bg')
    $newContent = $newContent.Replace('bg-black', 'bg-bg')
    $newContent = $newContent.Replace('bg-zinc-950', 'bg-bg')
    $newContent = $newContent.Replace('bg-zinc-900', 'bg-bg')
    $newContent = $newContent.Replace('bg-white text-black', 'bg-fg text-bg')
    $newContent = $newContent.Replace('text-black', 'text-bg')
    $newContent = $newContent.Replace('border-white/10', 'border-fg/10')
    $newContent = $newContent.Replace('border-white/15', 'border-fg/15')
    $newContent = $newContent.Replace('border-white/20', 'border-fg/20')
    $newContent = $newContent.Replace('border-white/30', 'border-fg/30')
    $newContent = $newContent.Replace('border-white/35', 'border-fg/35')
    $newContent = $newContent.Replace('border-white/40', 'border-fg/40')
    $newContent = $newContent.Replace('border-white/50', 'border-fg/50')
    $newContent = $newContent.Replace('hover:text-white', 'hover:text-fg')
    $newContent = $newContent.Replace('hover:bg-white/[0.05]', 'hover:bg-fg/5')
    $newContent = $newContent.Replace('bg-white/[0.05]', 'bg-fg/5')
    $newContent = $newContent.Replace('bg-white/[0.03]', 'bg-fg/[0.03]')
    $newContent = $newContent.Replace('bg-white/[0.02]', 'bg-fg/[0.02]')
    $newContent = $newContent.Replace('bg-white/10', 'bg-fg/10')
    $newContent = $newContent.Replace('bg-white/5', 'bg-fg/5')
    $newContent = $newContent.Replace('border-white', 'border-fg')
    $newContent = $newContent.Replace('bg-white', 'bg-fg')
    $newContent = $newContent.Replace('text-white', 'text-fg')

    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
    }
}
