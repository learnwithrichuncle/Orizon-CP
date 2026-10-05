import type { ReactNode } from "react";

export function Checkbox({
  checked,
  label,
  onChange,
  disabled = false,
  children,
  className = "",
  boxClassName = ""
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  boxClassName?: string;
  variant?: "default" | "monochrome";
}) {
  return (
    <label className={`group inline-flex select-none items-center gap-2 ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        aria-label={label}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`grid h-4 w-4 place-items-center border transition peer-focus-visible:ring-1 peer-focus-visible:ring-accent ${
          checked
            ? "border-accent bg-accent text-bg"
            : "border-fg/20 bg-transparent text-transparent group-hover:border-fg/40 group-hover:bg-fg/5"
        } ${boxClassName}`}
      >
        <span className={`h-1.5 w-2.5 -rotate-45 border-b-2 border-l-2 border-current transition ${checked ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
      </span>
      {children}
    </label>
  );
}
