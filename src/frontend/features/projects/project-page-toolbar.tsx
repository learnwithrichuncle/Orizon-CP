import { ArrowDown01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import type { ProjectCard } from "../../api";
import { AppIcon } from "../../components/ui/primitives";

export function ProjectPageToolbar({
  projects,
  currentProject,
  fallbackProjectName,
  onBack,
  onProjectSelect
}: {
  projects: ProjectCard[];
  currentProject: ProjectCard | null;
  fallbackProjectName: string;
  onBack: () => void;
  onProjectSelect: (projectSlug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const otherProjects = projects.filter((project) => project.id !== currentProject?.id);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center border border-fg/20 bg-bg text-fg/60 transition hover:border-fg/40 hover:bg-fg/5 hover:text-fg"
        onClick={onBack}
        aria-label="Back to all projects"
      >
        <AppIcon icon={ArrowLeft01Icon} size={15} />
      </button>

      <div ref={menuRef} className="relative min-w-0">
        <button
          type="button"
          className="inline-flex h-9 max-w-[340px] items-center justify-center gap-2 border border-fg/20 bg-bg px-3 text-sm text-fg transition hover:border-fg/40 hover:bg-fg/5"
          onClick={() => setOpen((current) => !current)}
        >
          <span className="min-w-0 truncate font-bold text-fg">{currentProject?.name ?? fallbackProjectName}</span>
          <AppIcon icon={ArrowDown01Icon} size={14} className={`text-fg/40 transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open ? (
          <div className="absolute left-0 top-full z-30 mt-1 w-[320px] max-w-[calc(100vw-2rem)] border border-fg/20 bg-bg">
            <div className="border-b border-fg/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">Switch project</div>
            <div className="max-h-80 overflow-y-auto p-1">
              {otherProjects.length === 0 ? (
                <div className="px-3 py-4 text-xs font-mono text-fg/40">No other projects yet.</div>
              ) : (
                otherProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    className="flex w-full min-w-0 items-center gap-3 px-3 py-2.5 text-left text-sm text-fg transition hover:bg-fg/5"
                    onClick={() => {
                      setOpen(false);
                      onProjectSelect(project.slug);
                    }}
                  >
                    <span className="min-w-0 flex-1 truncate">{project.name}</span>
                    <span className="font-mono text-[9px] text-fg/40">
                      {project.serviceCount}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
