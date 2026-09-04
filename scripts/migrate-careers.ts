import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function migrateCareers() {
  console.log("Migrating careers database schema...");
  
  // 1. Add questions column to careers_positions if it doesn't exist
  await sql`ALTER TABLE careers_positions ADD COLUMN IF NOT EXISTS questions JSONB;`;

  // 2. Create portal_job_applications table if it doesn't exist
  await sql`
    CREATE TABLE IF NOT EXISTS portal_job_applications (
      id SERIAL PRIMARY KEY,
      job_id INT NOT NULL REFERENCES careers_positions(id) ON DELETE CASCADE,
      applicant_name VARCHAR(255) NOT NULL,
      applicant_email VARCHAR(320) NOT NULL,
      applicant_phone VARCHAR(50) NOT NULL,
      resume_url VARCHAR(1000),
      cover_letter TEXT,
      answers JSONB,
      status VARCHAR(50) NOT NULL DEFAULT 'NEW',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  console.log("Successfully migrated careers database schema!");
}

migrateCareers().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
