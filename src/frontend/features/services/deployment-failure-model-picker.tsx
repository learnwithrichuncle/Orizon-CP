import { ArrowDown01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import type { AiProviderStatus } from "../../api";
import type { AiProviderId } from "../../../core/ai-providers";
import { aiProviders } from "../../components/modals/ai-settings-data";
import { AppIcon } from "../../components/ui/primitives";

function providerLogo(providerId: AiProviderId) {
  return aiProviders.find((provider) => provider.id === providerId);
}

function selectedModelName(provider: AiProviderStatus | null, selectedModel: string) {
  return provider?.models.find((model) => model.id === selectedModel)?.name ?? (selectedModel || "Select model");
}

export function DeploymentFailureModelPicker({
  providers,
  selectedProviderId,
  selectedModel,
  disabled = false,
  menuAlign = "left",
  onSelect
}: {
  providers: AiProviderStatus[];
  selectedProviderId: AiProviderId | "";
  selectedModel: string;
  disabled?: boolean;
  menuAlign?: "left" | "right";
  onSelect: (providerId: AiProviderId, modelId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeProviderId, setActiveProviderId] = useState<AiProviderId | "">(selectedProviderId);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedProvider = providers.find((provider) => provider.id === selectedProviderId) ?? null;
  const activeProvider = providers.find((provider) => provider.id === activeProviderId) ?? selectedProvider ?? providers[0] ?? null;
  const selectedProviderLogo = selectedProvider ? providerLogo(selectedProvider.id) : null;
  const currentModelName = selectedModelName(selectedProvider, selectedModel);

  const providerLogos = useMemo(
    () => providers.map((provider) => ({ provider, logo: providerLogo(provider.id) })),
    [providers]
  );

  useEffect(() => {
    if (!open) return;
    setActiveProviderId((current) => current || selectedProviderId || providers[0]?.id || "");
  }, [open, providers, selectedProviderId]);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="inline-flex h-8 max-w-full items-center gap-2 border border-fg/20 bg-bg px-2.5 text-left font-mono text-xs text-fg outline-none transition hover:border-fg/40 hover:bg-fg/5 disabled:cursor-wait disabled:opacity-40"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        disabled={disabled || providers.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedProviderLogo ? <img src={selectedProviderLogo.logoUrl} alt="" className="h-4 w-4 shrink-0 object-contain" /> : null}
        <span className="min-w-0 truncate">{currentModelName}</span>
        <AppIcon icon={ArrowDown01Icon} size={13} className={`shrink-0 text-fg/40 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          className={`absolute top-full z-50 mt-2 flex w-[520px] max-w-[calc(100vw-4rem)] overflow-hidden border border-fg/20 bg-bg ${
            menuAlign === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="flex w-14 shrink-0 flex-col items-center border-r border-fg/10 py-2">
            {providerLogos.map(({ provider, logo }) => {
              const active = provider.id === activeProvider?.id;
              return (
                <button
                  key={provider.id}
                  type="button"
                  className={`grid h-11 w-full place-items-center transition ${
                    active ? "bg-fg/[0.08] text-fg" : "text-fg/40 hover:bg-fg/5 hover:text-fg"
                  }`}
                  onClick={() => setActiveProviderId(provider.id)}
                  title={provider.name}
                  aria-label={provider.name}
                >
                  {logo ? <img src={logo.logoUrl} alt="" className="max-h-6 max-w-7 object-contain" /> : <span className="font-mono text-xs">{provider.name.slice(0, 2)}</span>}
                </button>
              );
            })}
          </div>

          <div className="min-w-0 flex-1 p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">{activeProvider?.name ?? "Provider"}</div>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto">
              {(activeProvider?.models ?? []).map((model) => {
                const active = activeProvider?.id === selectedProviderId && model.id === selectedModel;
                return (
                  <button
                    key={model.id}
                    type="button"
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition ${
                      active ? "bg-accent text-bg" : "text-fg/60 hover:bg-fg/5 hover:text-fg"
                    }`}
                    onClick={() => {
                      if (activeProvider) onSelect(activeProvider.id, model.id);
                      setOpen(false);
                    }}
                    role="option"
                    aria-selected={active}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold">{model.name}</span>
                      <span className={`block truncate font-mono text-[9px] ${active ? "text-bg/80" : "text-fg/40"}`}>{model.id}</span>
                    </span>
                    {active ? <AppIcon icon={CheckmarkCircle02Icon} size={14} className="shrink-0" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
