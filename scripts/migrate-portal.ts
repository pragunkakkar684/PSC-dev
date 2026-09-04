import { db } from '../lib/db/client';
import { sql } from 'drizzle-orm';

async function migratePortal() {
  console.log('Migrating Client Portal DB schema...');

  const statements = [
    sql`CREATE TABLE IF NOT EXISTS portal_clients (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      contact_name VARCHAR(255) NOT NULL,
      email VARCHAR(320) NOT NULL UNIQUE,
      phone VARCHAR(50),
      address TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
      created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_users (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      client_id INTEGER REFERENCES portal_clients(id) ON DELETE CASCADE,
      portal_role VARCHAR(20) NOT NULL DEFAULT 'CLIENT',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_engagements (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      service_category VARCHAR(150),
      description TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_tasks (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      engagement_id INTEGER REFERENCES portal_engagements(id) ON DELETE SET NULL,
      name VARCHAR(255) NOT NULL,
      due_date DATE,
      status VARCHAR(50) NOT NULL DEFAULT 'UPCOMING',
      priority VARCHAR(20) DEFAULT 'NORMAL',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_compliance_items (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      engagement_id INTEGER REFERENCES portal_engagements(id) ON DELETE SET NULL,
      requirement VARCHAR(255) NOT NULL,
      due_date DATE,
      status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_documents (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      engagement_id INTEGER REFERENCES portal_engagements(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      file_url VARCHAR(1000) NOT NULL,
      file_type VARCHAR(50),
      file_size VARCHAR(50),
      category VARCHAR(100),
      status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
      uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_invoices (
      id SERIAL PRIMARY KEY,
      invoice_number VARCHAR(100) NOT NULL,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      engagement_id INTEGER REFERENCES portal_engagements(id) ON DELETE SET NULL,
      amount VARCHAR(50) NOT NULL,
      issue_date DATE,
      due_date DATE,
      status VARCHAR(50) NOT NULL DEFAULT 'UNPAID',
      pdf_url VARCHAR(1000),
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_payments (
      id SERIAL PRIMARY KEY,
      payment_ref VARCHAR(100) NOT NULL,
      invoice_id INTEGER REFERENCES portal_invoices(id) ON DELETE SET NULL,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      amount VARCHAR(50) NOT NULL,
      payment_date DATE,
      payment_method VARCHAR(50) DEFAULT 'BANK_TRANSFER',
      status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_meetings (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      requested_date DATE,
      time_slot VARCHAR(100),
      notes TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
      meeting_url VARCHAR(1000),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_reports (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      engagement_id INTEGER REFERENCES portal_engagements(id) ON DELETE SET NULL,
      title VARCHAR(255) NOT NULL,
      period VARCHAR(100),
      publication_date DATE,
      file_url VARCHAR(1000),
      summary TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_support_tickets (
      id SERIAL PRIMARY KEY,
      ticket_number VARCHAR(50) NOT NULL,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      subject VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      priority VARCHAR(50) DEFAULT 'MEDIUM',
      status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_ticket_replies (
      id SERIAL PRIMARY KEY,
      ticket_id INTEGER NOT NULL REFERENCES portal_support_tickets(id) ON DELETE CASCADE,
      sender_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      sender_type VARCHAR(20) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,

    sql`CREATE TABLE IF NOT EXISTS portal_notifications (
      id SERIAL PRIMARY KEY,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'INFO',
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      link VARCHAR(500),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );`,
  ];

  for (const statement of statements) {
    await db.execute(statement);
  }

  console.log('✅ All Client Portal DB tables migrated successfully!');
  process.exit(0);
}

migratePortal().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
