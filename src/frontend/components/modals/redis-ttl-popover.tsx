import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../ui/primitives";

const ttlUnitOptions = [
  { value: "seconds", label: "Seconds" },
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" }
];

const unitMultipliers: Record<string, number> = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400
};

const ttlButtonClass =
  "inline-flex h-7 items-center justify-center border px-2 text-[10px] transition disabled:cursor-not-allowed disabled:opacity-50";

function displayTtl(ttl: number) {
  if (ttl === -1) return "No expiry";
  if (ttl === -2) return "Expired";
  if (Number.isFinite(ttl) && ttl >= 0) return `${ttl}s`;
  return "Unknown";
}

export function RedisTtlPopover({
  ttl,
  busy,
  onSave
}: {
  ttl: unknown;
  busy: boolean;
  onSave: (seconds: number) => Promise<void> | void;
}) {
  const numericTtl = Number(ttl);
  const [open, setOpen] = useState(false);
  const [unitOpen, setUnitOpen] = useState(false);
  const [value, setValue] = useState(Number.isFinite(numericTtl) ? String(numericTtl) : "-1");
  const [unit, setUnit] = useState("seconds");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const label = useMemo(() => displayTtl(numericTtl), [numericTtl]);
  const selectedUnit = ttlUnitOptions.find((option) => option.value === unit) ?? { value: "seconds", label: "Seconds" };

  useEffect(() => {
    if (!open) return;
    setValue(Number.isFinite(numericTtl) ? String(numericTtl) : "-1");
    setUnit("seconds");
    setUnitOpen(false);
  }, [numericTtl, open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setUnitOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function saveTtl(seconds: number) {
    await onSave(seconds);
    setOpen(false);
    setUnitOpen(false);
  }

  function saveFromFields() {
    const amount = Number(value);
    const multiplier = unitMultipliers[unit] ?? 1;
    const seconds = amount < 0 ? -1 : Math.floor(amount * multiplier);
    void saveTtl(seconds);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex h-7 items-center border border-fg/10 bg-fg/[0.03] px-2.5 font-mono text-[10px] leading-none tracking-[0.04em] text-fg/60 transition hover:border-fg/30 hover:text-fg"
        onClick={() => {
          setOpen((current) => !current);
          setUnitOpen(false);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        TTL: {label}
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 border border-fg/15 bg-bg p-3 " role="dialog" aria-label="Expiration">
          <div className="text-xs text-fg/80">Expiration</div>
          <div className="mt-2 grid w-full grid-cols-[76px_minmax(0,1fr)]">
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="h-8 min-w-0 border border-fg/15 bg-bg px-2 font-mono text-xs text-fg/80 outline-none transition focus:border-fg"
              inputMode="numeric"
            />
            <div className="relative">
              <button
                type="button"
                className="flex h-8 w-full items-center justify-between gap-1 border border-l-0 border-fg/15 bg-bg px-2 text-left text-xs text-fg/80 outline-none transition hover:border-fg/35"
                onClick={() => setUnitOpen((current) => !current)}
                aria-haspopup="listbox"
                aria-expanded={unitOpen}
              >
                <span className="truncate">{selectedUnit.label}</span>
                <AppIcon icon={ArrowDown01Icon} size={13} className={`shrink-0 text-fg/60 transition ${unitOpen ? "rotate-180" : ""}`} />
              </button>
              {unitOpen ? (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 border border-fg/15 bg-bg p-1 " role="listbox">
                  {ttlUnitOptions.map((option) => {
                    const active = option.value === unit;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`block w-full px-2 py-1.5 text-left text-xs transition ${
                          active ? "bg-fg text-bg" : "text-fg/60 hover:bg-fg/[0.07] hover:text-fg"
                        }`}
                        onClick={() => {
                          setUnit(option.value);
                          setUnitOpen(false);
                        }}
                        role="option"
                        aria-selected={active}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-fg/60">TTL deletes keys after a defined period.</p>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <button type="button" className={`${ttlButtonClass} border-fg/15 text-fg/60 hover:border-fg/35 hover:bg-fg/5 hover:text-fg`} onClick={() => void saveTtl(-1)} disabled={busy}>
              Persist
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${ttlButtonClass} border-transparent text-fg/60 hover:bg-fg/5 hover:text-fg`}
                onClick={() => {
                  setOpen(false);
                  setUnitOpen(false);
                }}
                disabled={busy}
              >
                Cancel
              </button>
              <button type="button" className={`${ttlButtonClass} border-fg bg-fg text-bg hover:bg-fg/5`} onClick={saveFromFields} disabled={busy}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
