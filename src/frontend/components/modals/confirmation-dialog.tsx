import { Cancel01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { useId } from "react";
import { AppIcon, btn } from "../ui/primitives";

type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  subject?: string;
  eyebrow?: string;
  busy?: boolean;
  icon?: unknown;
  confirmIcon?: unknown;
  tone?: "danger" | "warning";
  zIndexClassName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  subject,
  eyebrow = "Confirm action",
  busy = false,
  icon = Delete02Icon,
  confirmIcon = Delete02Icon,
  zIndexClassName = "z-[70]",
  onClose,
  onConfirm
}: ConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  if (!open) return null;

  return (
    <div className={`fixed inset-0 ${zIndexClassName} overflow-y-auto bg-bg/80 p-4`}>
      <div className="mx-auto flex min-h-full items-center justify-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="w-full max-w-md border border-fg/20 bg-bg"
        >
          <header className="flex items-center justify-between gap-4 border-b border-fg/10 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-8 w-8 place-items-center border border-fg/20 text-fg">
                <AppIcon icon={icon} size={15} />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">{eyebrow}</div>
                <h2 id={titleId} className="truncate text-base font-bold tracking-tight text-fg">
                  {title}
                </h2>
              </div>
            </div>
            <button
              type="button"
              className="text-fg/40 transition hover:text-fg disabled:opacity-40"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              title="Close"
            >
              <AppIcon icon={Cancel01Icon} size={16} />
            </button>
          </header>

          <div className="p-5">
            {subject ? (
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-fg/50">{subject}</p>
            ) : null}
            <p id={descriptionId} className="mt-3 border-l-2 border-fg bg-fg/5 px-4 py-3 text-sm leading-relaxed text-fg">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-fg/10 pt-4">
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
                onClick={() => void onConfirm()}
                disabled={busy}
              >
                <AppIcon icon={confirmIcon} size={14} />
                {confirmLabel}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
