import { Refresh03Icon } from "@hugeicons/core-free-icons";
import { SettingsDialog } from "../../features/settings/settings-dialog";
import { AppIcon, btn } from "../ui/primitives";

type UpdateConfirmationModalProps = {
  applying: boolean;
  installType: "git" | "image";
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function UpdateConfirmationModal({
  applying,
  installType,
  open,
  onCancel,
  onConfirm
}: UpdateConfirmationModalProps) {
  const actionLabel = installType === "image" ? "Pull Latest Image" : "Update OrizonCP";

  return (
    <SettingsDialog
      open={open}
      title={actionLabel}
      onClose={() => {
        if (!applying) onCancel();
      }}
      width="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-fg/60">
          OrizonCP may restart after the update. The dashboard can briefly disconnect.
        </p>

        <div className="flex items-center justify-end gap-3 border-t border-fg/10 pt-4">
          <button
            type="button"
            className={btn("ghost")}
            onClick={onCancel}
            disabled={applying}
          >
            Cancel
          </button>
          <button
            type="button"
            className={btn("primary")}
            onClick={onConfirm}
            disabled={applying}
          >
            <AppIcon icon={Refresh03Icon} size={14} className={applying ? "animate-spin" : ""} />
            {applying ? "Starting..." : actionLabel}
          </button>
        </div>
      </div>
    </SettingsDialog>
  );
}
