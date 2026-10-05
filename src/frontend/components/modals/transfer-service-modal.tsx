import { FolderOpenIcon } from "@hugeicons/core-free-icons";
import { useEffect, useMemo, useState } from "react";
import { api, type ProjectCard } from "../../api";
import { Dropdown } from "../ui/dropdown";
import { FieldLabel, btn } from "../ui/primitives";
import { ModalShell } from "./modal-shell";

type TransferServiceModalProps = {
  open: boolean;
  currentProjectId: string;
  serviceName: string;
  busy: boolean;
  onClose: () => void;
  onTransfer: (targetProjectId: string) => Promise<void>;
};

export function TransferServiceModal({
  open,
  currentProjectId,
  serviceName,
  busy,
  onClose,
  onTransfer
}: TransferServiceModalProps) {
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [targetProjectId, setTargetProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setProjects([]);
      setTargetProjectId("");
      setError("");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    void api.projects()
      .then((result) => {
        if (cancelled) return;
        const nextProjects = result.projects.filter((project) => project.id !== currentProjectId);
        setProjects(nextProjects);
        setTargetProjectId((current) => nextProjects.some((project) => project.id === current) ? current : "");
      })
      .catch((issue) => {
        if (cancelled) return;
        setError(issue instanceof Error ? issue.message : "Could not load projects");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentProjectId, open]);

  const projectOptions = useMemo(
    () => projects.map((project) => ({ value: project.id, label: project.name })),
    [projects]
  );
  const selectedProject = projects.find((project) => project.id === targetProjectId) ?? null;

  async function submitTransfer() {
    if (!targetProjectId) return;

    setError("");
    try {
      await onTransfer(targetProjectId);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not transfer service");
    }
  }

  return (
    <ModalShell
      open={open}
      title="Move service"
      meta={serviceName}
      icon={FolderOpenIcon}
      onClose={onClose}
      width="max-w-md"
      minHeight="min-h-0"
      bodyClassName="min-h-0 flex-1"
    >
      <div className="space-y-4">
        <div>
          <FieldLabel>Destination project</FieldLabel>
          <Dropdown
            value={targetProjectId}
            options={projectOptions}
            onChange={setTargetProjectId}
            disabled={loading || busy || projectOptions.length === 0}
            placeholder={loading ? "Loading projects..." : "Select project"}
            size="compact"
            className="[&>button]:!h-9"
          />
          <div className="mt-2 text-xs leading-5 text-fg/60">
            {selectedProject
              ? `${serviceName} will move to ${selectedProject.name}.`
              : projectOptions.length > 0
                ? "Choose a project to move this service."
                : "Create another project before moving this service."}
          </div>
        </div>

        <div className="border border-fg/10 bg-fg/[0.03] p-3 text-xs leading-5 text-fg/60">
          The service lands in the destination project's production environment. Deployments, variables, domains, backups, and runtime state stay with it.
        </div>

        {error ? (
          <div className="border-l-2 border-fg bg-fg/5 px-3 py-2 text-xs font-mono text-fg">
            ✕ {error}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3 border-t border-fg/10 pt-4">
          <button
            type="button"
            className={btn("ghost")}
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className={btn("primary")}
            onClick={() => void submitTransfer()}
            disabled={busy || loading || !targetProjectId}
          >
            {busy ? "Moving…" : "Move service"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
