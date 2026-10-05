import { useEffect, useMemo, useState } from "react";
import type { ProjectEnvironment } from "../../api";
import { Dropdown } from "../../components/ui/dropdown";
import { FieldLabel, btn } from "../../components/ui/primitives";
import { SettingsDialog } from "../settings/settings-dialog";

export function MoveServiceEnvironmentModal({
  open,
  serviceName,
  currentEnvironmentId,
  environments,
  onClose,
  onMove
}: {
  open: boolean;
  serviceName: string;
  currentEnvironmentId: string;
  environments: ProjectEnvironment[];
  onClose: () => void;
  onMove: (environmentId: string) => Promise<void>;
}) {
  const [environmentId, setEnvironmentId] = useState("");
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState("");

  const destinations = useMemo(
    () => environments.filter((environment) => environment.id !== currentEnvironmentId),
    [currentEnvironmentId, environments]
  );

  useEffect(() => {
    if (!open) {
      setEnvironmentId("");
      setMoving(false);
      setError("");
      return;
    }
    setEnvironmentId(destinations[0]?.id ?? "");
  }, [destinations, open]);

  async function move() {
    if (!environmentId) return;
    setMoving(true);
    setError("");
    try {
      await onMove(environmentId);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not move service");
    } finally {
      setMoving(false);
    }
  }

  return (
    <SettingsDialog
      open={open}
      title="Move to environment"
      width="max-w-md"
      onClose={() => {
        if (!moving) onClose();
      }}
    >
      <div className="space-y-4">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-fg/40">{serviceName}</span>
          <p className="mt-1 text-sm text-fg/60">
            Choose the environment that should contain this service.
          </p>
        </div>

        <div>
          <FieldLabel>Destination</FieldLabel>
          <Dropdown
            value={environmentId}
            options={destinations.map((environment) => ({ value: environment.id, label: environment.name }))}
            onChange={setEnvironmentId}
            disabled={moving || destinations.length === 0}
            placeholder="Select environment"
          />
        </div>

        {error ? (
          <div role="alert" className="border-l-2 border-fg bg-fg/5 px-3 py-2 text-xs font-mono text-fg">
            ✕ {error}
          </div>
        ) : null}

        <div className="flex justify-end gap-3 border-t border-fg/10 pt-4">
          <button
            type="button"
            className={btn("ghost")}
            onClick={onClose}
            disabled={moving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={btn("primary")}
            onClick={() => void move()}
            disabled={moving || !environmentId}
          >
            {moving ? "Moving…" : "Move service"}
          </button>
        </div>
      </div>
    </SettingsDialog>
  );
}
