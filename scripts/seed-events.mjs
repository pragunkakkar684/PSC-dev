import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";

const envFile = readFileSync(".env.local", "utf8");
for (const line of envFile.split("\n")) {
  const m = line.match(/^([^#][^=]*)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const sql = neon(process.env.DATABASE_URL);

const evList = [
  {
    slug: "navigating-indias-changing-regulatory-landscape",
    title: "The 2025 Global Capital Flows & Regulatory Outlook",
    description: "An executive briefing on anticipated shifts in cross-border investment strategies, emerging regulatory frameworks in key jurisdictions, and strategies for capital preservation in a volatile macroeconomic environment.",
    eventType: "WEBINAR",
    status: "upcoming",
    isFeatured: true,
    isHighlighted: true,
    date: "2025-10-24",
    timeStart: "10:00:00",
    timeEnd: "12:00:00",
    timezone: "EST",
    location: "Microsoft Teams",
    platform: "Virtual Event",
    durationLabel: "2 HOURS",
    registrationUrl: "/contact",
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=1200&q=85",
    agenda: [
      { timeLabel: "10:00 AM", title: "Opening Remarks & Macroeconomic Context", description: "Global trade overview and key macroeconomic indicators setting." },
      { timeLabel: "10:15 AM", title: "Cross-Border Regulatory Updates", description: "Deep dive into compliance shifts across North American and European corridors." },
      { timeLabel: "10:45 AM", title: "Capital Structuring & Asset Resilience", description: "Strategies for preserving balance sheet value during interest rate volatility." },
      { timeLabel: "11:15 AM", title: "Executive Panel Discussion", description: "Managing multi-jurisdictional compliance friction." },
      { timeLabel: "11:45 AM", title: "Q&A Session & Concluding Counsel", description: "Direct Q&A with lead practice partners." }
    ]
  },
  {
    slug: "emerging-markets-southeast-asian-corridor",
    title: "Emerging Markets: The Southeast Asian Corridor",
    description: "Strategic entry points and risk mitigation for expansion into rapid-growth ASEAN economies.",
    eventType: "SEMINAR",
    status: "upcoming",
    isFeatured: false,
    isHighlighted: false,
    date: "2025-11-12",
    timeStart: "09:00:00",
    timeEnd: "11:00:00",
    timezone: "SGT",
    location: "Raffles City Convention Centre, Singapore",
    platform: "In-Person Briefing",
    durationLabel: "2 HOURS",
    registrationUrl: "/contact",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85",
    agenda: [
      { timeLabel: "09:00 AM", title: "Welcome & ASEAN Market Overview", description: "Macro trends across Singapore, Vietnam, and Indonesia." },
      { timeLabel: "09:45 AM", title: "Legal & Tax Structuring for Regional Hubs", description: "Optimizing holding structures for Southeast Asian operations." }
    ]
  },
  {
    slug: "data-privacy-global-compliance-architecture",
    title: "Data Privacy & Global Compliance Architecture",
    description: "Structuring multinational operations to adhere to fragmented data sovereignty laws.",
    eventType: "WEBINAR",
    status: "upcoming",
    isFeatured: false,
    isHighlighted: false,
    date: "2025-11-28",
    timeStart: "11:00:00",
    timeEnd: "12:30:00",
    timezone: "GMT",
    location: "Virtual Event Platform",
    platform: "Virtual Webinar",
    durationLabel: "90 MINS",
    registrationUrl: "/contact",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    agenda: [
      { timeLabel: "11:00 AM", title: "Global Data Protection Landscape", description: "Reconciling GDPR, CCPA, and emerging Asian data privacy statutes." }
    ]
  },
  {
    slug: "cross-border-tax-strategies-2025",
    title: "Cross-Border Tax Strategies for 2025",
    description: "Navigating BEPS 2.0 implementation and optimization strategies for corporate treasuries.",
    eventType: "ROUNDTABLE",
    status: "upcoming",
    isFeatured: false,
    isHighlighted: false,
    date: "2025-12-05",
    timeStart: "14:00:00",
    timeEnd: "17:00:00",
    timezone: "GMT",
    location: "1 Cornhill Executive Briefing Suite, London",
    platform: "Executive Roundtable",
    durationLabel: "3 HOURS",
    registrationUrl: "/contact",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85",
    agenda: [
      { timeLabel: "02:00 PM", title: "Pillar Two Implementation Briefing", description: "Calculating top-up tax and managing OECD reporting standards." }
    ]
  }
];

async function seed() {
  console.log("Seeding Events and Agenda Items...");

  for (const ev of evList) {
    const existing = await sql`SELECT id FROM events WHERE slug=${ev.slug} LIMIT 1`;
    let id;
    if (existing.length > 0) {
      id = existing[0].id;
      await sql`
        UPDATE events SET
          title=${ev.title},
          description=${ev.description},
          event_type=${ev.eventType},
          status=${ev.status},
          is_featured=${ev.isFeatured},
          is_highlighted=${ev.isHighlighted},
          date=${ev.date},
          time_start=${ev.timeStart},
          time_end=${ev.timeEnd},
          timezone=${ev.timezone},
          location=${ev.location},
          platform=${ev.platform},
          duration_label=${ev.durationLabel},
          registration_url=${ev.registrationUrl},
          image_url=${ev.imageUrl},
          is_published=true,
          updated_at=NOW()
        WHERE id=${id}
      `;
    } else {
      const [r] = await sql`
        INSERT INTO events (
          slug, title, description, event_type, status, is_featured, is_highlighted, date, time_start, time_end, timezone, location, platform, duration_label, registration_url, image_url, is_published
        ) VALUES (
          ${ev.slug}, ${ev.title}, ${ev.description}, ${ev.eventType}, ${ev.status}, ${ev.isFeatured}, ${ev.isHighlighted}, ${ev.date}, ${ev.timeStart}, ${ev.timeEnd}, ${ev.timezone}, ${ev.location}, ${ev.platform}, ${ev.durationLabel}, ${ev.registrationUrl}, ${ev.imageUrl}, true
        ) RETURNING id
      `;
      id = r.id;
    }

    await sql`DELETE FROM event_agenda_items WHERE event_id=${id}`;
    for (let i = 0; i < ev.agenda.length; i++) {
      const a = ev.agenda[i];
      await sql`INSERT INTO event_agenda_items (event_id, time_label, title, description, sort_order) VALUES (${id}, ${a.timeLabel}, ${a.title}, ${a.description}, ${i})`;
    }

    console.log(`  seeded event: ${ev.title} (id=${id})`);
  }

  console.log("Events seeding complete!");
}

seed().catch(e => {
  console.error("Events seeding error:", e.message || e);
  process.exit(1);
});
