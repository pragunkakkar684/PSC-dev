import type { CSSProperties } from 'react';

interface LoadingStateProps {
  message?: string;
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 24px',
  color: 'var(--text-muted, #475569)',
  gap: '12px',
};

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div style={containerStyle}>
      <svg
        style={{
          animation: 'spin 0.8s linear infinite',
          width: '24px',
          height: '24px',
        }}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: '13px', fontWeight: 500 }}>{message}</span>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
