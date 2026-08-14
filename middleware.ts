/**
 * Next.js Middleware — Route Protection
 *
 * Runs on the Edge runtime before every request.
 * Uses auth.config.ts (Edge-compatible) to protect /admin/* routes.
 *
 * Unauthenticated → redirected to /admin/login
 * Authenticated on /admin/login → redirected to /admin
 */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    /*
     * Match all /admin/* routes.
     * Excludes static files and Next.js internals.
     */
    '/admin/:path*',
  ],
};
