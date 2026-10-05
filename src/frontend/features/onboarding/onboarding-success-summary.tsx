import type { ReactNode } from "react";
import { AppIcon } from "../../components/ui/primitives";

export function OnboardingSuccessSummaryRow({
  icon,
  label,
  value,
  status,
  active,
  logo,
}: {
  icon?: unknown;
  label: string;
  value: string;
  status: string;
  active: boolean;
  logo?: ReactNode;
}) {
  return (
    <div className="grid gap-4 border-b border-fg/10 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid h-9 w-9 flex-none place-items-center border border-fg/15 bg-fg/5 text-fg/80">
          {logo ?? <AppIcon icon={icon} size={16} />}
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-fg/80">
            {label}
          </span>
          <span className="mt-1 block truncate text-sm text-fg">
            {value}
          </span>
        </span>
      </div>
      <span
        className={`w-fit px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] ${
          active
            ? "bg-fg text-bg"
            : "border border-fg/15 text-fg/80"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

export function OnboardingSuccessSummarySkeleton() {
  return (
    <div className="grid gap-4 border-b border-fg/10 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="flex items-center gap-3">
        <span className="h-1.5 w-1.5 bg-accent animate-pulse" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-fg/40">
          Loading configuration...
        </span>
      </div>
    </div>
  );
}
