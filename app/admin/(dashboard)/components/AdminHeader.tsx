import type { CmsUser } from '@/lib/auth/permissions';

interface AdminHeaderProps {
  title: string;
  user?: CmsUser;
}

export function AdminHeader({ title, user }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <h1 className="admin-header-title">{title}</h1>
      {user && (
        <div className="admin-header-user">
          <span className="admin-header-role-badge" data-role={user.role}>
            {user.role}
          </span>
          <span className="admin-header-name">{user.name ?? user.email}</span>
        </div>
      )}
    </header>
  );
}
