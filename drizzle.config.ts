import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function sanitizeNeonUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  try {
    const url = new URL(rawUrl);
    url.searchParams.delete('channel_binding');
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: sanitizeNeonUrl(process.env.DATABASE_URL),
  },
  verbose: true,
  strict: true,
});
