import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import { AppIcon } from "../ui/primitives";

export function RedisKeyActionsMenu({
  disabled = false,
  onCopyContent,
  onCopyKey,
  onDelete
}: {
  disabled?: boolean;
  onCopyContent: () => Promise<void> | void;
  onCopyKey: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function runAction(action: () => Promise<void> | void) {
    setOpen(false);
    await action();
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center border border-fg/15 text-fg/60 transition hover:border-fg/35 hover:bg-fg/5 hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-label="Redis key actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <AppIcon icon={MoreVerticalIcon} size={17} />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-44 border border-fg/15 bg-bg p-1 " role="menu">
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-fg/80 transition hover:bg-fg/[0.07] hover:text-fg"
            onClick={() => void runAction(onCopyContent)}
            role="menuitem"
          >
            Copy content
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-fg/80 transition hover:bg-fg/[0.07] hover:text-fg"
            onClick={() => void runAction(onCopyKey)}
            role="menuitem"
          >
            Copy key
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-fg transition hover:bg-fg/5"
            onClick={() => void runAction(onDelete)}
            role="menuitem"
          >
            Delete key
          </button>
        </div>
      ) : null}
    </div>
  );
}
