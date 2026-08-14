/**
 * PSC Global — Core Database Client Initialization
 *
 * Uses @neondatabase/serverless for Neon PostgreSQL.
 * This client initialization is standalone and environment-agnostic,
 * allowing it to be consumed both by Next.js server code and CLI scripts (e.g., db:seed).
 */
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env.local (Next.js default env) is loaded for standalone CLI scripts
if (typeof process !== 'undefined' && process.cwd) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Sanitizes connection string for @neondatabase/serverless HTTP driver.
 * The Neon HTTP driver operates over HTTPS. Query parameters like `channel_binding=require`
 * are libpq/TCP specific and cause Neon HTTP proxy fetch calls to fail with TypeError: fetch failed.
 * `sslmode=require` and all other parameters are strictly preserved.
 */
function sanitizeNeonUrl(rawUrl: string): string {
  if (!rawUrl || rawUrl.includes('placeholder')) return rawUrl;
  try {
    const url = new URL(rawUrl);
    if (url.searchParams.has('channel_binding')) {
      url.searchParams.delete('channel_binding');
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

const rawConnectionString =
  process.env.DATABASE_URL ||
  'postgresql://placeholder:placeholder@localhost:5432/placeholder';

const connectionString = sanitizeNeonUrl(rawConnectionString);

// Safe environment check without leaking credentials
if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  if (!process.env.DATABASE_URL) {
    console.warn(
      '[DB Warning] DATABASE_URL is not set in process.env. Using fallback connection string.'
    );
  } else {
    try {
      const parsed = new URL(rawConnectionString);
      console.log(
        `[DB Info] Database connected to host "${parsed.hostname}" (DB: "${parsed.pathname.replace('/', '')}")`
      );
    } catch {
      // Ignore URL parsing errors for logging
    }
  }
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export type Db = typeof db;
