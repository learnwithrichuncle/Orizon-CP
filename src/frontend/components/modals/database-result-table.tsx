import type { DatabaseColumn, DatabaseRow, DatabaseRowValue } from "../../api";

function displayValue(value: DatabaseRowValue) {
  if (value === null) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

export function DatabaseResultTable({
  columns,
  rows,
  emptyLabel = "No rows returned."
}: {
  columns: Array<DatabaseColumn | string>;
  rows: DatabaseRow[];
  emptyLabel?: string;
}) {
  const columnMeta = columns.map((column) => (
    typeof column === "string"
      ? { name: column, type: "" }
      : { name: column.name, type: column.type }
  ));
  const columnNames = columnMeta.map((column) => column.name);

  if (columnNames.length === 0 || rows.length === 0) {
    return <div className="border border-fg/15 bg-bg/45 px-5 py-8 text-sm text-fg/60">{emptyLabel}</div>;
  }

  return (
    <div className="h-full min-h-0 overflow-auto border border-fg/15 bg-bg">
      <table className="min-w-full border-collapse text-left font-mono text-sm">
        <thead className="sticky top-0 z-10 bg-bg text-fg/60">
          <tr>
            {columnMeta.map((column) => (
              <th key={column.name} className="min-w-[220px] border-b border-r border-fg/15 px-4 py-3 font-semibold">
                <span className="block truncate">
                  <span className="text-fg/80">{column.name}</span>
                  {column.type ? <span className="ml-2 text-fg/60">{column.type}</span> : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-fg/15 odd:bg-bg even:bg-bg/45 hover:bg-fg/10/60">
              {columnNames.map((column) => {
                const value = row[column] ?? null;
                return (
                  <td key={column} className="min-w-[220px] max-w-[320px] border-r border-fg/15 px-4 py-3 align-middle text-fg/80">
                    <span className={`block truncate ${value === null ? "text-fg/40" : ""}`} title={displayValue(value)}>
                      {displayValue(value)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
