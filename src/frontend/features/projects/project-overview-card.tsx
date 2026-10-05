import { ArrowRight02Icon, StarIcon } from "@hugeicons/core-free-icons";
import type { ProjectCard } from "../../api";
import { AppIcon } from "../../components/ui/primitives";
import { formatRelativeTime } from "../../lib/format";
import { ServiceCluster } from "./service-cluster";

export function ProjectOverviewCard({
  project,
  index,
  pinned,
  onOpen,
  onTogglePin,
}: {
  project: ProjectCard;
  index: number;
  pinned: boolean;
  onOpen: () => void;
  onTogglePin: () => void;
}) {
  return (
    <article className="group relative flex border border-fg/10 bg-fg/[0.03] text-left transition hover:border-fg/30 hover:bg-fg/5">
      <button
        type="button"
        onClick={onOpen}
        className="relative z-10 flex min-w-0 flex-1 flex-col p-5 text-left outline-none focus-visible:ring-1 focus-visible:ring-accent"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-fg/40">
              Project {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-1 truncate text-lg font-bold tracking-tight text-fg">
              {project.name}
            </h2>
            {project.description ? (
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-fg/60">
                {project.description}
              </p>
            ) : null}
          </div>
          <span className="grid h-9 w-9 flex-none place-items-center border border-fg/15 text-fg/40 transition group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
            <AppIcon icon={ArrowRight02Icon} size={15} />
          </span>
        </div>

        <div className="mb-3 mt-4">
          <ServiceCluster project={project} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-fg/10 pr-8 pt-3">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-fg/60">
            {project.serviceCount} service
            {project.serviceCount === 1 ? "" : "s"}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-fg/40">
            Updated {formatRelativeTime(project.lastUpdatedAt)}
          </span>
        </div>
      </button>

      <button
        type="button"
        onClick={onTogglePin}
        aria-label={pinned ? `Remove ${project.name} from favorites` : `Add ${project.name} to favorites`}
        title={pinned ? "Remove from favorites" : "Add to favorites"}
        className={
          pinned
            ? "absolute bottom-3 right-3 z-20 grid h-7 w-7 place-items-center text-accent transition hover:text-accent/80"
            : "absolute bottom-3 right-3 z-20 grid h-7 w-7 place-items-center text-fg/30 transition hover:text-fg"
        }
      >
        <AppIcon icon={StarIcon} size={16} className={pinned ? "fill-current" : ""} />
      </button>
    </article>
  );
}
