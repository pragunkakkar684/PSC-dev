import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
      <label
        htmlFor={htmlFor}
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-primary, #f1f5f9)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>

      {children}

      {hint && !error && (
        <span style={{ fontSize: '12px', color: 'var(--text-muted, #475569)' }}>
          {hint}
        </span>
      )}

      {error && (
        <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}
