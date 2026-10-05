import type { OnboardingForm } from "./onboarding-types";

function OwnerField({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-fg/80">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-12 w-full bg-fg/5 px-3.5 text-[15px] text-fg outline-none transition placeholder:text-fg/80 focus:bg-fg/5"
      />
    </label>
  );
}

export function OwnerStep({
  form,
  update,
}: {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
}) {
  return (
    <div className="grid gap-y-5">
      <OwnerField
        label="Your name"
        value={form.ownerName}
        onChange={(ownerName) => update({ ownerName })}
        autoComplete="name"
        placeholder="Jane Doe"
      />
      <OwnerField
        label="Email"
        value={form.ownerEmail}
        onChange={(ownerEmail) => update({ ownerEmail })}
        type="email"
        autoComplete="email"
        placeholder="jane@company.com"
      />
      <OwnerField
        label="Password"
        value={form.ownerPassword}
        onChange={(ownerPassword) => update({ ownerPassword })}
        type="password"
        autoComplete="new-password"
        placeholder="Minimum 8 characters"
      />
      <OwnerField
        label="Confirm password"
        value={form.ownerPasswordConfirm}
        onChange={(ownerPasswordConfirm) =>
          update({ ownerPasswordConfirm })
        }
        type="password"
        autoComplete="new-password"
        placeholder="Repeat your password"
      />
    </div>
  );
}
