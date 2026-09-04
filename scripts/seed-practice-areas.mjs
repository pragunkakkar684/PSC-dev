import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf8");
for (const line of envFile.split("\n")) {
  const m = line.match(/^([^#][^=]*)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const sql = neon(process.env.DATABASE_URL);

const paList = [
  {
    slug: "risk-assurance",
    name: "Risk & Assurance",
    number: "01.",
    sd: "Navigating regulatory scrutiny and strengthening governance frameworks.",
    he: "PRACTICE AREA",
    hh: "Risk & Governance Assurance",
    hd: "Comprehensive risk management, internal audit, and regulatory compliance architectures designed to protect institutional value across global jurisdictions.",
    hiu: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85",
    hia: "Risk governance team",
    hc1t: "SCHEDULE RISK AUDIT",
    hc1h: "/contact",
    hc2t: "VIEW CAPABILITIES",
    hc2h: "/practice-areas/risk-assurance#capabilities",
    oh: "Understanding Risk & Assurance",
    oq: "Governance is not about restricting movement — it is about establishing the structural integrity required to scale safely.",
    ob: "In an era of relentless regulatory evolution and systemic volatility, risk assurance is the fundamental cornerstone of enterprise longevity. Organizations must continuously align their internal controls with international compliance benchmarks.",
    ob2: "PSC Global partners with executive boards and audit committees to architect resilient risk governance frameworks, evaluate internal controls, and streamline multi-jurisdictional compliance protocols.",
    ch: "Strategic Capabilities in Risk & Governance",
    ci: "Targeted advisory services engineered to protect assets and satisfy institutional regulators.",
    sh: "Core Practice Services",
    si: "Our specialized practice capabilities span governance design, internal audit, and compliance automation.",
    fch: "Strengthen Your Governance Architecture.",
    fcd: "Connect with our senior risk partners to conduct a comprehensive audit of your global governance posture.",
    fc1t: "TALK TO RISK PRACTITIONERS",
    fc1h: "/contact",
    fc2t: "BOOK A CONSULTATION",
    fc2h: "/book-consultation",
    caps: [
      { t: "Regulatory Compliance Assurance", d: "Evaluating and aligning operating procedures with international regulatory frameworks including Basel III, MiFID II, and SOX." },
      { t: "Enterprise Risk Management (ERM)", d: "Designing tailored risk matrices that identify, quantify, and mitigate strategic, operational, and financial exposures." },
      { t: "Internal Audit & Controls Review", d: "Conducting independent internal audit evaluations to verify internal financial and operational control mechanisms." },
      { t: "Cybersecurity & Data Governance", d: "Establishing data privacy protocols and cybersecurity risk management frameworks aligned with GDPR and CCPA." }
    ],
    services: ["Governance Structure Audit", "Internal Financial Controls", "Regulatory Gap Analysis", "Crisis Management Protocols"]
  },
  {
    slug: "tax-fiscal-advisory",
    name: "Tax & Fiscal Advisory",
    number: "02.",
    sd: "Cross-border tax structuring and transfer pricing dispute resolution.",
    he: "PRACTICE AREA",
    hh: "International Tax & Policy Advisory",
    hd: "Bespoke international tax structuring, OECD BEPS compliance, and transfer pricing dispute resolution for multinational corporations.",
    hiu: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85",
    hia: "Tax advisory consultation",
    hc1t: "TALK TO TAX ADVISORS",
    hc1h: "/contact",
    hc2t: "EXPLORE TAX SERVICES",
    hc2h: "/practice-areas/tax-fiscal-advisory#capabilities",
    oh: "Understanding International Tax Policy",
    oq: "Effective tax advisory balances rigorous technical compliance with long-term capital efficiency.",
    ob: "Global tax reform and the implementation of Pillar Two frameworks have fundamentally altered cross-border capital deployment. Corporations require strategic tax counsel that harmonizes local reporting with global holding structures.",
    ob2: "Our tax practice provides applied guidance on transfer pricing policy, cross-border M&A tax structuring, indirect tax optimization, and representation before revenue authorities.",
    ch: "Strategic Capabilities in Tax & Fiscal Policy",
    ci: "Technical tax advisory addressing multi-jurisdictional tax law and international compliance standards.",
    sh: "Core Practice Services",
    si: "Specialized tax capabilities tailored for high-growth enterprises and global holding groups.",
    fch: "Optimize Your Cross-Border Tax Architecture.",
    fcd: "Schedule a confidential briefing with our international tax partners to review your cross-border fiscal position.",
    fc1t: "TALK TO TAX ADVISORS",
    fc1h: "/contact",
    fc2t: "BOOK A CONSULTATION",
    fc2h: "/book-consultation",
    caps: [
      { t: "Cross-Border M&A Tax Structuring", d: "Architecting tax-efficient acquisition and divestiture structures for multi-jurisdictional transactions." },
      { t: "Transfer Pricing Documentation & Defence", d: "Preparing robust Master File / Local File documentation and defending transfer pricing policies during audits." },
      { t: "OECD Pillar Two & Global Minimum Tax", d: "Assessing enterprise exposure to top-up tax rules and modeling tax liability across holding jurisdictions." },
      { t: "Indirect Tax & Value-Added Tax (VAT)", d: "Optimizing cross-border supply chain indirect tax structures and managing customs compliance." }
    ],
    services: ["Transfer Pricing Advisory", "M&A Fiscal Due Diligence", "Pillar Two Impact Analysis", "Tax Dispute Resolution"]
  },
  {
    slug: "corporate-law",
    name: "Corporate Law",
    number: "03.",
    sd: "Cross-border entity structuring, governance, and transactional counsel.",
    he: "PRACTICE AREA",
    hh: "Corporate Law & Transaction Counsel",
    hd: "Strategic legal counsel for cross-border mergers and acquisitions, joint ventures, shareholder agreements, and corporate governance.",
    hiu: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85",
    hia: "Corporate legal counsel",
    hc1t: "CONSULT LEGAL COUNSEL",
    hc1h: "/contact",
    hc2t: "VIEW LEGAL CAPABILITIES",
    hc2h: "/practice-areas/corporate-law#capabilities",
    oh: "Understanding Corporate Law & Structuring",
    oq: "Legal frameworks must provide clarity during rapid expansion and protection during market turbulence.",
    ob: "Navigating corporate law across emerging and developed markets demands high-level strategic alignment between commercial objectives and regulatory boundaries.",
    ob2: "Our corporate practice represents multinational corporations, sovereign wealth funds, and private equity sponsors in structuring holding frameworks, negotiating joint ventures, and enforcing governance protocols.",
    ch: "Strategic Capabilities in Corporate Law",
    ci: "Full-spectrum transactional counsel and legal governance architectures.",
    sh: "Core Practice Services",
    si: "Comprehensive legal advisory across corporate life cycles.",
    fch: "Architect Your Enterprise Legal Structure.",
    fcd: "Connect with our senior corporate attorneys to review your transactional and governance frameworks.",
    fc1t: "TALK TO CORPORATE ATTORNEYS",
    fc1h: "/contact",
    fc2t: "BOOK A CONSULTATION",
    fc2h: "/book-consultation",
    caps: [
      { t: "Mergers & Acquisitions Legal Counsel", d: "Structuring and negotiating share sales, asset purchases, and joint venture agreements." },
      { t: "Corporate Governance & Board Advisory", d: "Advising executive boards on fiduciary duty compliance, conflict management, and regulatory disclosures." },
      { t: "Cross-Border Entity Formation", d: "Establishing tax-efficient entity presence across European, Asian, and CC Capital jurisdictions." },
      { t: "Commercial Contract Structuring", d: "Drafting high-value commercial supply, distribution, licensing, and partnership agreements." }
    ],
    services: ["Cross-Border M&A Legal Structuring", "Board Governance Frameworks", "Shareholder Agreements", "Regulatory Filings & Entity Maintenance"]
  },
  {
    slug: "business-advisory",
    name: "Business Advisory",
    number: "04.",
    sd: "Strategic capital deployment, operational transformation, and market entry.",
    he: "PRACTICE AREA",
    hh: "Strategic Business Advisory",
    hd: "End-to-end strategic advisory guiding executive leadership through international market expansion, capital allocation, and operational transformation.",
    hiu: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
    hia: "Business strategy session",
    hc1t: "TALK TO STRATEGY ADVISORS",
    hc1h: "/contact",
    hc2t: "VIEW STRATEGY CAPABILITIES",
    hc2h: "/practice-areas/business-advisory#capabilities",
    oh: "Understanding Strategic Business Transformation",
    oq: "Sustainable competitive advantage is built on disciplined capital allocation and operational execution.",
    ob: "Rapid market shifts require leadership teams to continuously evaluate their business models, optimize cost structures, and capture new geographic markets.",
    ob2: "PSC Global provides data-driven strategic counsel that aligns growth initiatives with capital capacity and risk governance.",
    ch: "Strategic Capabilities in Business Strategy",
    ci: "Actionable strategic frameworks designed for high-growth enterprises.",
    sh: "Core Practice Services",
    si: "Tailored strategic support across capital strategy and operational execution.",
    fch: "Accelerate Your International Growth Strategy.",
    fcd: "Schedule a strategic briefing with our business advisory partners.",
    fc1t: "TALK TO STRATEGY ADVISORS",
    fc1h: "/contact",
    fc2t: "BOOK A CONSULTATION",
    fc2h: "/book-consultation",
    caps: [
      { t: "International Market Entry Strategy", d: "Evaluating macroeconomic indicators, regulatory barriers, and competitive positioning for new market expansion." },
      { t: "Capital Structure & Restructuring", d: "Optimizing corporate capital structures to lower cost of capital and support long-term growth." },
      { t: "Operational Performance Optimization", d: "Identifying operational bottlenecks and streamlining cost structures to maximize EBITDA margins." },
      { t: "Post-Merger Integration (PMI)", d: "Managing post-acquisition operational, cultural, and system integrations to realize deal synergies." }
    ],
    services: ["Market Entry Feasibility Studies", "Capital Structure Optimization", "Operational Turnarounds", "Post-Merger Integration"]
  },
  {
    slug: "business-process-advisory",
    name: "Business Process Advisory",
    number: "05.",
    sd: "Digital process modernization, workflow automation, and shared services.",
    he: "PRACTICE AREA",
    hh: "Business Process & Shared Services Advisory",
    hd: "Modernizing operational workflows, establishing Global Capability Centers (CC Capitals), and driving process automation across enterprise functions.",
    hiu: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",
    hia: "Business process automation",
    hc1t: "TALK TO PROCESS EXPERTS",
    hc1h: "/contact",
    hc2t: "VIEW PROCESS CAPABILITIES",
    hc2h: "/practice-areas/business-process-advisory#capabilities",
    oh: "Understanding Business Process Transformation",
    oq: "Operational excellence requires converting complex legacy procedures into streamlined, scalable digital workflows.",
    ob: "Global enterprises face mounting pressure to reduce back-office friction and elevate operational efficiency. Establishing shared service centers and automating repetitive processes provides the foundation for scalable growth.",
    ob2: "Our practice partners with Chief Operating Officers to design, deploy, and govern Global Capability Centers and process automation systems.",
    ch: "Strategic Capabilities in Process Advisory",
    ci: "Applied operational design frameworks engineered for scale and speed.",
    sh: "Core Practice Services",
    si: "Comprehensive process modernization and shared services capabilities.",
    fch: "Optimize Your Operational Workflows.",
    fcd: "Connect with our process advisory team to blueprint your shared services architecture.",
    fc1t: "TALK TO PROCESS EXPERTS",
    fc1h: "/contact",
    fc2t: "BOOK A CONSULTATION",
    fc2h: "/book-consultation",
    caps: [
      { t: "Global Capability Center (CC Capital) Design", d: "End-to-end design, site selection, legal setup, and talent onboarding for offshore capability centers." },
      { t: "Robotic Process Automation (RPA)", d: "Deploying enterprise automation tools to eliminate manual data handling and reduce operational error rates." },
      { t: "Workflow Re-Engineering", d: "Mapping and redesigning core finance, HR, and procurement workflows for maximum speed and visibility." },
      { t: "Shared Services Governance", d: "Establishing Service Level Agreements (SLAs) and KPI dashboards to monitor shared service performance." }
    ],
    services: ["CC Capital Setup & Advisory", "Workflow Automation & RPA", "Shared Services SLA Design", "Back-Office Restructuring"]
  }
];

async function seed() {
  console.log("Seeding Practice Areas full content...");

  for (const pa of paList) {
    const existing = await sql`SELECT id FROM practice_areas WHERE slug=${pa.slug} LIMIT 1`;
    let id;
    if (existing.length > 0) {
      id = existing[0].id;
      await sql`
        UPDATE practice_areas SET
          name=${pa.name},
          number=${pa.number},
          short_description=${pa.sd},
          hero_eyebrow=${pa.he},
          hero_heading=${pa.hh},
          hero_description=${pa.hd},
          hero_image_url=${pa.hiu},
          hero_image_alt=${pa.hia},
          hero_cta1_text=${pa.hc1t},
          hero_cta1_href=${pa.hc1h},
          hero_cta2_text=${pa.hc2t},
          hero_cta2_href=${pa.hc2h},
          overview_heading=${pa.oh},
          overview_quote=${pa.oq},
          overview_body=${pa.ob},
          overview_body2=${pa.ob2},
          capabilities_heading=${pa.ch},
          capabilities_intro=${pa.ci},
          services_heading=${pa.sh},
          services_intro=${pa.si},
          final_cta_heading=${pa.fch},
          final_cta_description=${pa.fcd},
          final_cta1_text=${pa.fc1t},
          final_cta1_href=${pa.fc1h},
          final_cta2_text=${pa.fc2t},
          final_cta2_href=${pa.fc2h},
          is_published=true,
          updated_at=NOW()
        WHERE id=${id}
      `;
    } else {
      const [r] = await sql`
        INSERT INTO practice_areas (
          slug, name, number, short_description, hero_eyebrow, hero_heading, hero_description, hero_image_url, hero_image_alt, hero_cta1_text, hero_cta1_href, hero_cta2_text, hero_cta2_href, overview_heading, overview_quote, overview_body, overview_body2, capabilities_heading, capabilities_intro, services_heading, services_intro, final_cta_heading, final_cta_description, final_cta1_text, final_cta1_href, final_cta2_text, final_cta2_href, is_published
        ) VALUES (
          ${pa.slug}, ${pa.name}, ${pa.number}, ${pa.sd}, ${pa.he}, ${pa.hh}, ${pa.hd}, ${pa.hiu}, ${pa.hia}, ${pa.hc1t}, ${pa.hc1h}, ${pa.hc2t}, ${pa.hc2h}, ${pa.oh}, ${pa.oq}, ${pa.ob}, ${pa.ob2}, ${pa.ch}, ${pa.ci}, ${pa.sh}, ${pa.si}, ${pa.fch}, ${pa.fcd}, ${pa.fc1t}, ${pa.fc1h}, ${pa.fc2t}, ${pa.fc2h}, true
        ) RETURNING id
      `;
      id = r.id;
    }

    // Seed capabilities
    await sql`DELETE FROM practice_area_capabilities WHERE practice_area_id=${id}`;
    for (let i = 0; i < pa.caps.length; i++) {
      const c = pa.caps[i];
      await sql`INSERT INTO practice_area_capabilities (practice_area_id, title, description, sort_order, is_visible) VALUES (${id}, ${c.t}, ${c.d}, ${i}, true)`;
    }

    // Seed services
    await sql`DELETE FROM practice_area_services WHERE practice_area_id=${id}`;
    for (let i = 0; i < pa.services.length; i++) {
      await sql`INSERT INTO practice_area_services (practice_area_id, name, sort_order) VALUES (${id}, ${pa.services[i]}, ${i})`;
    }

    console.log(`  seeded practice area: ${pa.name} (id=${id})`);
  }

  console.log("Practice Areas seeding complete!");
}

seed().catch(e => {
  console.error("Seeding error:", e.message || e);
  process.exit(1);
});
