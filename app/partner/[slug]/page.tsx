import { Briefcase, FileText, Globe, Landmark, ShieldCheck, Tags, CheckCircle2 } from 'lucide-react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import { db } from '@/lib/db';
import { teamMembers, teamMemberExpertise } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { ALLOWED_ICONS } from '@/app/admin/(dashboard)/components/IconPicker';
import { notFound } from 'next/navigation';

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
    title: 'Dr. Julian Vance — Partner Profile | PSC Global',
    description: 'Dr. Vance specializes in navigating complex regulatory environments for Fortune 500 companies.',
  };
}

export default async function DynamicPartnerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [member] = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.slug, slug))
    .limit(1);

  if (!member && slug !== 'julian-vance') {
    notFound();
  }

  // Fallback data for static julian-vance profile if DB row is not present
  const name = member?.name ?? 'Dr. Julian Vance';
  const roleTitle = member?.roleTitle ?? 'Founder & CEO / Senior Partner';
  const location = member?.location ?? 'LONDON / NEW YORK';
  const yearsExperience = member?.yearsExperience ?? '25+ YEARS EXPERIENCE';
  const quote = member?.quote ?? 'Architecting Resilience for Global Enterprises.';
  const shortBio = member?.shortBio ?? 'Dr. Vance specializes in navigating complex regulatory environments and executing high-stakes cross-border transactions for Fortune 500 companies.';
  const imageUrl = member?.imageUrl ?? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85';

  let expertiseList = [];
  if (member) {
    expertiseList = await db
      .select()
      .from(teamMemberExpertise)
      .where(eq(teamMemberExpertise.teamMemberId, member.id))
      .orderBy(asc(teamMemberExpertise.sortOrder));
  } else {
    expertiseList = [
      { iconName: 'Landmark', title: 'Corporate Law', description: 'Structuring sophisticated multinational entities and ensuring robust governance frameworks.' },
      { iconName: 'FileText', title: 'Tax Advisory', description: 'Optimizing cross-border tax strategies while ensuring strict compliance with emerging global standards.' },
      { iconName: 'ShieldCheck', title: 'Risk & Assurance', description: 'Developing comprehensive risk mitigation protocols for volatile regulatory environments.' },
      { iconName: 'Briefcase', title: 'Business Advisory', description: 'Strategic counsel for market entry, expansion, and operational restructuring.' },
      { iconName: 'Globe', title: 'Cross-border Transactions', description: 'Navigating complex jurisdictional conflicts in international deal-making.' },
      { iconName: 'Tags', title: 'M&A', description: 'End-to-end management of high-value mergers and acquisitions.' },
    ];
  }

  return (
    <main id="top">
      <SiteHeader />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10">
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
            <a href="#contact" className="border border-ink px-5 py-3 text-xs font-bold tracking-wide">
              BOOK A CONSULTATION
            </a>
          </div>
        </div>
      </section>

      {expertiseList.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
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
        </section>
      )}

      <section id="contact" className="bg-navy px-6 py-24 text-center text-white">
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
      </section>

      <Footer />
    </main>
  );
}
