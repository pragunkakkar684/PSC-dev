import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
const envFile = readFileSync(".env.local", "utf8");
for (const line of envFile.split("\n")) { const m = line.match(/^([^#][^=]*)=(.*)$/); if (m) process.env[m[1].trim()] = m[2].trim(); }
const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log("Seeding shared lookup data...");

  // Shared challenges
  const sc = await sql`SELECT COUNT(*) as c FROM industry_shared_challenges`;
  if (Number(sc[0].c) === 0) {
    const items = ["Regulatory Compliance","Business Expansion","Corporate Governance","Operational Efficiency","Financial Reporting","Cross-border Growth","Risk Management","Technology Transformation"];
    for (let i=0;i<items.length;i++) await sql`INSERT INTO industry_shared_challenges (title,sort_order,is_visible) VALUES (${items[i]},${i},true)`;
    console.log("  8 shared challenges seeded");
  } else console.log("  shared challenges already exist");

  // Regulatory updates
  const ru = await sql`SELECT COUNT(*) as c FROM regulatory_updates`;
  if (Number(ru[0].c) === 0) {
    await sql`INSERT INTO regulatory_updates (authority,date,title,description,sort_order,is_visible) VALUES ('SEBI','Oct 12, 2024','Revised Disclosure Norms for FPIs.','Mandatory granular disclosure requirements introduced for Foreign Portfolio Investors meeting specific AUM thresholds to prevent circumvention of MPS norms.',0,true)`;
    await sql`INSERT INTO regulatory_updates (authority,date,title,description,sort_order,is_visible) VALUES ('INCOME TAX','Oct 08, 2024','Notification on Angel Tax Exemption.','CBDT issues final rules outlining valuation methodologies and recognized investor categories eligible for exemption under Section 56(2)(viib).',1,true)`;
    await sql`INSERT INTO regulatory_updates (authority,date,title,description,sort_order,is_visible) VALUES ('GST','Oct 01, 2024','Clarification on Corporate Guarantees.','GST Council clarifies the valuation mechanism for corporate guarantees provided by holding companies to subsidiaries, setting a safe harbor rate.',2,true)`;
    await sql`INSERT INTO regulatory_updates (authority,date,title,description,sort_order,is_visible) VALUES ('FEMA','Sep 28, 2024','Overseas Investment Rules Updated.','RBI introduces streamlined reporting procedures for Overseas Direct Investments, consolidating multiple forms into a unified filing system.',3,true)`;
    console.log("  4 regulatory updates seeded");
  } else console.log("  regulatory updates already exist");

  // Key judgements
  const kj = await sql`SELECT COUNT(*) as c FROM key_judgements`;
  if (Number(kj[0].c) === 0) {
    await sql`INSERT INTO key_judgements (court,date,title,description,sort_order,is_visible) VALUES ('SUPREME COURT OF INDIA','Oct 20, 2024','Ruling on Input Tax Credit Eligibility.','The court clarified the nexus required between input services and outward supplies for claiming ITC under specific GST provisions, providing significant relief to the manufacturing sector.',0,true)`;
    await sql`INSERT INTO key_judgements (court,date,title,description,sort_order,is_visible) VALUES ('HIGH COURT OF DELHI','Oct 15, 2024','Interpretation of Permanent Establishment.','A landmark judgement defining the scope of virtual presence in determining PE status for multinational digital service providers under the DTAA.',1,true)`;
    await sql`INSERT INTO key_judgements (court,date,title,description,sort_order,is_visible) VALUES ('NCLAT','Oct 08, 2024','Resolution Plan Approval Standards.','The tribunal reinforced the commercial wisdom of the Committee of Creditors while emphasizing the need for equitable treatment of operational creditors.',2,true)`;
    console.log("  3 key judgements seeded");
  } else console.log("  key judgements already exist");

  // Research resources
  const rr = await sql`SELECT COUNT(*) as c FROM research_resources`;
  if (Number(rr[0].c) === 0) {
    await sql`INSERT INTO research_resources (tag,title,description,cta_url,sort_order,is_visible) VALUES ('HANDBOOK','2024 Global Tax Handbook','A comprehensive guide to navigating international tax compliance across 40+ jurisdictions.','/contact',0,true)`;
    await sql`INSERT INTO research_resources (tag,title,description,cta_url,sort_order,is_visible) VALUES ('COMPLIANCE GUIDE','M&A Compliance Guide','Essential regulatory checklists for cross-border mergers and acquisitions in the current year.','/contact',1,true)`;
    await sql`INSERT INTO research_resources (tag,title,description,cta_url,sort_order,is_visible) VALUES ('WHITEPAPER','ESG Reporting Frameworks','Analyzing the shift from voluntary to mandatory sustainability disclosures for listed entities.','/contact',2,true)`;
    await sql`INSERT INTO research_resources (tag,title,description,cta_url,sort_order,is_visible) VALUES ('MARKET REPORT','Q3 Economic Outlook','Strategic insights into market volatility and interest rate projections for the upcoming quarter.','/contact',3,true)`;
    console.log("  4 research resources seeded");
  } else console.log("  research resources already exist");

  console.log("Shared data seeded!");
}
run().catch(e => { console.error(e.message || e); process.exit(1); });
