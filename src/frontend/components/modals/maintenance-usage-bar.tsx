export function MaintenanceUsageBar({
  label,
  value,
  detail,
  percent,
  percentLabel,
  tone = "ok"
}: {
  label: string;
  value: string;
  detail?: string;
  percent: number;
  percentLabel?: string;
  tone?: "ok" | "warn" | "critical" | "muted";
}) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const color =
    tone === "critical"
      ? "bg-accent"
      : tone === "warn"
        ? "bg-accent/50"
        : tone === "muted"
          ? "bg-fg/5"
          : "bg-fg";

  return (
    <div className="border border-fg/10 bg-bg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">{label}</div>
          <div className="mt-2 text-lg text-fg/80">{value}</div>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg/60">{percentLabel ?? `${Math.round(clampedPercent)}%`}</div>
      </div>
      <div className="mt-4 h-1 bg-fg/10">
        <div className={`h-full ${color}`} style={{ width: `${clampedPercent}%` }} />
      </div>
      {detail ? <p className="mt-3 text-xs leading-relaxed text-fg/40">{detail}</p> : null}
    </div>
  );
}
