import type { ReactNode } from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { AppIcon, SectionTitle } from "../ui/primitives";

export function ModalShell({
  open,
  title,
  meta,
  icon,
  onClose,
  children,
  width = "max-w-3xl",
  minHeight = "min-h-[420px]",
  bodyClassName = "min-h-0 flex-1 overflow-y-auto pr-1"
}: {
  open: boolean;
  title: string;
  meta?: string;
  icon: unknown;
  onClose: () => void;
  children: ReactNode;
  width?: string;
  minHeight?: string;
  bodyClassName?: string;
  variant?: "default" | "monochrome";
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg/80 p-4">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <div className={`flex max-h-[min(720px,calc(100vh-2rem))] ${minHeight} w-full ${width} flex-col border border-fg/20 bg-bg`}>
          <div className="flex items-center justify-between gap-4 border-b border-fg/10 px-6 py-4">
            <SectionTitle icon={icon} title={title} meta={meta} />
            <button
              type="button"
              className="text-fg/40 transition hover:text-fg"
              onClick={onClose}
              aria-label="Close"
              title="Close"
            >
              <AppIcon icon={Cancel01Icon} size={18} />
            </button>
          </div>
          <div className={`p-6 ${bodyClassName}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
