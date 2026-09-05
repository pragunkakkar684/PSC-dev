'use client';

import { ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsUpDown, ListFilter, RefreshCw, ChevronDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  searchPlaceholder?: string;
  filterSlot?: ReactNode;
  actionSlot?: ReactNode;
  emptyMessage?: string;
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterSlot,
  actionSlot,
  emptyMessage = 'No records found.',
  page = 1,
  pageSize = 10,
  totalCount = data.length,
  onPageChange,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);

  return (
    <div className="data-table">
      <div className="toolbar">
        {onSearchChange && (
          <div className="field-search">
            <Search size={16} />
            <input
              type="text"
              value={searchQuery ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>
        )}
        {filterSlot ?? (
          <button type="button" className="filter-button">
            <ListFilter size={15} /> All statuses <ChevronDown size={14} />
          </button>
        )}
        <button type="button" className="filter-button">
          <RefreshCw size={14} /> Refresh
        </button>
        {actionSlot}
        <span className="result-count">{totalCount} results</span>
      </div>

      <section className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} style={{ width: col.width }}>
                    {col.header} <ChevronsUpDown size={12} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="data-table-empty">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id}>
                    {columns.map((col, idx) => (
                      <td key={idx}>
                        {col.render ? col.render(row) : col.accessor ? (row[col.accessor] as ReactNode) : null}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="table-footer">
            <span className="table-footer-summary">
              Showing {startIndex} of {totalCount}
            </span>
            <div className="pagination-controls" aria-label="Pagination">
              <button
                type="button"
                className="pagination"
                disabled={page <= 1}
                onClick={() => onPageChange?.(page - 1)}
              >
                <ChevronLeft size={15} />
              </button>
              <button type="button" className="pagination active">
                {page}
              </button>
              {totalPages > 1 && (
                <button
                  type="button"
                  className="pagination"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                >
                  {Math.min(totalPages, page + 1)}
                </button>
              )}
              <button
                type="button"
                className="pagination"
                disabled={!onPageChange || page >= totalPages}
                onClick={() => onPageChange?.(page + 1)}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
