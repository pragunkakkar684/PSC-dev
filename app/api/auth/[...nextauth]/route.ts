/**
 * Auth.js (NextAuth v5) — Route Handler
 * Handles all /api/auth/* requests: signIn, signOut, session, etc.
 */
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
