import type { Metadata } from 'next';
import { requireEditor } from '@/lib/auth/permissions';
import { AdminShell } from './components/AdminShell';
import { ThemeProvider } from './components/ThemeProvider';

export const metadata: Metadata = {
  title: {
    template: '%s | PSC Global CMS',
    default: 'PSC Global CMS',
  },
  description: 'PSC Global Content Management System',
  robots: 'noindex, nofollow',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await requireEditor();

  return (
    <ThemeProvider>
      <AdminShell user={user}>{children}</AdminShell>
    </ThemeProvider>
  );
}
