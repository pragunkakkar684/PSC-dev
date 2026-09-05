'use client';

import { ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
  // Pagination props
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
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', flex: 1 }}>
          {onSearchChange && (
            <div style={{ position: 'relative', width: '260px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted, #475569)',
                }}
              />
              <input
                type="text"
                value={searchQuery ?? ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="form-input"
                style={{ paddingLeft: '34px', height: '38px', fontSize: '13px' }}
              />
            </div>
          )}
          {filterSlot}
        </div>
        {actionSlot}
      </div>

      {/* Table Container */}
      <div
        style={{
          background: 'var(--bg-surface, #12131a)',
          border: '1px solid var(--border, rgba(255,255,255,0.08))',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated, #181a24)', borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    fontWeight: 600,
                    color: 'var(--text-muted, #9ca3af)',
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                    width: col.width,
                    textAlign: 'left',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted, #9ca3af)' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid var(--border, rgba(255,255,255,0.05))',
                    transition: 'background 0.1s',
                  }}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} style={{ padding: '12px 16px', color: 'var(--text-primary, #f3f4f6)', verticalAlign: 'middle' }}>
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? (row[col.accessor] as ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Server-Side Pagination Footer Bar */}
        {totalCount > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderTop: '1px solid var(--border, rgba(255,255,255,0.08))',
              background: 'var(--bg-surface, #12131a)',
              fontSize: '12px',
              color: 'var(--text-muted, #9ca3af)',
            }}
          >
            <div>
              Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of <strong>{totalCount}</strong> records
            </div>

            {onPageChange && totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                >
                  <ChevronLeft size={14} /> Prev
                </button>

                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
