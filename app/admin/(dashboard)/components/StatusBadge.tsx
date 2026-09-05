type StatusVariant =
  | 'published'
  | 'draft'
  | 'new'
  | 'read'
  | 'responded'
  | 'archived'
  | 'active'
  | 'inactive'
  | 'admin'
  | 'editor'
  | 'visible'
  | 'hidden';

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const text = label ?? status.charAt(0).toUpperCase() + status.slice(1);
  const slug = text.toLowerCase().replaceAll(' ', '-');

  return (
    <span className={`status status-${slug}`}>
      <span />
      {text}
    </span>
  );
}
