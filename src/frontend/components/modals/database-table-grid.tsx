import {
  Add01Icon,
  Delete02Icon,
  FilterHorizontalIcon,
  Sorting05Icon,
  SortingDownIcon,
  SortingUpIcon,
  TableColumnsSplitIcon
} from "@hugeicons/core-free-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { DatabaseColumn, DatabaseRow, DatabaseRowFilter } from "../../api";
import { Checkbox } from "../ui/checkbox";
import { AppIcon } from "../ui/primitives";
import { DatabaseGridColumnsPopover } from "./database-grid-columns-popover";
import { DatabaseGridFilterPopover } from "./database-grid-filter-popover";
import { DatabaseGridPagination, type DatabaseGridPaginationState } from "./database-grid-pagination";
import { DatabaseGridSortPopover } from "./database-grid-sort-popover";
import { createGridFilter, filterOperators, type EditingCell, type GridFilter, type GridSort, type GridRowItem } from "./database-grid-types";
import { applyGridSort, displayDatabaseValue } from "./database-grid-utils";

type ToolbarPanel = "filters" | "sort" | "columns" | "";

type DatabaseTableGridProps = {
  columns: DatabaseColumn[];
  rows: DatabaseRow[];
  editable: boolean;
  hasPrimaryKey: boolean;
  busy: string;
  editingIndex: number | null;
  draftRow: Record<string, string>;
  appliedFilters: DatabaseRowFilter[];
  pagination: DatabaseGridPaginationState;
  onAddRecord: () => void;
  onBeginEdit: (index: number) => void;
  onCancelEdit: () => void;
  onDeleteRows: (rows: DatabaseRow[]) => void;
  onDraftChange: (column: string, value: string) => void;
  onApplyFilters: (filters: DatabaseRowFilter[]) => void;
  onSaveEdit: (row: DatabaseRow) => void;
};

function toolbarButton(active: boolean) {
  return `inline-flex h-8 items-center justify-center gap-2 border px-2.5 text-[13px] font-medium transition ${
    active
      ? "border-fg/15 bg-fg/5 text-fg"
      : "border-fg/15 bg-bg/75 text-fg/80 hover:border-fg/15 hover:bg-bg"
  }`;
}

function isActiveFilter(filter: GridFilter) {
  const operator = filterOperators.find((item) => item.value === filter.operator);
  return Boolean(filter.column && (operator?.requiresValue === false || filter.value.trim()));
}

function ActiveBadge() {
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center bg-accent/10 text-[10px] font-bold leading-none text-fg/80">
      !
    </span>
  );
}

