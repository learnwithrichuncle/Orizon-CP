import { Globe02Icon } from "@hugeicons/core-free-icons";
import type { ProjectCard } from "../../api";
import { AppIcon, FrameworkMark } from "../../components/ui/primitives";

export function ServiceCluster({ project }: { project: ProjectCard }) {
  const previewServices = project.services.slice(0, 7);
  const extraCount = Math.max(0, project.serviceCount - previewServices.length);

  return (
    <div className="border border-fg/10 bg-fg/[0.02] p-2">
      <div className="flex min-h-[96px] items-center justify-center p-3">
        <div className="flex max-w-[11.5rem] flex-wrap items-center justify-center gap-2">
          {previewServices.map((service) => (
            <div
              key={service.id}
              className="flex h-9 w-9 items-center justify-center border border-fg/15 bg-fg/[0.03] p-2"
            >
              <FrameworkMark framework={service.framework} size={16} fallback={<AppIcon icon={Globe02Icon} size={14} className="text-fg/40" />} />
            </div>
          ))}
          {previewServices.length === 0 ? (
            <div className="flex h-full min-h-[96px] items-center justify-center font-mono text-[10px] uppercase tracking-wider text-fg/40">No services yet</div>
          ) : null}
          {extraCount > 0 ? (
            <div className="flex h-9 w-9 items-center justify-center border border-fg/15 bg-fg/[0.03] font-mono text-xs tracking-wider text-fg/60">
              +{extraCount}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
