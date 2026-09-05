import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function migrateCmsV2() {
  console.log("Migrating CMS v2 database schema (Audit logs, Revisions, Indexes)...");

  // 1. Audit logs table
  await sql`
    CREATE TABLE IF NOT EXISTS cms_audit_logs (
      id SERIAL PRIMARY KEY,
      user_id TEXT,
      user_name VARCHAR(255),
      user_role VARCHAR(50),
      action VARCHAR(50) NOT NULL,
      resource VARCHAR(100) NOT NULL,
      resource_id VARCHAR(100),
      details JSONB,
      ip_address VARCHAR(100),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  // 2. Content Revisions table
  await sql`
    CREATE TABLE IF NOT EXISTS content_revisions (
      id SERIAL PRIMARY KEY,
      resource_type VARCHAR(100) NOT NULL,
      resource_id VARCHAR(100) NOT NULL,
      version INT NOT NULL DEFAULT 1,
      title VARCHAR(500),
      content JSONB NOT NULL,
      created_by_id TEXT,
      created_by_name VARCHAR(255),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  // 3. Foreign key and search performance indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_insights_slug ON insights_articles(slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_practice_slug ON practice_areas(slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_industries_slug ON industries(slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_page_sections_slug ON page_sections(page_slug);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_careers_published ON careers_positions(is_published);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_created ON cms_audit_logs(created_at DESC);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_revisions_resource ON content_revisions(resource_type, resource_id);`;

  console.log("CMS v2 database migration completed successfully!");
}

migrateCmsV2().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
