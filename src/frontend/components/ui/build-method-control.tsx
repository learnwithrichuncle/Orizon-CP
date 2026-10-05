import { ContainerIcon, MagicWand01Icon, PackageIcon } from "@hugeicons/core-free-icons";
import { AppIcon } from "./primitives";

export type BuildMethod = "auto" | "railpack" | "dockerfile";

const buildMethodOptions: Array<{ value: BuildMethod; label: string; icon: unknown }> = [
  { value: "auto", label: "Auto", icon: MagicWand01Icon },
  { value: "railpack", label: "Railpack", icon: PackageIcon },
  { value: "dockerfile", label: "Dockerfile", icon: ContainerIcon }
];

export function BuildMethodControl({
  value,
  onChange,
  disabled = false
}: {
  value: BuildMethod;
  onChange: (method: BuildMethod) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-grid w-full max-w-sm grid-cols-3 gap-2">
      {buildMethodOptions.map((method) => (
        <button
          key={method.value}
          type="button"
          className={`inline-flex h-9 min-w-0 items-center justify-center gap-2 px-3 font-mono text-[11px] uppercase tracking-wider transition disabled:opacity-40 ${
            value === method.value
              ? "bg-accent text-bg font-semibold"
              : "border border-fg/20 text-fg/60 hover:border-fg/40 hover:bg-fg/5 hover:text-fg"
          }`}
          disabled={disabled}
          onClick={() => onChange(method.value)}
        >
          <AppIcon icon={method.icon} size={14} className="shrink-0" />
          <span className="truncate">{method.label}</span>
        </button>
      ))}
    </div>
  );
}
