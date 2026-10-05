export function OnboardingPageSkeleton() {
  return (
    <main className="relative isolate min-h-dvh flex flex-col items-center justify-center bg-bg text-fg">
      <div className="hero-noise absolute inset-0 pointer-events-none -z-10" />
      <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-500">
        <span className="h-1.5 w-1.5 bg-accent animate-pulse" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg/60">
          Initializing
        </span>
      </div>
    </main>
  );
}
