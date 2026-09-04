import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    /*
     * Match all /admin/* and /client-portal/* routes.
     * Excludes static files and Next.js internals.
     */
    '/admin/:path*',
    '/client-portal/:path*',
  ],
};
