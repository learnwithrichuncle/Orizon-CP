export function ProjectsGridSkeleton() {
  return (
    <div className="flex h-64 items-center justify-center border border-fg/10 bg-fg/[0.02]">
      <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-500">
        <span className="h-1.5 w-1.5 bg-accent animate-pulse" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg/60">
          Loading projects
        </span>
      </div>
    </div>
  );
}
