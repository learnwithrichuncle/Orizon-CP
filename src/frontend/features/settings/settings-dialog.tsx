import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { AppIcon } from "../../components/ui/primitives";

export function SettingsDialog({
  open,
  title,
  onClose,
  children,
  width = "max-w-2xl"
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg/80 p-4">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <section className={`flex max-h-[calc(100vh-2rem)] w-full ${width} flex-col border border-fg/20 bg-bg`}>
          <header className="flex items-center justify-between gap-4 border-b border-fg/10 px-6 py-4">
            <h2 className="text-base font-bold tracking-tight text-fg">{title}</h2>
            <button
              type="button"
              className="text-fg/40 transition hover:text-fg"
              onClick={onClose}
              title="Close"
              aria-label="Close"
            >
              <AppIcon icon={Cancel01Icon} size={18} />
            </button>
          </header>
          <div className="min-h-0 overflow-y-auto p-6">{children}</div>
        </section>
      </div>
    </div>
  );
}
