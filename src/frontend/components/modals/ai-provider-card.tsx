import { StarIcon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../ui/primitives";
import type { AiProviderDefinition } from "./ai-settings-data";

export function AiProviderCard({
  provider,
  selected,
  connected,
  isDefaultModel,
  onSelect
}: {
  provider: AiProviderDefinition;
  selected: boolean;
  connected: boolean;
  isDefaultModel: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`mb-1 flex min-h-16 w-full items-center justify-between gap-3 border-l-2 px-3 py-2.5 text-left transition ${
        selected
          ? "border-fg bg-fg/[0.08]"
          : "border-transparent bg-transparent hover:bg-fg/[0.04]"
      }`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center">
          <img src={provider.logoUrl} alt="" className="max-h-6 max-w-7 object-contain" loading="lazy" />
        </span>
        <span className="truncate text-sm text-fg/80">{provider.name}</span>
      </span>

      <span className="flex shrink-0 items-center gap-2">
        {isDefaultModel ? <AppIcon icon={StarIcon} size={12} className="fill-accent text-accent" /> : null}
        <span className={`h-1.5 w-1.5 ${connected ? "bg-accent/10" : "border border-fg/15"}`} />
        <span className="sr-only">
          {connected ? "Connected" : "Not connected"}
          {isDefaultModel ? ", default provider" : ""}
        </span>
      </span>
    </button>
  );
}
