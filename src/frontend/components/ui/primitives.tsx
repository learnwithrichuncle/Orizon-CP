import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon } from "@hugeicons/core-free-icons";
import { ReactNode, forwardRef } from "react";
import type { Framework } from "../../api";
import { frameworkIconClassName } from "./framework-icon-colors";

export function AppIcon({
  icon,
  className = "",
  size = 18
}: {
  icon: unknown;
  className?: string;
  size?: number;
}) {
  return <HugeiconsIcon icon={icon as never} size={size} strokeWidth={1.5} className={className} />;
}

export function surface(extra = "") {
  return `border border-fg/10 bg-fg/[0.03] ${extra}`.trim();
}

export const surfaceClass = surface;

export function btn(variant: "primary" | "secondary" | "ghost" | "danger" = "secondary") {
  const base =
    "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap px-4 font-mono text-[11px] font-semibold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed";

  if (variant === "primary") {
    return `${base} bg-accent text-bg hover:brightness-110 active:brightness-95`;
  }
  if (variant === "ghost") {
    return `${base} text-fg/60 hover:bg-fg/5 hover:text-fg`;
  }
  if (variant === "danger") {
    // Destructive actions: secondary style, no red hue
    return `${base} border border-fg/20 text-fg hover:border-fg hover:bg-fg/5`;
  }
  return `${base} border border-fg/20 text-fg hover:border-accent hover:text-accent`;
}

export const shellButton = btn;

export function chipClass(active: boolean) {
  return active
    ? "inline-flex items-center gap-2 border border-accent bg-accent/10 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-accent"
    : "inline-flex items-center gap-2 border border-fg/10 bg-fg/[0.03] px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-fg/60 transition hover:border-fg/30 hover:text-fg";
}

const statusStyleMap: Record<string, string> = {
  active: "border-accent/40 text-accent",
  running: "border-accent/40 text-accent",
  deployed: "border-accent/40 text-accent",
  success: "border-accent/40 text-accent",
  building: "border-accent/40 text-accent/70",
  queued: "border-accent/40 text-accent/70",
  current: "bg-accent text-bg border-accent",
  selected: "bg-accent text-bg border-accent",
  failed: "border-fg text-fg",
  crashed: "border-fg text-fg",
  degraded: "border-fg text-fg",
  aborted: "border-fg/10 text-fg/40",
  inactive: "border-fg/10 text-fg/40"
};

export function statusClass(status: string) {
  const key = status.toLowerCase();
  return statusStyleMap[key] || "border-fg/10 text-fg/40";
}

export function StatusPill({
  status,
  state
}: {
  status: string;
  state?: "active" | "building" | "current" | "failed" | "inactive";
}) {
  const resolvedState: "active" | "building" | "current" | "failed" | "inactive" =
    state ??
    (status === "current"
      ? "current"
      : status === "active" || status === "running" || status === "deployed" || status === "success"
        ? "active"
        : status === "building" || status === "queued"
          ? "building"
          : status === "failed" || status === "crashed" || status === "degraded"
            ? "failed"
            : "inactive");

  const pulse = resolvedState === "building" ? "animate-pulse" : "";
  const hollow = resolvedState === "inactive";
  const label = status === "deployed" ? "deployed" : status;

  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${statusStyleMap[resolvedState]}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 ${pulse} ${hollow ? "border border-current" : "bg-current"}`}
      />
      {resolvedState === "failed" ? "✕ " : ""}
      {label}
    </span>
  );
}

export function deploymentCardClass(status: string, selected: boolean) {
  if (selected) {
    return "border-accent bg-accent/10 text-fg";
  }
  return "border-fg/10 bg-fg/[0.03] text-fg/80 hover:border-fg/30 hover:bg-fg/5";
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-fg/40">
      {children}
    </span>
  );
}

export const FormInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    variant?: "default" | "monochrome";
  }
>(({ className = "", variant, ...props }, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={`h-12 w-full border border-fg/20 bg-fg/[0.02] px-4 text-sm text-fg outline-none transition hover:border-fg/40 focus:border-accent focus:bg-transparent focus:ring-1 focus:ring-accent disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-fg/30 ${className}`}
    />
  );
});

export function SectionTitle({
  icon,
  title,
  meta
}: {
  icon: unknown;
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center border border-accent text-accent">
        <AppIcon icon={icon} size={18} />
      </div>
      <div>
        <h2 className="text-lg font-bold tracking-tight text-fg">{title}</h2>
        {meta ? <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg/40">{meta}</p> : null}
      </div>
    </div>
  );
}

export function BrowserIconFallback({
  className = "",
  size = 16
}: {
  className?: string;
  size?: number;
}) {
  return <AppIcon icon={Globe02Icon} size={size} className={className} />;
}

export function FrameworkMark({
  framework,
  fallback,
  size = 16
}: {
  framework: Framework | null;
  fallback?: ReactNode;
  size?: number;
}) {
  if (framework?.logoUrl) {
    return (
      <img
        src={framework.logoUrl}
        alt={framework.name}
        className={`shrink-0 object-contain ${frameworkIconClassName(framework.slug)}`.trim()}
        loading="lazy"
        style={{ height: size, width: size }}
      />
    );
  }

  return <>{fallback ?? <BrowserIconFallback size={size} />}</>;
}

export function FrameworkBadge({
  framework,
  fallbackLabel = "Service"
}: {
  framework: Framework | null;
  fallbackLabel?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 border border-fg/10 bg-fg/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg/60">
      <div className="grid h-3.5 w-3.5 place-items-center overflow-hidden">
        <FrameworkMark framework={framework} size={14} fallback={<BrowserIconFallback size={14} />} />
      </div>
      {framework?.name ?? fallbackLabel}
    </div>
  );
}

export function InfoRow({
  icon,
  label
}: {
  icon: unknown | ((props: { className?: string; size?: number }) => ReactNode);
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 border border-fg/10 bg-fg/[0.03] px-3 py-3 text-sm text-fg">
      {typeof icon === "function" ? icon({ size: 16 }) : <AppIcon icon={icon} size={16} />}
      <span className="truncate">{label}</span>
    </div>
  );
}
