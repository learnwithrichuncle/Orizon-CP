import {
  ArrowLeft01Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import type { FormEvent, ReactNode } from "react";
import { AppIcon } from "../../components/ui/primitives";

export function OnboardingStepForm({
  icon,
  eyebrow,
  title,
  badge,
  description,
  children,
  error,
  submitting,
  nextLabel,
  actionLabel,
  finish = false,
  onSubmit,
  onBack,
}: {
  icon: unknown;
  eyebrow: string;
  title: string;
  badge: string;
  description: ReactNode;
  children: ReactNode;
  error: string;
  submitting: boolean;
  nextLabel: string;
  actionLabel: string;
  finish?: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack?: () => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full"
      aria-label={title}
    >
      <div className="mb-10">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-12 w-12 flex-none place-items-center border border-accent/30 bg-accent/10 text-accent">
            <AppIcon icon={icon} size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                {eyebrow}
              </p>
              {badge && (
                <span className="bg-fg/10 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-fg/60">
                  {badge}
                </span>
              )}
            </div>
            <h2 className="mt-1 font-hero text-2xl tracking-tight text-fg sm:text-3xl">
              {title}
            </h2>
          </div>
        </div>

        <div className="text-sm leading-relaxed text-fg/70">
          {description}
        </div>
      </div>

      <div className="space-y-6">
        {children}
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-8 flex items-center gap-3 border border-fg/20 bg-fg/5 px-4 py-3 text-sm text-fg"
        >
          {error}
        </div>
      ) : null}

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-fg/15 pt-8 sm:flex-row sm:items-center sm:gap-4">
        {onBack ? (
          <button
            type="button"
            disabled={submitting}
            onClick={onBack}
            className="flex h-12 items-center justify-center gap-2 border border-fg/20 bg-transparent px-6 font-mono text-[11px] font-bold uppercase tracking-widest text-fg/80 transition hover:border-fg/40 hover:text-fg disabled:opacity-50"
            aria-label="Previous step"
          >
            <AppIcon icon={ArrowLeft01Icon} size={14} />
            Back
          </button>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="group flex h-12 flex-1 items-center justify-between border border-accent/40 bg-accent/15 px-6 font-mono text-[11px] font-bold uppercase tracking-widest text-accent transition hover:bg-accent/25 disabled:cursor-wait disabled:opacity-50"
        >
          <span>{submitting ? "Processing..." : actionLabel}</span>
          <AppIcon
            icon={finish ? CheckmarkCircle02Icon : ArrowRight02Icon}
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </form>
  );
}
