import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local (Next.js environment file) and fallback to .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { db } from '../lib/db/client';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

/**
 * Seed script to create the initial admin user.
 *
 * Reads credentials from environment variables:
 *   SEED_ADMIN_EMAIL    (defaults to admin@pscglobal.com)
 *   SEED_ADMIN_PASSWORD (defaults to AdminPass123!)
 *   SEED_ADMIN_NAME     (defaults to System Admin)
 *
 * Run with: npm run db:seed
 */
async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@pscglobal.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!';
  const name = process.env.SEED_ADMIN_NAME || 'System Admin';

  console.log(`Checking if user ${email} already exists...`);

  const [existingUser] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    console.log(`User ${email} already exists with ID: ${existingUser.id}`);
    return;
  }

  console.log(`Hashing password for ${email}...`);
  const hashedPassword = await bcrypt.hash(password, 12);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    })
    .returning({ id: users.id, email: users.email, role: users.role });

  console.log(`Successfully created admin user:`, newUser);
}

seedAdminUser()
  .catch((err) => {
    console.error('Failed to seed admin user:', err);
    process.exit(1);
  })
  .then(() => {
    console.log('Seeding completed.');
    process.exit(0);
  });
