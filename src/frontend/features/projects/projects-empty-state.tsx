import { Add01Icon } from "@hugeicons/core-free-icons";
import { AppIcon, btn } from "../../components/ui/primitives";

export function ProjectsEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="flex min-h-[320px] flex-col items-center justify-center border border-fg/10 bg-fg/[0.03] p-10 text-center">
      <h2 className="text-xl font-bold tracking-tight text-fg">
        No projects yet
      </h2>
      <p className="mt-2 font-mono text-[11px] text-fg/40">
        Create your first project to start deploying services and databases.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className={`mt-6 ${btn("primary")}`}
      >
        <AppIcon icon={Add01Icon} size={15} />
        New Project
      </button>
    </section>
  );
}
