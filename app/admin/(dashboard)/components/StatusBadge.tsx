type StatusVariant = 'published' | 'draft' | 'new' | 'read' | 'responded' | 'archived' | 'active' | 'inactive' | 'admin' | 'editor';

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
}

const variantStyles: Record<string, { bg: string; color: string; dot: string }> = {
  published: { bg: 'rgba(16,185,129,0.1)', color: '#34d399', dot: '#10b981' },
  active:    { bg: 'rgba(16,185,129,0.1)', color: '#34d399', dot: '#10b981' },
  responded: { bg: 'rgba(16,185,129,0.1)', color: '#34d399', dot: '#10b981' },
  draft:     { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', dot: '#6b7280' },
  inactive:  { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', dot: '#6b7280' },
  archived:  { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', dot: '#6b7280' },
  new:       { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', dot: '#f59e0b' },
  read:      { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', dot: '#6b7280' },
  admin:     { bg: 'rgba(197,155,39,0.12)', color: '#f59e0b', dot: '#c59b27' },
  editor:    { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', dot: '#6b7280' },
};

const defaultStyle = { bg: 'rgba(156,163,175,0.1)', color: '#9ca3af', dot: '#6b7280' };

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = variantStyles[status] ?? defaultStyle;
  const text = label ?? status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 8px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        background: style.bg,
        color: style.color,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: style.dot,
          flexShrink: 0,
        }}
      />
      {text}
    </span>
  );
}
