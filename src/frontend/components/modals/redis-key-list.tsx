import type { DatabaseTable } from "../../api";

type RedisKeyListProps = {
  keys: DatabaseTable[];
  selectedKey: string;
  loading: boolean;
  runtimeUnavailable: boolean;
  onSelect: (key: DatabaseTable) => void;
};

export function RedisKeyList({
  keys,
  selectedKey,
  loading,
  runtimeUnavailable,
  onSelect
}: RedisKeyListProps) {
  return (
    <aside className="flex min-h-0 flex-col border-b border-fg/10 lg:border-b-0 lg:border-r">
      <div className="flex h-10 items-center justify-between border-b border-fg/10 px-4 font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">
        <span>Keys</span>
        <span>{keys.length}</span>
      </div>

      <div className="min-h-40 flex-1 overflow-y-auto">
        {loading && keys.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-fg/40">
            Loading keys…
          </div>
        ) : keys.length === 0 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs text-fg/40">
            {runtimeUnavailable ? "Database not ready." : "No keys found."}
          </div>
        ) : (
          keys.map((key) => {
            const selected = selectedKey === key.id;
            return (
              <button
                key={key.id}
                type="button"
                className={
                  selected
                    ? "flex h-11 w-full items-center justify-between gap-3 border-b border-black/10 bg-fg px-4 text-left text-bg"
                    : "flex h-11 w-full items-center justify-between gap-3 border-b border-fg/[0.07] px-4 text-left text-fg/60 transition hover:bg-fg/[0.04] hover:text-fg"
                }
                onClick={() => onSelect(key)}
                aria-current={selected ? "true" : undefined}
              >
                <span className="min-w-0 truncate font-mono text-xs">{key.name}</span>
                <span
                  className={`shrink-0 font-mono text-[8px] uppercase tracking-[0.14em] ${
                    selected ? "text-bg/55" : "text-fg/40"
                  }`}
                >
                  {key.schema}
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
