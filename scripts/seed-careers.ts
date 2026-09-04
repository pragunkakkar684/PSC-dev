import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function seedCareers() {
  console.log("Seeding initial job openings and questions...");

  await sql`
    INSERT INTO careers_positions (title, department, location, type, description, requirements, questions, is_published)
    VALUES 
    (
      'Senior International Tax Specialist',
      'Tax Advisory',
      'London, UK',
      'Full-time',
      'We are seeking an experienced Senior International Tax Specialist to advise multinational clients on cross-border tax structuring, transfer pricing, and compliance.',
      'CTA/ACA qualified with 5+ years of international tax advisory experience.',
      '[
        {"id": "q_1", "text": "Are you CTA or ACA qualified?", "type": "YES_NO", "required": true},
        {"id": "q_2", "text": "Do you have 5+ years of international tax advisory experience?", "type": "YES_NO", "required": true},
        {"id": "q_3", "text": "Briefly describe your experience with OECD Pillar Two transfer pricing rules.", "type": "TEXT", "required": false}
      ]'::jsonb,
      true
    ),
    (
      'Risk & Compliance Manager',
      'Risk Advisory',
      'London, UK',
      'Full-time',
      'Lead client engagements focused on regulatory compliance, internal controls, and enterprise risk management framework implementation.',
      '4+ years experience in corporate risk management and UK financial regulatory frameworks.',
      '[
        {"id": "q_1", "text": "Do you have experience managing FCA regulatory compliance reviews?", "type": "YES_NO", "required": true},
        {"id": "q_2", "text": "What is your current notice period?", "type": "TEXT", "required": true}
      ]'::jsonb,
      true
    );
  `;

  console.log("Seeding complete!");
}

seedCareers().catch((e) => {
  console.error("Seeding failed:", e);
  process.exit(1);
});
