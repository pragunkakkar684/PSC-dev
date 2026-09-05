interface AdminHeaderProps {
  title?: string;
  user?: unknown;
}

/** Top bar lives in AdminShell. Kept so existing pages compile without a second header. */
export function AdminHeader(_props: AdminHeaderProps) {
  return null;
}
