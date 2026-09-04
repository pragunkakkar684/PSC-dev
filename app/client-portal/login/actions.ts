'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { db } from '@/lib/db';
import { users, portalUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function loginClientPortalAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  try {
    const [user] = await db
      .select({ id: users.id, role: users.role, password: users.password })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user || !user.password) {
      return { error: 'Invalid credentials. Please check your email and password.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { error: 'Invalid credentials. Please check your email and password.' };
    }

    const [pUser] = await db
      .select({ portalRole: portalUsers.portalRole })
      .from(portalUsers)
      .where(eq(portalUsers.userId, user.id))
      .limit(1);

    const isPortalAdmin =
      pUser?.portalRole === 'PORTAL_ADMIN' ||
      user.role === 'admin' ||
      user.role === 'editor' ||
      user.role === 'superadmin';

    const targetRedirect = isPortalAdmin ? '/client-portal/admin' : '/client-portal';

    await signIn('credentials', {
      email,
      password,
      redirectTo: targetRedirect,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials. Please check your email and password.' };
        default:
          return { error: 'Authentication failed. Please try again.' };
      }
    }
    throw error;
  }
}
