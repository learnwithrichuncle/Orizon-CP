export function SquareSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  className = ""
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`h-5 w-9 shrink-0 border p-0.5 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "border-accent bg-accent" : "border-fg/20 bg-bg"
      } ${className}`}
      onClick={() => onCheckedChange(!checked)}
    >
      <span
        aria-hidden="true"
        className={`block h-3.5 w-3.5 transition ${
          checked ? "translate-x-4 bg-bg" : "translate-x-0 bg-fg/40"
        }`}
      />
    </button>
  );
}
