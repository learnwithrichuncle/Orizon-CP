import { Add01Icon, DatabaseImportIcon } from "@hugeicons/core-free-icons";
import { AppIcon, btn } from "../../components/ui/primitives";

export function ProjectsDashboardHeader({
  projectCount,
  serviceCount,
  onCreate,
  onImport,
}: {
  projectCount: number;
  serviceCount: number;
  onCreate: () => void;
  onImport: () => void;
}) {
  return (
    <header className="border-b border-fg/10 pb-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Projects
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-fg/40">
            {projectCount} project{projectCount === 1 ? "" : "s"}
            <span className="mx-2 text-fg/20">/</span>
            {serviceCount} service{serviceCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onImport}
            className={btn("secondary")}
          >
            <AppIcon icon={DatabaseImportIcon} size={14} />
            Import from…
          </button>
          <button
            type="button"
            onClick={onCreate}
            className={btn("primary")}
          >
            <AppIcon icon={Add01Icon} size={14} />
            New project
          </button>
        </div>
      </div>
    </header>
  );
}
