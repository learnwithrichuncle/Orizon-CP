import { Link } from "@tanstack/react-router";
import { AddSquareIcon } from "@hugeicons/core-free-icons";
import type { ToolCheck } from "../../api";
import { BrandMark } from "../ui/brand-mark";
import { AppIcon, btn } from "../ui/primitives";

export function RootHeader({
  tools,
  onCreateProject
}: {
  tools: ToolCheck[];
  onCreateProject?: () => void;
}) {
  return (
    <header className="border-b border-fg/10 bg-bg">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center border border-accent text-accent">
            <BrandMark className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-fg">OrizonCP</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-fg/40">Control Plane</div>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 md:flex">
            {tools.slice(0, 4).map((tool) => (
              <div
                key={tool.name}
                className="inline-flex items-center gap-2 border border-fg/10 bg-fg/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-fg/60"
              >
                <span className={`h-1.5 w-1.5 ${tool.ok ? "bg-accent" : "border border-fg/40"}`} />
                {tool.name}
              </div>
            ))}
          </div>
          {onCreateProject ? (
            <button type="button" className={btn("primary")} onClick={onCreateProject}>
              <AppIcon icon={AddSquareIcon} size={15} />
              New project
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
