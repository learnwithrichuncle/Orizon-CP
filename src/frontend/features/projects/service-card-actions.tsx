import {
  ArrowRight02Icon,
  ArrowUpRight02Icon,
  FolderTransferIcon,
  MoreVerticalIcon
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import type { ProjectEnvironment } from "../../api";
import { AppIcon } from "../../components/ui/primitives";

export function ServiceCardActions({
  serviceName,
  environment,
  canVisit,
  canMoveEnvironment,
  onOpen,
  onVisit,
  onMoveEnvironment
}: {
  serviceName: string;
  environment: ProjectEnvironment;
  canVisit: boolean;
  canMoveEnvironment: boolean;
  onOpen: () => void;
  onVisit: () => void;
  onMoveEnvironment: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  function runAction(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <div
      ref={rootRef}
      className="relative shrink-0"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Escape") setOpen(false);
      }}
      onDragStart={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <button
        type="button"
        className="grid h-8 w-8 place-items-center border border-fg/20 bg-bg text-fg/60 transition hover:border-fg/40 hover:bg-fg/5 hover:text-fg"
        onClick={() => setOpen((current) => !current)}
        aria-label={`${serviceName} options`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <AppIcon icon={MoreVerticalIcon} size={15} />
      </button>

      {open ? (
        <div
          className="absolute bottom-full right-0 z-50 mb-2 w-48 border border-fg/20 bg-bg p-1"
          role="menu"
        >
          <div className="border-b border-fg/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-fg/40">
            {environment.name}
          </div>
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-fg transition hover:bg-fg/5"
            onClick={() => runAction(onOpen)}
            role="menuitem"
          >
            <AppIcon icon={ArrowRight02Icon} size={14} className="text-fg/40" />
            Open service
          </button>
          {canVisit ? (
            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-fg transition hover:bg-fg/5"
              onClick={() => runAction(onVisit)}
              role="menuitem"
            >
              <AppIcon icon={ArrowUpRight02Icon} size={14} className="text-fg/40" />
              Visit service
            </button>
          ) : null}
          <button
            type="button"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-fg transition hover:bg-fg/5 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => runAction(onMoveEnvironment)}
            disabled={!canMoveEnvironment}
            role="menuitem"
          >
            <AppIcon icon={FolderTransferIcon} size={14} className="text-fg/40" />
            Move environment
          </button>
        </div>
      ) : null}
    </div>
  );
}
