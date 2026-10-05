import { Delete02Icon, HardDriveIcon, Refresh03Icon } from "@hugeicons/core-free-icons";
import type { MaintenanceCleanupTarget, SystemMaintenanceInfo } from "../../api";
import { formatBytes } from "../../lib/format";
import { AppIcon } from "../ui/primitives";
import { pathMetric, safeCleanupTargets, topDockerReclaimableRow } from "./maintenance-utils";

export function MaintenanceCleanupCard({
  info,
  loading,
  cleanupMode,
  confirmVolumes,
  onConfirmVolumesChange,
  onRunCleanup
}: {
  info: SystemMaintenanceInfo | null;
  loading: boolean;
  cleanupMode: "" | "safe" | "volumes";
  confirmVolumes: boolean;
  onConfirmVolumesChange: (confirm: boolean) => void;
  onRunCleanup: (mode: "safe" | "volumes", targets: MaintenanceCleanupTarget[]) => void;
}) {
  const dataPath = pathMetric(info, "data");
  const backupsPath = pathMetric(info, "backups");
  const aptPath = pathMetric(info, "apt-cache");
  const logsPath = pathMetric(info, "system-logs");
  const topDockerRow = topDockerReclaimableRow(info);
  const rowClass = "flex justify-between gap-3 border-b border-fg/10 py-2.5 last:border-b-0";

  return (
    <div className="border border-fg/10 bg-bg">
      <div className="flex items-center gap-3 border-b border-fg/10 px-4 py-3.5">
        <AppIcon icon={HardDriveIcon} size={16} className="text-fg/60" />
        <div>
          <h3 className="text-sm text-fg/80">Cleanup</h3>
          <p className="mt-0.5 text-xs text-fg/40">Disk and Docker candidates</p>
        </div>
      </div>

      <div className="px-4 text-sm text-fg/80">
        <div className={rowClass}>
          <span>Top Docker candidate</span>
          <span className="shrink-0 font-mono text-xs text-fg/60">{topDockerRow ? `${formatBytes(topDockerRow.reclaimableBytes)} ${topDockerRow.type}` : "0 B"}</span>
        </div>
        <div className={rowClass}>
          <span>OrizonCP data</span>
          <span className="shrink-0 font-mono text-xs text-fg/60">{formatBytes(dataPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>Backups</span>
          <span className="shrink-0 font-mono text-xs text-fg/60">{formatBytes(backupsPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>APT cache</span>
          <span className="shrink-0 font-mono text-xs text-fg/60">{formatBytes(aptPath?.bytes ?? null)}</span>
        </div>
        <div className={rowClass}>
          <span>System logs</span>
          <span className="shrink-0 font-mono text-xs text-fg/60">{formatBytes(logsPath?.bytes ?? null)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-fg/10 p-4">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-2 bg-fg px-3.5 text-sm text-bg transition hover:bg-fg/5 disabled:opacity-50"
          onClick={() => onRunCleanup("safe", safeCleanupTargets)}
          disabled={Boolean(cleanupMode) || loading}
        >
          <AppIcon icon={Refresh03Icon} size={14} className={cleanupMode === "safe" ? "animate-spin" : ""} />
          Safe cleanup
        </button>

        {confirmVolumes ? (
          <div className="border-l-2 border-fg/20 bg-fg/5 p-3">
            <p className="text-xs leading-relaxed text-accent">Delete unused Docker volumes? This will not remove attached volumes, but it can delete persistent service or database data left behind by removed containers.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="inline-flex h-9 items-center justify-center gap-2 border border-fg/20/50 px-3 text-sm text-accent transition hover:bg-fg/5 disabled:opacity-50" onClick={() => onRunCleanup("volumes", ["docker-volumes"])} disabled={Boolean(cleanupMode)}>
                <AppIcon icon={Delete02Icon} size={14} className={cleanupMode === "volumes" ? "animate-spin" : ""} />
                Delete volumes
              </button>
              <button type="button" className="inline-flex h-9 items-center justify-center border border-fg/15 px-3 text-sm text-fg/80 transition hover:border-fg/35 hover:bg-fg/5 disabled:opacity-50" onClick={() => onConfirmVolumesChange(false)} disabled={Boolean(cleanupMode)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="inline-flex h-9 items-center justify-center gap-2 border border-fg/40 px-3.5 text-sm text-fg transition hover:bg-fg/5 disabled:opacity-50" onClick={() => onConfirmVolumesChange(true)} disabled={Boolean(cleanupMode) || loading}>
            <AppIcon icon={Delete02Icon} size={14} />
            Clean volumes
          </button>
        )}
      </div>
    </div>
  );
}