export function DatabaseTableGrid({
  columns,
  rows,
  editable,
  hasPrimaryKey,
  busy,
  editingIndex,
  draftRow,
  appliedFilters,
  pagination,
  onAddRecord,
  onBeginEdit,
  onCancelEdit,
  onDeleteRows,
  onDraftChange,
  onApplyFilters,
  onSaveEdit
}: DatabaseTableGridProps) {
  const skipBlurCommitRef = useRef(false);
  const [activePanel, setActivePanel] = useState<ToolbarPanel>("");
  const [filters, setFilters] = useState<GridFilter[]>(() => [createGridFilter(columns)]);
  const [sort, setSort] = useState<GridSort | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(() => new Set());
  const [selectedRows, setSelectedRows] = useState<Set<number>>(() => new Set());
  const [editingCell, setEditingCell] = useState<EditingCell>(null);

  useEffect(() => {
    const columnNames = new Set(columns.map((column) => column.name));
    setHiddenColumns((current) => new Set(Array.from(current).filter((name) => columnNames.has(name))));
    setSelectedRows(new Set<number>());
    setEditingCell(null);
    setFilters((current) => {
      const nextFilters = current.map((filter) => (columnNames.has(filter.column) ? filter : { ...filter, column: columns[0]?.name ?? "" }));
      return nextFilters.length > 0 ? nextFilters : [createGridFilter(columns)];
    });
    setSort((current) => (current && columnNames.has(current.column) ? current : null));
  }, [columns, rows]);

  useEffect(() => {
    if (editingIndex === null) setEditingCell(null);
  }, [editingIndex]);

  const visibleColumns = useMemo(() => columns.filter((column) => !hiddenColumns.has(column.name)), [columns, hiddenColumns]);
  const visibleRows = useMemo(() => applyGridSort(rows.map((row, index) => ({ row, index })), sort), [rows, sort]);
  const selectedItems = useMemo<GridRowItem[]>(() => rows.map((row, index) => ({ row, index })).filter(({ index }) => selectedRows.has(index)), [rows, selectedRows]);
  const draftFilters = filters.filter(isActiveFilter).map(({ column, operator, value }) => ({ column, operator, value: value.trim() }));
  const appliedFilterCount = appliedFilters.length;
  const hasUnappliedFilters = draftFilters.length > 0 && JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters);
  const canSelectRows = editable && hasPrimaryKey;
  const allVisibleSelected = canSelectRows && visibleRows.length > 0 && visibleRows.every(({ index }) => selectedRows.has(index));

  function togglePanel(panel: ToolbarPanel) {
    if (panel === "filters" && filters.length === 0) setFilters([createGridFilter(columns)]);
    setActivePanel((current) => {
      if (current === panel) return "";
      return panel;
    });
  }

  function toggleColumn(column: string) {
    setHiddenColumns((current) => {
      const next = new Set(current);
      if (next.has(column)) {
        next.delete(column);
      } else if (visibleColumns.length > 1) {
        next.add(column);
      }
      return next;
    });
  }

  function toggleVisibleRows() {
    if (!canSelectRows) return;
    setSelectedRows((current) => {
      const next = new Set(current);
      if (allVisibleSelected) {
        visibleRows.forEach(({ index }) => next.delete(index));
      } else {
        visibleRows.forEach(({ index }) => next.add(index));
      }
      return next;
    });
  }

  function toggleRow(index: number) {
    if (!canSelectRows) return;
    setSelectedRows((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function deleteSelectedRows() {
    if (selectedItems.length === 0 || !hasPrimaryKey) return;
    onDeleteRows(selectedItems.map((item) => item.row));
  }

  function applyFilters() {
    onApplyFilters(draftFilters);
  }

  function clearFilters() {
    setFilters([createGridFilter(columns)]);
    onApplyFilters([]);
  }

  function startCellEdit(rowIndex: number, column: string) {
    if (!editable || !hasPrimaryKey) return;
    skipBlurCommitRef.current = false;
    onBeginEdit(rowIndex);
    setEditingCell({ rowIndex, column });
  }

  function commitCell(row: DatabaseRow) {
    if (!editingCell) return;
    if (skipBlurCommitRef.current) {
      skipBlurCommitRef.current = false;
      return;
    }
    setEditingCell(null);
    onSaveEdit(row);
  }

  function cancelCellEdit() {
    skipBlurCommitRef.current = true;
    setEditingCell(null);
    onCancelEdit();
  }

  function handleEditKeyDown(event: KeyboardEvent<HTMLInputElement>, row: DatabaseRow) {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    } else if (event.key === "Escape") {
      cancelCellEdit();
    } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      commitCell(row);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="relative">
          <button type="button" className={toolbarButton(activePanel === "filters")} onClick={() => togglePanel("filters")}>
            <AppIcon icon={FilterHorizontalIcon} size={15} />
            Filters
          </button>
          {appliedFilterCount > 0 ? <ActiveBadge /> : null}
        </div>

        <div className="relative">
          <button type="button" className={toolbarButton(activePanel === "sort")} onClick={() => togglePanel("sort")}>
            <AppIcon icon={Sorting05Icon} size={15} />
            Sort
          </button>
          {sort ? <ActiveBadge /> : null}
          {activePanel === "sort" ? <DatabaseGridSortPopover columns={columns} sort={sort} onSortChange={setSort} /> : null}
        </div>

        <div className="relative">
          <button type="button" className={toolbarButton(activePanel === "columns")} onClick={() => togglePanel("columns")}>
            <AppIcon icon={TableColumnsSplitIcon} size={15} />
            Columns
          </button>
          {activePanel === "columns" ? (
            <DatabaseGridColumnsPopover columns={columns} hiddenColumns={hiddenColumns} visibleCount={visibleColumns.length} onToggleColumn={toggleColumn} />
          ) : null}
        </div>

        {canSelectRows && selectedItems.length > 0 ? (
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center gap-2 border border-accent/30 bg-accent/10 px-2.5 text-[13px] font-medium text-accent transition hover:bg-accent/10 disabled:opacity-50"
            onClick={deleteSelectedRows}
            disabled={!hasPrimaryKey || busy === "delete"}
          >
            <AppIcon icon={Delete02Icon} size={15} />
            Delete {selectedItems.length}
          </button>
        ) : null}

        {editable ? (
          <button
            type="button"
            className="ml-auto inline-flex h-8 items-center justify-center gap-2 border border-fg/15 bg-fg/5 px-3 text-[13px] font-medium text-fg/80 transition hover:bg-fg/5"
            onClick={onAddRecord}
          >
            <AppIcon icon={Add01Icon} size={15} />
            Add record
          </button>
        ) : null}
      </div>

      {activePanel === "filters" ? (
        <DatabaseGridFilterPopover
          columns={columns}
          filters={filters}
          onFiltersChange={setFilters}
          canApply={hasUnappliedFilters}
          canClear={appliedFilterCount > 0}
          applying={busy === "rows"}
          onApply={applyFilters}
          onClear={clearFilters}
          floating={false}
        />
      ) : null}

      <div className="min-h-0 flex-1 overflow-auto border border-fg/15 bg-bg">
        <table className="min-w-full border-collapse text-left font-mono text-[13px]">
          <thead className="sticky top-0 z-10 bg-bg text-fg/60">
            <tr>
              {canSelectRows ? (
                <th className="w-10 border-b border-r border-fg/15 px-2.5 py-2">
                  <Checkbox checked={allVisibleSelected} onChange={toggleVisibleRows} label="Select visible records" />
                </th>
              ) : null}
              {visibleColumns.map((column) => {
                const sorted = sort?.column === column.name;
                return (
                  <th key={column.name} className="min-w-[200px] border-b border-r border-fg/15 px-3 py-2 font-semibold">
                    <button
                      type="button"
                      className="flex w-full min-w-0 items-center justify-between gap-3 text-left"
                      onClick={() => setSort({ column: column.name, direction: sorted && sort?.direction === "asc" ? "desc" : "asc" })}
                    >
                      <span className="min-w-0 truncate">
                        <span className="text-fg/80">{column.name}</span>
                        <span className="ml-2 text-fg/60">{column.type}</span>
                        {column.primaryKey ? <span className="ml-2 text-fg/60">pk</span> : null}
                      </span>
                      <AppIcon icon={sorted ? (sort?.direction === "asc" ? SortingUpIcon : SortingDownIcon) : Sorting05Icon} size={13} className={sorted ? "text-fg/80" : "text-fg/40"} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + (canSelectRows ? 1 : 0)} className="px-3 py-6 text-[13px] text-fg/60">
                  {appliedFilterCount > 0 ? "No records match these filters." : "No rows returned."}
                </td>
              </tr>
            ) : visibleRows.map(({ row, index }) => {
              const selected = selectedRows.has(index);
              return (
                <tr key={index} className={`border-b border-fg/15 ${selected ? "bg-fg/5" : "odd:bg-bg even:bg-bg/45 hover:bg-fg/10/60"}`}>
                  {canSelectRows ? (
                    <td className="w-10 border-r border-fg/15 px-2.5 py-2">
                      <Checkbox checked={selected} onChange={() => toggleRow(index)} label={`Select record ${index + 1}`} />
                    </td>
                  ) : null}
                  {visibleColumns.map((column) => {
                    const value = row[column.name];
                    const empty = value === null || value === undefined;
                    const activeCell = editingCell?.rowIndex === index && editingCell.column === column.name && editingIndex === index;
                    return (
                      <td
                        key={column.name}
                        className="min-w-[200px] max-w-[300px] border-r border-fg/15 px-3 py-2 align-middle text-fg/80"
                        onDoubleClick={() => startCellEdit(index, column.name)}
                      >
                        {activeCell ? (
                          <input
                            autoFocus
                            value={draftRow[column.name] ?? ""}
                            onBlur={() => commitCell(row)}
                            onChange={(event) => onDraftChange(column.name, event.target.value)}
                            onFocus={(event) => event.currentTarget.select()}
                            onKeyDown={(event) => handleEditKeyDown(event, row)}
                            className="h-8 w-full border border-fg/15 bg-bg px-2 text-fg/80 outline-none focus:border-fg/15"
                          />
                        ) : (
                          <span className={`block truncate ${empty ? "text-fg/40" : ""}`} title={displayDatabaseValue(value)}>
                            {displayDatabaseValue(value)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <DatabaseGridPagination pagination={pagination} loadedRows={rows.length} busy={busy} />
    </div>
  );
}
