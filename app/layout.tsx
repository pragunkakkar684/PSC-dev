import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'PSC Global — Strategic Corporate Advisory & Global Compliance Excellence',
  description: 'Multidisciplinary advisory firm providing international tax structuring, risk governance, legal counsel, and Global Capability Center setup.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
