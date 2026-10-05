import { Search01Icon } from "@hugeicons/core-free-icons";
import { AppIcon, btn } from "../../components/ui/primitives";

export function ServiceSearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <section className="flex min-h-60 flex-col items-center justify-center border border-fg/10 bg-fg/[0.03] p-8 text-center">
      <AppIcon icon={Search01Icon} size={20} className="text-fg/40" />
      <h2 className="mt-3 text-base font-bold text-fg">No matching services</h2>
      <p className="mt-1 font-mono text-xs text-fg/40">
        Nothing matched “{query}”.
      </p>
      <button
        type="button"
        onClick={onClear}
        className={`mt-4 ${btn("secondary")}`}
      >
        Clear search
      </button>
    </section>
  );
}
