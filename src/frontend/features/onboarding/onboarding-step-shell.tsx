import { DatabaseExportIcon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { BrandMark } from "../../components/ui/brand-mark";
import { AppIcon } from "../../components/ui/primitives";

const setupSteps = [
  "Owner account",
  "Runtime",
  "GitHub",
  "Root domain",
  "Backups",
];

export function OnboardingStepShell({
  activeStep,
  children,
  onImport,
  onStepChange,
  steps = setupSteps,
}: {
  activeStep: number;
  children: ReactNode;
  onImport?: () => void;
  onStepChange?: (step: number) => void;
  steps?: string[];
}) {
  const percent = Math.round((activeStep / Math.max(1, steps.length - 1)) * 100);

  return (
    <main className="relative isolate min-h-dvh bg-bg text-fg overflow-y-auto flex flex-col">
      <div className="hero-noise absolute inset-0 pointer-events-none -z-10" />
      
      <div className="absolute top-0 left-0 right-0 h-1 bg-fg/5 z-20">
        <div 
          className="h-full bg-accent transition-all duration-500 ease-out" 
          style={{ width: `${percent}%` }}
        />
      </div>

      <header className="relative z-20 flex items-center justify-between p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center bg-fg text-bg shadow-[0_0_15px_rgba(233,237,240,0.15)]">
            <BrandMark className="h-5 w-5" />
          </span>
          <div>
            <div className="font-hero text-sm font-bold uppercase tracking-widest text-fg">
              Orizon CP
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent flex items-center gap-2 mt-0.5">
              <span className="h-1 w-1 bg-accent animate-pulse" />
              Deployment Active
            </div>
          </div>
        </div>

        {onImport && (
          <button
            type="button"
            className="group flex items-center gap-2 border border-fg/20 bg-bg/50 backdrop-blur px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-fg/80 transition-colors hover:border-fg/40 hover:text-fg"
            onClick={onImport}
          >
            <AppIcon icon={DatabaseExportIcon} size={14} className="transition-transform group-hover:-translate-y-0.5" />
            <span className="hidden sm:inline">Import Configuration</span>
            <span className="inline sm:hidden">Import</span>
          </button>
        )}
      </header>

      <section className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative z-10">
        <div className="w-full max-w-[580px] animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          
          {/* Technical Corner Brackets */}
          <div className="absolute -left-3 -top-3 h-3 w-3 border-l-2 border-t-2 border-fg/30 pointer-events-none" />
          <div className="absolute -right-3 -top-3 h-3 w-3 border-r-2 border-t-2 border-fg/30 pointer-events-none" />
          <div className="absolute -left-3 -bottom-3 h-3 w-3 border-l-2 border-b-2 border-fg/30 pointer-events-none" />
          <div className="absolute -right-3 -bottom-3 h-3 w-3 border-r-2 border-b-2 border-fg/30 pointer-events-none" />
          
          <div className="border border-fg/15 bg-bg/80 backdrop-blur-xl p-8 sm:p-12">
            <div className="mb-10 flex items-center justify-between border-b border-fg/10 pb-5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg/60">
                SEQ_INIT // {String(activeStep + 1).padStart(2, '0')}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-fg/40">
                {steps[activeStep]}
              </div>
            </div>

            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
