'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function loginClientPortalAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/client-portal',
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
