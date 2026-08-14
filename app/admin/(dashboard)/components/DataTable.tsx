'use client';

import { ReactNode } from 'react';
import { Search } from 'lucide-react';

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
}: DataTableProps<T>) {
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
          background: 'var(--bg-surface, #1a1d27)',
          border: '1px solid var(--border, rgba(255,255,255,0.07))',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border, rgba(255,255,255,0.07))' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    fontWeight: 600,
                    color: 'var(--text-muted, #475569)',
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
                <td colSpan={columns.length} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted, #475569)' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid var(--border, rgba(255,255,255,0.04))',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} style={{ padding: '12px 16px', color: 'var(--text-primary, #f1f5f9)', verticalAlign: 'middle' }}>
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
      </div>
    </div>
  );
}
