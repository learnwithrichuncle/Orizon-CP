import { Add01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { useMemo, useState, type DragEvent } from "react";
import type { ProjectEnvironment, Service } from "../../api";
import { AppIcon } from "../../components/ui/primitives";

function environmentTabTone({
  selected,
  source,
  validTarget,
  activeTarget
}: {
  selected: boolean;
  source: boolean;
  validTarget: boolean;
  activeTarget: boolean;
}) {
  if (activeTarget) return "border-accent bg-accent text-bg";
  if (validTarget) return "border-dashed border-accent/60 bg-accent/10 text-accent";
  if (source) return "border-fg/10 bg-fg/[0.02] text-fg/30 opacity-40";
  if (selected) return "border-accent bg-accent text-bg";
  return "border-fg/15 bg-fg/[0.03] text-fg/60 hover:border-fg/30 hover:bg-fg/5 hover:text-fg";
}

export function ProjectEnvironmentTabs({
  environments,
  services,
  selectedEnvironmentId,
  draggingService,
  movingEnvironmentId,
  onSelect,
  onCreate,
  onDropService
}: {
  environments: ProjectEnvironment[];
  services: Service[];
  selectedEnvironmentId: string;
  draggingService: Service | null;
  movingEnvironmentId: string;
  onSelect: (environmentId: string) => void;
  onCreate: () => void;
  onDropService: (environmentId: string) => void;
}) {
  const [dropTargetKey, setDropTargetKey] = useState("");
  const serviceCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const service of services) {
      counts.set(service.environmentId, (counts.get(service.environmentId) ?? 0) + 1);
    }
    return counts;
  }, [services]);

  function dragOver(event: DragEvent<HTMLButtonElement>, environmentId: string) {
    if (!draggingService || draggingService.environmentId === environmentId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTargetKey(`${draggingService.id}:${environmentId}`);
  }

  return (
    <div className="mb-5">
      <div className={`overflow-hidden font-mono text-[9px] uppercase tracking-wider text-accent transition-all ${draggingService ? "mb-2 max-h-8 opacity-100" : "max-h-0 opacity-0"}`}>
        Drop {draggingService?.name ?? "the service"} onto another environment
      </div>
      <div className="flex items-center gap-2 overflow-x-auto border-b border-fg/10 pb-3">
        {environments.map((environment) => {
          const selected = environment.id === selectedEnvironmentId;
          const serviceCount = serviceCounts.get(environment.id) ?? 0;
          const source = Boolean(draggingService && draggingService.environmentId === environment.id);
          const validDropTarget = Boolean(draggingService && !source);
          const activeDropTarget = dropTargetKey === `${draggingService?.id}:${environment.id}`;
          const movingHere = movingEnvironmentId === environment.id;

          return (
            <button
              key={environment.id}
              type="button"
              className={`inline-flex h-9 shrink-0 items-center gap-2 border px-3 font-mono text-[11px] uppercase tracking-wider transition ${environmentTabTone({ selected, source, validTarget: validDropTarget, activeTarget: activeDropTarget })}`}
              onClick={() => onSelect(environment.id)}
              onDragEnter={(event) => dragOver(event, environment.id)}
              onDragOver={(event) => dragOver(event, environment.id)}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTargetKey("");
              }}
              onDrop={(event) => {
                if (!validDropTarget) return;
                event.preventDefault();
                setDropTargetKey("");
                onDropService(environment.id);
              }}
              aria-pressed={selected}
            >
              <AppIcon icon={Layers01Icon} size={14} />
              {movingHere ? "Moving…" : activeDropTarget ? `Move to ${environment.name}` : environment.name}
              {environment.isDefault ? (
                <span className={`text-[8px] uppercase tracking-wider ${selected ? "text-bg/70" : "text-fg/40"}`}>
                  default
                </span>
              ) : null}
              <span className={`text-[9px] ${selected ? "text-bg/70" : "text-fg/40"}`}>
                {serviceCount}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          className="inline-flex h-9 shrink-0 items-center gap-2 border border-dashed border-fg/20 px-3 font-mono text-[11px] uppercase tracking-wider text-fg/40 transition hover:border-fg/40 hover:bg-fg/5 hover:text-fg"
          onClick={onCreate}
        >
          <AppIcon icon={Add01Icon} size={14} />
          New environment
        </button>
      </div>
    </div>
  );
}
