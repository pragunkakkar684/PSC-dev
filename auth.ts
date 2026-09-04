import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users, portalUsers } from '@/lib/db/schema';
import { authConfig } from './auth.config';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const [user] = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            password: users.password,
          })
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        const [pUser] = await db
          .select({ portalRole: portalUsers.portalRole })
          .from(portalUsers)
          .where(eq(portalUsers.userId, user.id))
          .limit(1);

        const portalRole = pUser?.portalRole || (user.role === 'admin' || user.role === 'editor' ? 'PORTAL_ADMIN' : 'CLIENT');

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          portalRole,
        };
      },
    }),
  ],
});
