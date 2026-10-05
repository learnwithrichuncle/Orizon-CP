import {
  ArrowRight02Icon,
  ShieldUserIcon,
} from "@hugeicons/core-free-icons";
import type { FormEvent } from "react";
import { AppIcon } from "../../components/ui/primitives";
import type { OnboardingForm } from "./onboarding-types";
import { OnboardingStepShell } from "./onboarding-step-shell";
import { OwnerStep } from "./owner-step";

type OnboardingOwnerPageProps = {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
  error: string;
  submitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onImport: () => void;
};

export function OnboardingOwnerPage({
  form,
  update,
  error,
  submitting,
  onSubmit,
  onImport,
}: OnboardingOwnerPageProps) {
  return (
    <OnboardingStepShell activeStep={0} onImport={onImport}>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-[520px]"
        aria-label="Create owner account"
      >
        <div className="mb-9 flex items-start justify-between gap-5">
          <div>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center bg-fg text-bg">
              <AppIcon icon={ShieldUserIcon} size={18} />
            </div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-fg/80">
              Step 01 · Identity
            </p>
            <h2 className="mt-2 font-hero text-2xl tracking-[-0.04em] text-fg sm:text-3xl">
              Provision Administrator Identity
            </h2>
          </div>
          <span className="mt-1 bg-fg/10 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-fg/80">
            Required
          </span>
        </div>

        <p className="mb-8 max-w-md text-sm leading-6 text-fg/80">
          Initialize root cryptographic identity and establish primary permissions for this control plane instance.
        </p>

        <OwnerStep form={form} update={update} />

        <div className="mt-7 flex items-start gap-3 bg-fg/5/50 p-4">
          <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center bg-fg/5 text-fg/80">
            <AppIcon icon={ShieldUserIcon} size={14} />
          </span>
          <p className="text-xs leading-5 text-fg/80">
            Credentials are encrypted and stored locally.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-5 border-l-2 border-fg bg-fg/10 px-4 py-3 text-sm text-fg"
          >
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="group mt-7 flex h-14 w-full items-center justify-between bg-fg px-5 text-left text-bg transition hover:bg-fg/5 disabled:cursor-wait disabled:opacity-60"
        >
          <span>
            <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-fg/80">
              Next: Runtime
            </span>
            <span className="mt-0.5 block text-sm font-bold">
              Save owner &amp; continue
            </span>
          </span>
          <span className="grid h-8 w-8 place-items-center bg-bg/10 transition-transform group-hover:translate-x-1">
            <AppIcon icon={ArrowRight02Icon} size={16} />
          </span>
        </button>
      </form>
    </OnboardingStepShell>
  );
}
