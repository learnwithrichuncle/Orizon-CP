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
  const progressPercent = ((activeStep + 1) / steps.length) * 100;

  return (
    <main className="relative flex min-h-dvh flex-col items-center bg-[#000000] text-white">
      {/* Top Progress Bar - Flat edges, high contrast */}
      <div className="absolute left-0 top-0 h-1 w-full bg-[#111111]">
        <div 
          className="h-full bg-white transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex w-full max-w-2xl flex-col px-6 py-12 sm:px-12 md:py-20">
        
        {/* Header - Brand & Step Info */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center bg-white text-black">
              <BrandMark className="h-4 w-4" />
            </span>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Orizon CP
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Step {String(activeStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
            </div>
            <div className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
              {steps[activeStep]}
            </div>
          </div>
        </header>

        {/* Form Content */}
        <section className="flex-1 w-full">
          {children}
        </section>

        {/* Footer actions */}
        <footer className="mt-16 flex items-center justify-between">
          {onImport ? (
            <button
              type="button"
              className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:text-white"
              onClick={onImport}
            >
              <AppIcon icon={DatabaseExportIcon} size={14} />
              Import Configuration
            </button>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              Re-run setup
            </span>
          )}
        </footer>
      </div>
    </main>
  );
}
