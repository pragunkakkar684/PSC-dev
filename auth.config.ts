/**
 * Auth.js (NextAuth v5) — Edge-compatible Configuration
 *
 * This file contains ONLY what can run on the Edge runtime
 * (no Node.js-specific APIs like bcryptjs).
 *
 * Used by middleware.ts for route protection.
 * The full auth config (with Credentials + bcrypt) is in auth.ts.
 */
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    /**
     * Controls access to pages.
     * Unauthenticated requests to /admin/* → redirect to login.
     * Authenticated users on /admin/login → redirect to dashboard.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPath = nextUrl.pathname.startsWith('/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';

      if (isAdminPath && !isLoginPage) {
        // Protect all /admin/* except /admin/login
        return isLoggedIn;
      }

      if (isLoginPage && isLoggedIn) {
        // Already logged in — redirect away from login page
        return Response.redirect(new URL('/admin', nextUrl));
      }

      return true;
    },

    /** Attach role to JWT token */
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },

    /** Expose role + id in the session object */
    session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
  session: { strategy: 'jwt' },
};

//test