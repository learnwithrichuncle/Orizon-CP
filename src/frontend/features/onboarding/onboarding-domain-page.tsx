import { Globe02Icon } from "@hugeicons/core-free-icons";
import type { FormEvent } from "react";
import { DomainConfiguration } from "./domain-configuration";
import { OnboardingStepForm } from "./onboarding-step-form";
import { OnboardingStepShell } from "./onboarding-step-shell";
import type { OnboardingForm } from "./onboarding-types";

export function OnboardingDomainPage({
  form,
  update,
  error,
  submitting,
  onSubmit,
  onBack,
  onImport,
  onStepChange,
}: {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
  error: string;
  submitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onImport: () => void;
  onStepChange: (step: number) => void;
}) {
  return (
    <OnboardingStepShell
      activeStep={3}
      onImport={onImport}
      onStepChange={onStepChange}
    >
      <OnboardingStepForm
        icon={Globe02Icon}
        eyebrow="Step 04 · Networking"
        title="Provision Edge Routing"
        badge="Optional"
        description="Configure DNS zones and root domain routing for cluster ingress."
        error={error}
        submitting={submitting}
        nextLabel="Next: Backups"
        actionLabel="Continue to backups"
        onSubmit={onSubmit}
        onBack={onBack}
      >
        <DomainConfiguration form={form} update={update} />
      </OnboardingStepForm>
    </OnboardingStepShell>
  );
}
