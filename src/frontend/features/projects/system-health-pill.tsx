import type { ToolCheck } from "../../api";

export function SystemHealthPill({ tools }: { tools: ToolCheck[] }) {
  const okCount = tools.filter((tool) => tool.ok).length;
  const totalCount = tools.length;
  const allOk = totalCount > 0 && okCount === totalCount;
  const label = totalCount === 0 ? "Checking" : allOk ? "System ready" : `${okCount}/${totalCount} ready`;
  const detail = tools.length > 0 ? tools.map((tool) => `${tool.name}: ${tool.ok ? "ok" : tool.detail}`).join("\n") : "Checking host tools";

  return (
    <div
      className="flex h-9 w-full items-center gap-2 border border-fg/10 bg-fg/[0.03] px-3 font-mono text-[9px] uppercase tracking-wider text-fg/60"
      title={detail}
    >
      <span
        className={`h-1.5 w-1.5 ${
          allOk ? "bg-accent" : "border border-fg/40"
        }`}
      />
      <span>{label}</span>
    </div>
  );
}
