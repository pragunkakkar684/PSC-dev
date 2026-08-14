/**
 * PSC Global — Next.js Protected Database Connection
 *
 * This entrypoint is SERVER-ONLY — never import into client components.
 * The `server-only` package enforces at Next.js build time that database
 * code and environment secrets can NEVER be bundled into client components.
 */
import 'server-only';

export { db, type Db } from './client';
