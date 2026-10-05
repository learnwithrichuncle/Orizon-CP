import { Delete02Icon } from "@hugeicons/core-free-icons";
import { SettingsDialog } from "../../features/settings/settings-dialog";
import { AppIcon, btn } from "../ui/primitives";

export function DeleteProjectModal({
  open,
  projectName,
  busy,
  onClose,
  onConfirm
}: {
  open: boolean;
  projectName: string;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <SettingsDialog
      open={open}
      title="Delete Project"
      width="max-w-md"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <div className="space-y-4">
        <p className="truncate font-mono text-[10px] uppercase tracking-wider text-fg/40">{projectName}</p>
        <p className="border-l-2 border-fg bg-fg/5 px-4 py-3 text-sm leading-relaxed text-fg">
          This will permanently remove this project and every service inside it.
        </p>

        <div className="flex justify-end gap-3 border-t border-fg/10 pt-4">
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
            className={btn("secondary")}
            onClick={onConfirm}
            disabled={busy}
          >
            <AppIcon icon={Delete02Icon} size={14} />
            {busy ? "Deleting…" : "Delete Project"}
          </button>
        </div>
      </div>
    </SettingsDialog>
  );
}
