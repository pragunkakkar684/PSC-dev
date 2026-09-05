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
    <div className="form-field">
      <label htmlFor={htmlFor} className="form-field-label">
        {label}
        {required && <span className="form-field-required">*</span>}
      </label>

      {children}

      {hint && !error && (
        <span className="form-field-hint">
          {hint}
        </span>
      )}

      {error && (
        <span className="form-field-error">
          {error}
        </span>
      )}
    </div>
  );
}
