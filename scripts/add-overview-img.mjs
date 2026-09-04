import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
const envFile = readFileSync(".env.local", "utf8");
for (const line of envFile.split("\n")) { const m = line.match(/^([^#][^=]*)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); }
const sql = neon(process.env.DATABASE_URL);

async function run() {
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS overview_image_url VARCHAR(1000)`;
  await sql`ALTER TABLE industries ADD COLUMN IF NOT EXISTS overview_image_alt VARCHAR(300)`;
  console.log("Added overview_image columns");
}
run().catch(e => { console.error(e.message || e); process.exit(1); });
