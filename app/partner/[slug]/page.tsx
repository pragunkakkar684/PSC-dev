import { Briefcase, FileText, Globe, Landmark, ShieldCheck, Tags, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '../../components/AnimatedSection';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import { db } from '@/lib/db';
import { teamMembers, teamMemberExpertise } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { ALLOWED_ICONS } from '@/app/admin/(dashboard)/components/IconPicker';
import { notFound } from 'next/navigation';



// Generic two-column "Professional Journey" copy used whenever a partner has no
// specific `journey` content of their own (via DB or the fallback map above).
// Written to read sensibly for any partner rather than naming a specific person.
const genericJourney = [
  [
    'With years of dedicated practice, this advisor has built a strong reputation within their specialty, developing a nuanced understanding of the regulatory and commercial dynamics that shape client outcomes.',
    'Prior to joining PSC Global, they held senior positions at respected institutions, contributing to some of the most significant transactions and structural initiatives in their field.',
  ],
  [
    'Their approach is grounded in anticipation rather than reaction — identifying systemic vulnerabilities before they manifest as crises, and architecting resilience into the core of client operations.',
    'When engaging with clients, they insist on rigorous analytical integrity, pairing comprehensive risk modeling with actionable, pragmatic strategies aligned to long-term objectives.',
  ],
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [member] = await db.select().from(teamMembers).where(eq(teamMembers.slug, slug)).limit(1);

  if (member) {
    return {
      title: `${member.name} — ${member.roleTitle || 'Partner'} | PSC Global`,
      description: member.shortBio || member.quote || 'Executive advisory partner profile at PSC Global.',
    };
  }
  return {
    title: 'Partner Profile | PSC Global',
  };
}

export default async function DynamicPartnerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [member] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.slug, slug))
    .limit(1);

  if (!member) {
    notFound();
  }

  const name = member.name;
  const roleTitle = member.roleTitle || 'Senior Partner';
  const location = member.location || 'GLOBAL';
  const yearsExperience = member.yearsExperience || '20+ YEARS EXPERIENCE';
  const quote = member.quote || '';
  const shortBio = member.shortBio || '';
  const imageUrl = member.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85';
  const journey = (member as { journey?: string[][] })?.journey ?? genericJourney;

  const expertiseList = await db
    .select()
    .from(teamMemberExpertise)
    .where(eq(teamMemberExpertise.teamMemberId, member.id))
    .orderBy(asc(teamMemberExpertise.sortOrder));

  return (
    <main id="top">
      <SiteHeader />

      <AnimatedSection className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
        <img
          className="h-[560px] w-full object-cover"
          src={imageUrl}
          alt={name}
        />
        <div>
          <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
            {location} <span>|</span> {yearsExperience}
          </p>
          <h1 className="mt-4 font-serif text-6xl tracking-[-.03em] text-ink">{name}</h1>
          <p className="mt-4 text-base font-medium text-slate-600">{roleTitle}</p>

          <div className="mt-6 max-w-xl border-t border-slate-200" />

          {quote && (
            <h2 className="mt-8 font-serif text-3xl leading-tight text-ink">
              &quot;{quote}&quot;
            </h2>
          )}
          {shortBio && (
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              {shortBio}
            </p>
          )}

          <div className="mt-8 flex gap-3">
            <a href="#contact" className="bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white">
              SCHEDULE A DISCUSSION
            </a>
            <a href="/book-consultation" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
              BOOK A CONSULTATION
            </a>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[280px_1fr]">
          <h2 className="font-serif text-4xl leading-tight text-ink">
            Professional Journey &amp; Approach
          </h2>
          <div className="grid gap-10 md:grid-cols-2">
            {journey.map((paragraphs, i) => (
              <div className="space-y-5" key={i}>
                {paragraphs.map((p) => (
                  <p className="text-sm leading-7 text-slate-600" key={p.slice(0, 20)}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {expertiseList.length > 0 && (
        <AnimatedSection className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <h2 className="font-serif text-4xl text-ink">Areas of Expertise</h2>
          <div className="mt-6 border-t border-slate-200" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {expertiseList.map((item, idx) => {
              const IconComp = (item.iconName && ALLOWED_ICONS[item.iconName]) || CheckCircle2;
              return (
                <article className="bg-[#fdf9f8] p-8" key={idx}>
                  <IconComp className="text-ink" size={22} strokeWidth={1.5} />
                  <h3 className="mt-5 font-serif text-2xl text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </AnimatedSection>
      )}

      <AnimatedSection id="contact" className="bg-navy px-6 py-24 text-center text-white">
        <h2 className="mx-auto max-w-3xl font-serif text-5xl leading-tight">
          Let&apos;s Discuss Your Business Challenges.
        </h2>
        <div className="mt-9 flex justify-center gap-3">
          <a href="#top" className="bg-white px-5 py-3 text-xs font-bold tracking-wide text-navy">
            SCHEDULE A DISCUSSION
          </a>
          <a href="#top" className="border border-white px-5 py-3 text-xs font-bold tracking-wide">
            CONTACT PSC
          </a>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}