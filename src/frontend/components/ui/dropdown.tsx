import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "./primitives";

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function Dropdown({
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select...",
  className = "",
  size = "default",
  placement = "bottom"
}: {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  variant?: "default" | "monochrome";
  size?: "default" | "compact";
  placement?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const compact = size === "compact";

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        className={`flex w-full items-center justify-between border bg-bg text-left text-fg outline-none transition hover:border-fg/40 focus:border-accent disabled:cursor-not-allowed disabled:opacity-40 ${
          compact
            ? "h-8 gap-2 border-fg/20 px-2.5 text-xs"
            : "h-11 gap-3 border-fg/20 px-3 text-sm"
        }`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`min-w-0 truncate ${selected ? "text-fg" : "text-fg/40"}`}>{selected?.label ?? placeholder}</span>
        <AppIcon icon={ArrowDown01Icon} size={compact ? 12 : 15} className={`shrink-0 text-fg/40 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div
          className={`absolute left-0 right-0 z-40 max-h-64 overflow-y-auto border border-fg/20 bg-bg ${
            placement === "top"
              ? compact
                ? "bottom-full mb-1 p-1"
                : "bottom-full mb-2 p-1"
              : compact
                ? "top-full mt-1 p-1"
                : "top-full mt-2 p-1"
          }`}
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="px-2.5 py-2 text-xs text-fg/40 font-mono">No options</div>
          ) : options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                className={`block w-full text-left transition disabled:cursor-not-allowed disabled:text-fg/30 ${
                  compact ? "px-2 py-1.5 text-xs" : "px-2.5 py-2 text-sm"
                } ${
                  active
                    ? "bg-accent text-bg font-medium"
                    : "text-fg hover:bg-fg/5"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                disabled={option.disabled}
                role="option"
                aria-selected={active}
              >
                <span className="block truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
