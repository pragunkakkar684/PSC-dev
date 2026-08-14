import type { CSSProperties } from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '48px 24px',
  background: 'rgba(239, 68, 68, 0.05)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
  borderRadius: '12px',
  margin: '16px 0',
};

const iconWrapperStyle: CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#f87171',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
};

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  retry,
}: ErrorStateProps) {
  return (
    <div style={containerStyle}>
      <div style={iconWrapperStyle}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f87171', marginBottom: '4px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', maxWidth: '360px', lineHeight: 1.5 }}>
        {message}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="btn btn-secondary"
          style={{ marginTop: '16px' }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
