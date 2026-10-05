import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "../../components/ui/primitives";

export function ProjectSearch({
  query,
  resultCount,
  totalCount,
  onQueryChange,
}: {
  query: string;
  resultCount: number;
  totalCount: number;
  onQueryChange: (query: string) => void;
}) {
  const projectLabel = totalCount === 1 ? "project" : "projects";

  return (
    <div className="flex flex-col gap-3 border-y border-fg/10 py-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="relative block w-full sm:max-w-md">
        <span className="sr-only">Search projects</span>
        <AppIcon
          icon={Search01Icon}
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg/40"
        />
        <input
          type="text"
          inputMode="search"
          role="searchbox"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search projects or services…"
          className="h-10 w-full border border-fg/20 bg-transparent pl-10 pr-10 text-sm text-fg outline-none transition placeholder:text-fg/30 focus:border-accent"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear project search"
            className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-fg/40 transition hover:text-fg"
          >
            <AppIcon icon={Cancel01Icon} size={14} />
          </button>
        ) : null}
      </label>

      <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-fg/40">
        {query.trim()
          ? `${resultCount} of ${totalCount} ${projectLabel}`
          : `${totalCount} ${projectLabel}`}
      </span>
    </div>
  );
}
