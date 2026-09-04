import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf8");
for (const line of envFile.split("\n")) {
  const m = line.match(/^([^#][^=]*)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Adding columns to practice_areas table using tagged templates...");

  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_eyebrow VARCHAR(200);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_heading VARCHAR(400);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_description TEXT;`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_image_url VARCHAR(1000);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_image_alt VARCHAR(300);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_cta1_text VARCHAR(100);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_cta1_href VARCHAR(500);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_cta2_text VARCHAR(100);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS hero_cta2_href VARCHAR(500);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS overview_heading VARCHAR(400);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS overview_quote TEXT;`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS overview_body TEXT;`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS overview_body2 TEXT;`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS overview_image_url VARCHAR(1000);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS overview_image_alt VARCHAR(300);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS capabilities_heading VARCHAR(400);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS capabilities_intro TEXT;`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS services_heading VARCHAR(400);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS services_intro TEXT;`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS final_cta_heading VARCHAR(400);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS final_cta_description TEXT;`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS final_cta1_text VARCHAR(100);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS final_cta1_href VARCHAR(500);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS final_cta2_text VARCHAR(100);`;
  await sql`ALTER TABLE practice_areas ADD COLUMN IF NOT EXISTS final_cta2_href VARCHAR(500);`;

  console.log("Creating practice_area_capabilities table...");
  await sql`
    CREATE TABLE IF NOT EXISTS practice_area_capabilities (
      id SERIAL PRIMARY KEY,
      practice_area_id INTEGER NOT NULL REFERENCES practice_areas(id) ON DELETE CASCADE,
      title VARCHAR(300) NOT NULL,
      description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_visible BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  console.log("Creating practice_area_experts table...");
  await sql`
    CREATE TABLE IF NOT EXISTS practice_area_experts (
      id SERIAL PRIMARY KEY,
      practice_area_id INTEGER NOT NULL REFERENCES practice_areas(id) ON DELETE CASCADE,
      team_member_id INTEGER NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT unique_pa_expert UNIQUE (practice_area_id, team_member_id)
    );
  `;

  console.log("Creating practice_area_insights table...");
  await sql`
    CREATE TABLE IF NOT EXISTS practice_area_insights (
      id SERIAL PRIMARY KEY,
      practice_area_id INTEGER NOT NULL REFERENCES practice_areas(id) ON DELETE CASCADE,
      article_id INTEGER NOT NULL REFERENCES insights_articles(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      CONSTRAINT unique_pa_insight UNIQUE (practice_area_id, article_id)
    );
  `;

  console.log("Migration finished cleanly!");
}

migrate().catch((e) => {
  console.error("Migration error:", e.message || e);
  process.exit(1);
});
