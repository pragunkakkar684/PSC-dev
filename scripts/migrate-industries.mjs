import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf8");
for (const line of envFile.split("\n")) {
  const m = line.match(/^([^#][^=]*)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log("Running DDL for Industries CMS...");

  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_eyebrow VARCHAR(200)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_heading VARCHAR(400)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_description TEXT`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_image_url VARCHAR(1000)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_image_alt VARCHAR(300)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_cta1_text VARCHAR(100)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_cta1_href VARCHAR(500)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_cta2_text VARCHAR(100)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS hero_cta2_href VARCHAR(500)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS overview_heading VARCHAR(400)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS overview_quote TEXT`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS overview_body TEXT`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS overview_body2 TEXT`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS challenges_intro TEXT`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS solutions_heading VARCHAR(400)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS solutions_intro TEXT`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS final_cta_heading VARCHAR(400)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS final_cta_description TEXT`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS final_cta1_text VARCHAR(100)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS final_cta1_href VARCHAR(500)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS final_cta2_text VARCHAR(100)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS final_cta2_href VARCHAR(500)`;
  console.log("  industries columns added");

  await sql`CREATE TABLE IF NOT EXISTS industry_challenges (id SERIAL PRIMARY KEY, industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE CASCADE, number VARCHAR(10) NOT NULL DEFAULT '01.', title VARCHAR(300) NOT NULL, description TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_visible BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS industry_solutions (id SERIAL PRIMARY KEY, industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE CASCADE, label VARCHAR(200) NOT NULL, description TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_visible BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS industry_practice_areas (id SERIAL PRIMARY KEY, industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE CASCADE, practice_area_id INTEGER NOT NULL REFERENCES practice_areas(id) ON DELETE CASCADE, sort_order INTEGER NOT NULL DEFAULT 0, UNIQUE(industry_id, practice_area_id))`;
  await sql`CREATE TABLE IF NOT EXISTS industry_experts (id SERIAL PRIMARY KEY, industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE CASCADE, team_member_id INTEGER NOT NULL REFERENCES team_members(id) ON DELETE CASCADE, sort_order INTEGER NOT NULL DEFAULT 0, UNIQUE(industry_id, team_member_id))`;
  await sql`CREATE TABLE IF NOT EXISTS industry_insights (id SERIAL PRIMARY KEY, industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE CASCADE, article_id INTEGER NOT NULL REFERENCES insights_articles(id) ON DELETE CASCADE, sort_order INTEGER NOT NULL DEFAULT 0, UNIQUE(industry_id, article_id))`;
  await sql`CREATE TABLE IF NOT EXISTS industry_shared_challenges (id SERIAL PRIMARY KEY, title VARCHAR(300) NOT NULL, description TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_visible BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS regulatory_updates (id SERIAL PRIMARY KEY, authority VARCHAR(200) NOT NULL, date VARCHAR(100) NOT NULL, title VARCHAR(500) NOT NULL, description TEXT, link VARCHAR(1000), sort_order INTEGER NOT NULL DEFAULT 0, is_visible BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS key_judgements (id SERIAL PRIMARY KEY, court VARCHAR(300) NOT NULL, date VARCHAR(100) NOT NULL, title VARCHAR(500) NOT NULL, description TEXT, sort_order INTEGER NOT NULL DEFAULT 0, is_visible BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS research_resources (id SERIAL PRIMARY KEY, tag VARCHAR(100) NOT NULL, title VARCHAR(500) NOT NULL, description TEXT, file_url VARCHAR(1000), cta_url VARCHAR(1000) NOT NULL DEFAULT '/contact', sort_order INTEGER NOT NULL DEFAULT 0, is_visible BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMP NOT NULL DEFAULT NOW(), updated_at TIMESTAMP NOT NULL DEFAULT NOW())`;
  console.log("  All new tables created");

  await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS related_industry_id INTEGER REFERENCES industries(id) ON DELETE SET NULL`;
  await sql`ALTER TABLE insights_articles ADD COLUMN IF NOT EXISTS related_practice_area_id INTEGER REFERENCES practice_areas(id) ON DELETE SET NULL`;
  console.log("  insights_articles extended");

  const eps1 = await sql`SELECT id FROM site_pages WHERE slug='industries' LIMIT 1`;
  if (eps1.length === 0) await sql`INSERT INTO site_pages (slug,title,is_published) VALUES ('industries','Industries',true)`;
  const eps2 = await sql`SELECT id FROM site_pages WHERE slug='insights' LIMIT 1`;
  if (eps2.length === 0) await sql`INSERT INTO site_pages (slug,title,is_published) VALUES ('insights','Insights',true)`;

  console.log("DDL migration done!");
}

run().catch(e => { console.error(e.message || e); process.exit(1); });
