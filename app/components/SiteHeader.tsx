'use client';

import { ArrowRight, Menu, X, Globe2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const ABOUT_LINKS = [
  "Company Overview",
  "Our Story",
  "Leadership",
  "Why PSC",
  "Global Presence",
  "Awards & Recognitions",
  "Memberships & Certifications",
  "Careers",
];

const TEAM_LINKS = ["Leadership", "Partners", "Mentors"];

const PRACTICE_COLUMNS = [
  {
    title: "Risk & Assurance",
    items: ["Internal Audit", "IT Risk Advisory", "Regulatory Compliance", "Sustainability Assurance"],
  },
  {
    title: "Tax & Fiscal Advisory",
    items: ["Corporate Tax Strategy", "International Tax", "Transfer Pricing", "Indirect Tax & VAT"],
  },
  {
    title: "Corporate Law",
    items: ["M&A Transactions", "Intellectual Property", "Employment Law", "Entity Governance"],
  },
  {
    title: "Business Advisory",
    items: ["Strategy Consulting", "Digital Transformation", "Crisis Management", "Market Entry"],
  },
  {
    title: "Business Process",
    items: ["Lean Operations", "Supply Chain Optimization", "Change Management", "Workflow Automation"],
  },
];

const INDUSTRY_COLUMNS = [
  ["Manufacturing", "Infrastructure", "Real Estate", "Aviation"],
  ["Energy", "Banking & Financial Services", "Healthcare", "NGOs"],
  ["Technology", "E-Commerce", "Media", "Startups"],
];

const INSIGHTS_COLUMNS = [
  ["Upcoming Events", "Webinars", "Seminars"],
  ["Conferences", "Event Recordings", "Event Gallery"],
];

const NAV = [
  { label: "About", key: "about", type: "narrow", href: "/about" },
  { label: "Our Team", key: "team", type: "full", href: "/team" },
  { label: "Practice Areas", key: "practice", type: "full", href: "/practice-areas" },
  { label: "Industries", key: "industries", type: "full", href: "/industries" },
  { label: "Insights", key: "insights", type: "full", href: "/insights" },
  { label: "Events", key: null, href: "/events" },
  { label: "Contact", key: null, href: "/contact" },
  { label: "Client Portal", key: null, href: "/client-portal" },
];

// Where the "Book Consultation" button in the header sends people.
const BOOK_CONSULTATION_HREF = "/book-consultation";

const ABOUT_HREFS: Record<string, string> = {
  "Company Overview": "/about",
  "Our Story": "/about",
  Leadership: "/team#leadership",
  "Why PSC": "/about",
  "Global Presence": "/about#offices",
  "Awards & Recognitions": "/about",
  "Memberships & Certifications": "/about",
  Careers: "/career",
};

const TEAM_HREFS: Record<string, string> = {
  Leadership: "/team#leadership",
  Partners: "/partner",
  Mentors: "/team",
};

const PRACTICE_HREFS: Record<string, string> = {
  "Risk & Assurance": "/practice-areas/risk-assurance",
  "Tax & Fiscal Advisory": "/practice-areas/tax-fiscal-advisory",
  "Corporate Law": "/practice-areas/corporate-law",
  "Business Advisory": "/practice-areas/business-advisory",
  "Business Process": "/practice-areas/business-process-advisory",
};

const INDUSTRY_HREFS: Record<string, string> = {
  Manufacturing: "/industries/manufacturing",
  Infrastructure: "/industries/infrastructure",
  "Real Estate": "/industries/real-estate",
  Aviation: "/industries/aviation",
  Energy: "/industries/energy",
  "Banking & Financial Services": "/industries/banking-finance",
  Healthcare: "/industries/healthcare",
  NGOs: "/industries/ngos",
  Technology: "/industries/technology",
  "E-Commerce": "/industries/e-commerce",
  Media: "/industries/media",
  Startups: "/industries/startups",
};

const INSIGHTS_HREFS: Record<string, string> = {
  "Upcoming Events": "/events",
  Webinars: "/events#upcoming",
  Seminars: "/events#upcoming",
  Conferences: "/events#upcoming",
  "Event Recordings": "/events",
  "Event Gallery": "/events",
};

export default function SiteHeader() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const activeLabel = NAV.find((item) =>
    item.href === pathname || pathname.startsWith(`${item.href}/`)
  )?.label;

  const activeNav = NAV.find((n) => n.key === active);

  return (
    <div className="psc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

        .psc-root {
          --ink: #12203f;
          --ink-soft: #1c3153;
          --nav-text: #3d5c7c;
          --nav-text-dim: #6c85a1;
          --eyebrow: #4c7ea3;
          --cream: #fbf7f1;
          --cream-2: #f6f1e9;
          --line: #e7e0d3;
          --steel: #3c5972;
          --gcc-bg: #eaf1f8;
          font-family: 'Plus Jakarta Sans', Arial, sans-serif;
          color: var(--ink);
          background: var(--cream);
          position: relative;
        }
        .psc-serif { font-family: 'Playfair Display', Georgia, serif; }

        .psc-header {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 32px;
          height: 88px;
          padding: 0 48px;
          background: #ffffff;
          border-bottom: 1px solid var(--line);
        }
        .psc-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 26px;
          line-height: 0.86;
          letter-spacing: -0.01em;
          color: var(--ink);
          text-decoration: none;
        }
        .psc-logo span { display: block; }

        .psc-nav {
          display: flex;
          align-items: center;
          gap: 28px;
          margin: 0 auto;
        }
        .psc-nav a {
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--nav-text);
          text-decoration: none;
          padding: 4px 0;
          border-bottom: 2px solid transparent;
          white-space: nowrap;
          transition: color .15s ease, border-color .15s ease;
        }
        .psc-nav a:hover {
          color: var(--ink);
          border-bottom-color: var(--ink);
        }
        .psc-nav a.is-active {
          color: var(--ink);
          font-weight: 700;
          border-bottom-color: var(--ink);
        }

        .psc-cta {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          background: var(--ink);
          text-align: center;
          line-height: 1.5;
          padding: 14px 26px;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .psc-burger {
          display: none;
          background: none;
          border: none;
          color: var(--ink);
          margin-left: auto;
        }

        /* ---- mega menu shell ---- */
        .psc-menu-wrap {
          position: absolute;
          left: 0;
          right: 0;
          top: 88px;
          z-index: 40;
          display: flex;
          justify-content: center;
        }
        .psc-menu-narrow {
          width: 460px;
          margin-left: 48px;
          margin-right: auto;
          background: #fff;
          border: 1px solid var(--line);
          box-shadow: 0 24px 48px -12px rgba(18,32,63,0.18);
          padding: 32px;
        }
        .psc-menu-full {
          width: 100%;
          background: #fff;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          box-shadow: 0 24px 48px -18px rgba(18,32,63,0.14);
          padding: 40px 48px 44px;
        }

        .psc-team-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          align-items: start;
        }
        .psc-team-photo {
          position: relative;
          overflow: hidden;
          height: 340px;
        }
        .psc-team-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .psc-team-caption {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: #fff;
          padding: 8px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
        }

        .psc-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--eyebrow);
          margin: 0 0 10px;
        }
        .psc-menu-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          margin: 0 0 12px;
        }
        .psc-menu-desc {
          font-size: 13.5px;
          line-height: 1.55;
          color: #55647c;
          margin: 0 0 20px;
          max-width: 320px;
        }

        .psc-link-list { display: flex; flex-direction: column; }
        .psc-link-list a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid var(--line);
          font-size: 14px;
          color: var(--ink-soft);
          text-decoration: none;
          transition: color .15s ease, transform .15s ease;
        }
        .psc-link-list a:hover { color: var(--eyebrow); transform: translateX(2px); }
        .psc-link-list a svg { opacity: 0; transition: opacity .15s ease; flex-shrink: 0; }
        .psc-link-list a:hover svg { opacity: 1; }

        .psc-explore {
          margin-top: 20px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          text-decoration: none;
        }
        .psc-explore:hover { text-decoration: underline; }

        /* full menu layout helpers */
        .psc-full-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 56px;
        }
        .psc-cols {
          display: grid;
          gap: 32px;
          flex: 1;
        }
        .psc-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .psc-cols-5 { grid-template-columns: repeat(5, 1fr); }
        .psc-col-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 17px;
          margin: 0 0 14px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--line);
        }
        .psc-col-list { display: flex; flex-direction: column; gap: 12px; }
        .psc-col-list a {
          font-size: 13.5px;
          color: var(--ink-soft);
          text-decoration: none;
        }
        .psc-col-list a:hover { color: var(--eyebrow); }

        .psc-gcc-banner {
          margin-top: 28px;
          display: flex;
          align-items: center;
          gap: 18px;
          background: var(--gcc-bg);
          padding: 20px 26px;
        }
        .psc-gcc-icon {
          width: 34px; height: 34px;
          border-radius: 999px;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          color: var(--ink);
          flex-shrink: 0;
        }
        .psc-gcc-banner strong {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }
        .psc-gcc-banner p { font-size: 13px; color: #55647c; margin: 0; max-width: 480px; }
        .psc-gcc-link {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
          text-decoration: underline;
          white-space: nowrap;
          margin-left: auto;
        }
        .psc-gcc-view {
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          text-decoration: none;
          white-space: nowrap;
          display: inline-flex; align-items: center; gap: 6px;
        }

        .psc-spotlight {
          background: transparent;
          padding-left: 40px;
          border-left: 1px solid var(--line);
        }
        .psc-spotlight .psc-eyebrow { color: var(--eyebrow); }
        .psc-spotlight-date { font-size: 13px; color: #55647c; margin-bottom: 10px; }
        .psc-spotlight-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          line-height: 1.25;
          margin: 0 0 18px;
        }
        .psc-spotlight a.reg {
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          text-decoration: none;
          display: inline-flex; gap: 6px; align-items: center;
        }
        .psc-spotlight a.view {
          display: block;
          margin-top: 22px;
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
          text-decoration: none;
        }

        @media (max-width: 1024px) {
          .psc-nav { display: none; }
          .psc-cta { display: none; }
          .psc-burger { display: block; }
          .psc-menu-wrap { position: static; }
          .psc-header { padding: 0 24px; }
          .psc-menu-full { padding: 28px 24px 32px; }
          .psc-team-grid,
          .psc-full-grid { grid-template-columns: 1fr; gap: 28px; }
          .psc-team-photo { height: 260px; }
          .psc-cols-5 { grid-template-columns: repeat(2, 1fr); }
          .psc-gcc-banner { flex-wrap: wrap; }
          .psc-gcc-link,
          .psc-gcc-view { margin-left: 0; }
        }
        @media (max-width: 640px) {
          .psc-header { height: 72px; padding: 0 18px; }
          .psc-logo { font-size: 22px; }
          .psc-mobile-menu { top: 72px !important; padding: 18px !important; }
          .psc-menu-narrow { width: 100%; margin: 0; padding: 24px 18px; }
          .psc-menu-full { padding: 24px 18px 28px; }
          .psc-cols-3,
          .psc-cols-5,
          .psc-cols { grid-template-columns: 1fr; gap: 20px; }
          .psc-gcc-banner { align-items: flex-start; padding: 18px; }
          .psc-gcc-banner p { max-width: none; }
          .psc-spotlight { padding-left: 0; padding-top: 24px; border-left: 0; border-top: 1px solid var(--line); }
          .psc-menu-wrap { top: 72px; }
        }
      `}</style>

      <header
        className="psc-header"
        onMouseLeave={() => setActive(null)}
      >
        <Link href="/" className="psc-logo">
          <span>PSC</span>
          <span>Global</span>
        </Link>

        <button className="psc-burger" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle navigation">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className="psc-nav">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={activeLabel === item.label ? "is-active" : ""}
              onMouseEnter={() => setActive(item.key)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href={BOOK_CONSULTATION_HREF} className="psc-cta">
          Book
          <br />
          Consultation
        </a>

        {activeNav && (
          <div className="psc-menu-wrap">
            {activeNav.type === "narrow" && activeNav.key === "about" && (
              <div className="psc-menu-narrow">
                <p className="psc-eyebrow">About PSC</p>
                <p className="psc-menu-desc">
                  Discover the people, values and journey behind PSC Global.
                </p>
                <div className="psc-link-list">
                  {ABOUT_LINKS.map((l) => (
                    <a href={ABOUT_HREFS[l] || "/about"} key={l}>
                      {l}
                      <ArrowRight size={14} />
                    </a>
                  ))}
                </div>
                <a href="/about" className="psc-explore">
                  Explore PSC <ArrowRight size={14} />
                </a>
              </div>
            )}

            {activeNav.key === "team" && (
              <div className="psc-menu-full">
                <div className="psc-team-grid">
                  <div>
                    <p className="psc-serif psc-menu-heading" style={{ fontSize: 22 }}>Our Team</p>
                    <p className="psc-menu-desc">
                      Meet the professionals behind PSC Global. We bring together diverse expertise to solve complex challenges.
                    </p>
                    <div className="psc-link-list">
                      {TEAM_LINKS.map((l) => (
                        <a href={TEAM_HREFS[l] || "/team"} key={l} style={{ textTransform: "uppercase", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em" }}>
                          {l}
                          <ArrowRight size={14} />
                        </a>
                      ))}
                    </div>
                    <a href="/team" className="psc-explore">
                      Meet Our Experts <ArrowRight size={14} />
                    </a>
                  </div>
                  <div className="psc-team-photo">
                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop"
                      alt="PSC Global Executive Board"
                    />
                    <span className="psc-team-caption">PSC Global Executive Board</span>
                  </div>
                </div>
              </div>
            )}

            {activeNav.key === "practice" && (
              <div className="psc-menu-full">
                <div className="psc-cols psc-cols-5">
                  {PRACTICE_COLUMNS.map((col) => (
                    <div key={col.title}>
                      <p className="psc-col-title">{col.title}</p>
                      <div className="psc-col-list">
                        {col.items.map((i) => (
                          <a href={PRACTICE_HREFS[col.title] || "/practice-areas"} key={i}>{i}</a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="psc-gcc-banner">
                  <div className="psc-gcc-icon">
                    <Globe2 size={18} />
                  </div>
                  <div>
                    <strong>Global Capability Center</strong>
                    <p>Our GCC model helps enterprise leaders scale specialized functions with architectural precision.</p>
                  </div>
                  <a href="/gcc" className="psc-gcc-link">Explore GCC →</a>
                  <Link href="/practice-areas" className="psc-gcc-view">View All Practice Areas <ArrowRight size={14} /></Link>
                </div>
              </div>
            )}

            {activeNav.key === "industries" && (
              <div className="psc-menu-full">
                <div className="psc-full-grid">
                  <div>
                    <p className="psc-serif psc-menu-heading" style={{ fontSize: 26 }}>Industries</p>
                    <p className="psc-menu-desc">
                      Sector-focused expertise backed by multidisciplinary advisory capabilities.
                    </p>
                    <Link href="/industries" className="psc-explore" style={{ marginTop: 0 }}>
                      Explore All Industries <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div className="psc-cols psc-cols-3">
                    {INDUSTRY_COLUMNS.map((col, idx) => (
                      <div className="psc-col-list" key={idx} style={{ gap: 20, borderLeft: idx > 0 ? "1px solid var(--line)" : "none", paddingLeft: idx > 0 ? 32 : 0 }}>
                        {col.map((i) => (
                          <a href={INDUSTRY_HREFS[i] || "/industries"} key={i}>{i}</a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeNav.key === "insights" && (
              <div className="psc-menu-full">
                <div className="psc-full-grid">
                  <div className="psc-cols" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                    {INSIGHTS_COLUMNS.map((col, idx) => (
                      <div className="psc-col-list" key={idx} style={{ gap: 20 }}>
                        {col.map((i) => (
                          <a href={INSIGHTS_HREFS[i] || "/insights"} key={i} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, color: "var(--ink)" }}>{i}</a>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="psc-spotlight">
                    <p className="psc-eyebrow">Spotlight Event</p>
                    <p className="psc-spotlight-date">October 24, 2026 — London, UK</p>
                    <p className="psc-spotlight-title">
                      Global Infrastructure &amp; Sustainable Finance Summit
                    </p>
                    <Link href="/events#upcoming" className="reg">Register <ArrowRight size={14} /></Link>
                    <Link href="/events" className="view">View All Events →</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {mobileOpen && (
          <div className="psc-mobile-menu" style={{ position: "absolute", top: 88, left: 0, right: 0, background: "#fff", borderBottom: "1px solid var(--line)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--nav-text)", textDecoration: activeLabel === item.label ? "underline" : "none", textUnderlineOffset: 4, fontWeight: activeLabel === item.label ? 700 : 500 }}
              >
                {item.label}
              </a>
            ))}
            <a href={BOOK_CONSULTATION_HREF} className="psc-cta" style={{ display: "inline-block" }}>Book Consultation</a>
          </div>
        )}
      </header>
    </div>
  );
}