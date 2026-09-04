import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    /**
     * Route Protection & Authorization
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isAdminPath = pathname.startsWith('/admin');
      const isAdminLoginPage = pathname === '/admin/login';

      const isClientPortalPath = pathname.startsWith('/client-portal');
      const isClientPortalAdminPath = pathname.startsWith('/client-portal/admin');
      const isClientPortalLoginPage = pathname === '/client-portal/login';

      // ─── CMS ADMIN PROTECTION (/admin/*) ───────────────────────────
      if (isAdminPath && !isAdminLoginPage) {
        return isLoggedIn;
      }
      if (isAdminLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl));
      }

      // ─── CLIENT PORTAL PROTECTION (/client-portal/*) ───────────────
      if (isClientPortalPath && !isClientPortalLoginPage) {
        if (!isLoggedIn) {
          // Unauthenticated -> redirect to Client Portal login
          return Response.redirect(new URL('/client-portal/login', nextUrl));
        }

        // If client user attempts to access Portal Admin (/client-portal/admin)
        const role = (auth?.user as any)?.role;
        const portalRole = (auth?.user as any)?.portalRole;

        if (isClientPortalAdminPath) {
          const isPortalAdmin = portalRole === 'PORTAL_ADMIN' || role === 'admin' || role === 'editor' || role === 'superadmin';
          if (!isPortalAdmin) {
            // Deny client access to portal admin
            return Response.redirect(new URL('/client-portal', nextUrl));
          }
        }
        return true;
      }

      if (isClientPortalLoginPage && isLoggedIn) {
        const role = (auth?.user as any)?.role;
        const portalRole = (auth?.user as any)?.portalRole;
        const isPortalAdmin = portalRole === 'PORTAL_ADMIN' || role === 'admin' || role === 'editor' || role === 'superadmin';

        if (isPortalAdmin) {
          return Response.redirect(new URL('/client-portal/admin', nextUrl));
        } else {
          return Response.redirect(new URL('/client-portal', nextUrl));
        }
      }

      return true;
    },

    /** Attach role + id + portalRole to JWT token */
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.portalRole = (user as { portalRole?: string }).portalRole;
        token.id = user.id;
      }
      return token;
    },

    /** Expose role + portalRole + id in session */
    session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: string; portalRole?: string; id?: string }).role = token.role as string;
        (session.user as { portalRole?: string }).portalRole = token.portalRole as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
  session: { strategy: 'jwt' },
};