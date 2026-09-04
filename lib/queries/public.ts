import { db } from '@/lib/db';
import {
  navItems,
  heroSections,
  teamMembers,
  teamMemberExpertise,
  practiceAreas,
  practiceAreaServices,
  practiceAreaCapabilities,
  practiceAreaExperts,
  practiceAreaInsights,
  industries,
  industryChallenges,
  industrySolutions,
  industryPracticeAreas,
  industryExperts,
  industryInsights,
  industrySharedChallenges,
  regulatoryUpdates,
  keyJudgements,
  researchResources,
  events,
  eventAgendaItems,
  eventSpeakers,
  insightsArticles,
  faqs,
  testimonials,
  officeLocations,
  siteSettings,
  sitePages,
  pageSections,
  pageSeo,
  careersPositions,
  stats,
} from '@/lib/db/schema';
import type { Metadata } from 'next';
import { eq, and, asc, desc } from 'drizzle-orm';

// ─── 1. SITE SETTINGS ────────────────────────────────────────────────────────
export async function getPublicSiteSettings() {
  try {
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
    if (settings) return settings;
  } catch (err) {
    console.error('Error querying siteSettings:', err);
  }

  return {
    siteName: 'PSC Global',
    tagline: 'Strategic Corporate Advisory & Global Compliance Excellence',
    footerDescription: 'PSC Global provides trusted cross-border advisory, tax policy, risk governance, and legal strategic counsel to multinational institutions, government bodies, and high-growth enterprises.',
    copyrightText: `© ${new Date().getFullYear()} PSC Global. All rights reserved.`,
    contactEmailGeneral: 'contact@pscglobal.com',
  };
}

// ─── 2. NAVIGATION ───────────────────────────────────────────────────────────
export async function getPublicNavItems(menuKey?: string) {
  try {
    const conditions = [eq(navItems.isActive, true)];
    if (menuKey) {
      conditions.push(eq(navItems.menuKey, menuKey));
    }
    const items = await db
      .select()
      .from(navItems)
      .where(and(...conditions))
      .orderBy(asc(navItems.sortOrder));

    if (items.length > 0) return items;
  } catch (err) {
    console.error('Error querying navItems:', err);
  }

  // Fallback nav items
  return [
    { id: 1, label: 'About', href: '/about', menuKey: 'primary', sortOrder: 1, isActive: true },
    { id: 2, label: 'Team', href: '/team', menuKey: 'primary', sortOrder: 2, isActive: true },
    { id: 3, label: 'Practice Areas', href: '/practice-areas', menuKey: 'primary', sortOrder: 3, isActive: true },
    { id: 4, label: 'Industries', href: '/industries', menuKey: 'primary', sortOrder: 4, isActive: true },
    { id: 5, label: 'Insights', href: '/insights', menuKey: 'primary', sortOrder: 5, isActive: true },
    { id: 6, label: 'GCC', href: '/gcc', menuKey: 'primary', sortOrder: 6, isActive: true },
    { id: 7, label: 'Contact', href: '/contact', menuKey: 'primary', sortOrder: 7, isActive: true },
  ];
}

// ─── 3. HERO SECTIONS ────────────────────────────────────────────────────────
export async function getPublicHeroSection(pageSlug: string) {
  try {
    const [hero] = await db.select().from(heroSections).where(eq(heroSections.pageSlug, pageSlug)).limit(1);
    if (hero && hero.heading) return hero;
  } catch (err) {
    console.error(`Error querying hero_sections for ${pageSlug}:`, err);
  }

  // Fallback Heroes Map
  const fallbackHeroes: Record<string, any> = {
    home: {
      eyebrow: 'STRATEGIC ADVISORY & GLOBAL COMPLIANCE',
      heading: 'Navigating Regulatory Complexity Across Borders',
      subheading: 'PSC Global delivers bespoke legal, tax, risk governance, and corporate structuring solutions for global institutions.',
      imageUrl: '/hero-bg.jpg',
      cta1Text: 'EXPLORE PRACTICE AREAS',
      cta1Href: '/practice-areas',
      cta2Text: 'SCHEDULE A CONSULTATION',
      cta2Href: '/contact',
    },
    about: {
      eyebrow: 'OUR FIRM & LEADERSHIP',
      heading: 'Architecting Trust in Global Commerce',
      subheading: 'Founded on principles of technical excellence, independence, and strategic foresight.',
      imageUrl: '/about-hero.jpg',
      cta1Text: 'MEET OUR TEAM',
      cta1Href: '/team',
      cta2Text: 'VIEW LOCATIONS',
      cta2Href: '/about#offices',
    },
    team: {
      eyebrow: 'LEADERSHIP & EXPERTS',
      heading: 'Distinguished Industry Practitioners',
      subheading: 'Our partners combine decade-long regulator insights with deep sector specializations.',
      imageUrl: '/team-hero.jpg',
      cta1Text: 'VIEW ALL MEMBERS',
      cta1Href: '/team',
    },
    'practice-areas': {
      eyebrow: 'CORE ADVISORY CAPABILITIES',
      heading: 'Comprehensive Cross-Border Solutions',
      subheading: 'Multidisciplinary guidance spanning tax policy, corporate restructuring, risk governance, and regulatory disputes.',
      imageUrl: '/practice-hero.jpg',
      cta1Text: 'CONTACT ADVISORS',
      cta1Href: '/contact',
    },
    industries: {
      eyebrow: 'SECTOR SPECIALIZATION',
      heading: 'Deep Domain & Sector Expertise',
      subheading: 'Tailored counsel across energy, financial services, tech, healthcare, and infrastructure.',
      imageUrl: '/industry-hero.jpg',
    },
    insights: {
      eyebrow: 'KNOWLEDGE & THOUGHT LEADERSHIP',
      heading: 'Authoritative Insights on Global Regulation',
      subheading: 'Analysis on tax reforms, judicial precedents, and international compliance frameworks.',
      imageUrl: '/insights-hero.jpg',
    },
    gcc: {
      eyebrow: 'GLOBAL CAPABILITY CENTERS',
      heading: 'GCC Structuring & Operating Models',
      subheading: 'End-to-end setup, transfer pricing, talent governance, and regulatory clearance for GCCs.',
      imageUrl: '/gcc-hero.jpg',
      cta1Text: 'GET IN TOUCH',
      cta1Href: '/contact',
    },
    events: {
      eyebrow: 'EXECUTIVE ROUNDTABLES & WEBINARS',
      heading: 'Global Regulatory Seminars',
      subheading: 'Join our senior partners for key updates on international compliance and tax policy.',
      imageUrl: '/events-hero.jpg',
    },
    contact: {
      eyebrow: 'GET IN TOUCH',
      heading: 'Schedule an Advisory Consultation',
      subheading: 'Connect with our global offices in London, New York, Singapore, and Mumbai.',
      imageUrl: '/contact-hero.jpg',
    },
  };

  return fallbackHeroes[pageSlug] || {
    eyebrow: 'PSC GLOBAL',
    heading: 'Strategic Advisory & Governance',
    subheading: 'Global corporate advisory and compliance solutions.',
  };
}

// ─── 4. TEAM MEMBERS & PARTNER PROFILES ─────────────────────────────────────
export async function getPublicTeamMembers() {
  try {
    const members = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isPublished, true))
      .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));

    if (members.length > 0) {
      // Attach expertise items
      const result = await Promise.all(
        members.map(async (m) => {
          const exp = await db
            .select()
            .from(teamMemberExpertise)
            .where(eq(teamMemberExpertise.teamMemberId, m.id))
            .orderBy(asc(teamMemberExpertise.sortOrder));
          return { ...m, expertise: exp };
        })
      );
      return result;
    }
  } catch (err) {
    console.error('Error querying teamMembers:', err);
  }

  // Fallback Team Array
  return [
    {
      id: 1,
      name: 'Vance Spencer',
      slug: 'vance-spencer',
      roleTitle: 'Managing Partner',
      category: 'partner',
      specialty: 'Tax Policy',
      focusArea: 'Tax Policy & Cross-Border M&A',
      location: 'London / Singapore',
      email: 'v.spencer@pscglobal.com',
      yearsExperience: '22',
      shortBio: 'Vance leads the global tax practice, advising Fortune 500 corporations on international tax structuring and transfer pricing dispute resolution.',
      quote: 'Navigating regulatory ambiguity requires foresight, technical precision, and unwavering integrity.',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
      sortOrder: 1,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      longBioSections: null,
      expertise: [
        { id: 1, title: 'International Tax Structuring', iconName: 'Scale', description: 'Designing compliant cross-border holding structures.' },
        { id: 2, title: 'Transfer Pricing Disputes', iconName: 'Shield', description: 'Representing clients before international tax tribunals.' },
      ],
    },
  ];
}

export async function getPublicTeamMemberBySlug(slug: string) {
  try {
    const [member] = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.slug, slug), eq(teamMembers.isPublished, true)))
      .limit(1);

    if (member) {
      const exp = await db
        .select()
        .from(teamMemberExpertise)
        .where(eq(teamMemberExpertise.teamMemberId, member.id))
        .orderBy(asc(teamMemberExpertise.sortOrder));
      return { ...member, expertise: exp };
    }
  } catch (err) {
    console.error(`Error querying teamMember by slug ${slug}:`, err);
  }
  return null;
}

// ─── 5. PRACTICE AREAS ───────────────────────────────────────────────────────
export async function getPublicPracticeAreas() {
  try {
    const areas = await db
      .select()
      .from(practiceAreas)
      .where(eq(practiceAreas.isPublished, true))
      .orderBy(asc(practiceAreas.sortOrder), asc(practiceAreas.id));

    if (areas.length > 0) {
      const result = await Promise.all(
        areas.map(async (pa) => {
          const srv = await db
            .select()
            .from(practiceAreaServices)
            .where(eq(practiceAreaServices.practiceAreaId, pa.id))
            .orderBy(asc(practiceAreaServices.sortOrder));
          return { ...pa, services: srv };
        })
      );
      return result;
    }
  } catch (err) {
    console.error('Error querying practiceAreas:', err);
  }

  return [];
}

export async function getPublicPracticeAreaBySlug(slug: string) {
  try {
    const [area] = await db
      .select()
      .from(practiceAreas)
      .where(and(eq(practiceAreas.slug, slug), eq(practiceAreas.isPublished, true)))
      .limit(1);

    if (!area) return null;

    // Fetch services
    const services = await db
      .select()
      .from(practiceAreaServices)
      .where(eq(practiceAreaServices.practiceAreaId, area.id))
      .orderBy(asc(practiceAreaServices.sortOrder));

    // Fetch capabilities
    const capabilities = await db
      .select()
      .from(practiceAreaCapabilities)
      .where(and(eq(practiceAreaCapabilities.practiceAreaId, area.id), eq(practiceAreaCapabilities.isVisible, true)))
      .orderBy(asc(practiceAreaCapabilities.sortOrder));

    // Fetch related industries
    const indLinks = await db
      .select({ ind: industries, sortOrder: industryPracticeAreas.sortOrder })
      .from(industryPracticeAreas)
      .innerJoin(industries, eq(industryPracticeAreas.industryId, industries.id))
      .where(and(eq(industryPracticeAreas.practiceAreaId, area.id), eq(industries.isPublished, true)))
      .orderBy(asc(industryPracticeAreas.sortOrder));
    const relatedIndustries = indLinks.map((r) => r.ind);

    // Fetch related experts
    const expertLinks = await db
      .select({ tm: teamMembers, sortOrder: practiceAreaExperts.sortOrder })
      .from(practiceAreaExperts)
      .innerJoin(teamMembers, eq(practiceAreaExperts.teamMemberId, teamMembers.id))
      .where(and(eq(practiceAreaExperts.practiceAreaId, area.id), eq(teamMembers.isPublished, true)))
      .orderBy(asc(practiceAreaExperts.sortOrder));
    const relatedExperts = expertLinks.map((r) => r.tm);

    // Fetch related insights
    const insightLinks = await db
      .select({ art: insightsArticles, sortOrder: practiceAreaInsights.sortOrder })
      .from(practiceAreaInsights)
      .innerJoin(insightsArticles, eq(practiceAreaInsights.articleId, insightsArticles.id))
      .where(and(eq(practiceAreaInsights.practiceAreaId, area.id), eq(insightsArticles.isPublished, true)))
      .orderBy(asc(practiceAreaInsights.sortOrder));
    const relatedInsights = insightLinks.map((r) => r.art);

    return { ...area, services, capabilities, relatedIndustries, relatedExperts, relatedInsights };
  } catch (err) {
    console.error(`Error querying practiceArea by slug ${slug}:`, err);
  }
  return null;
}

// ─── 6. INDUSTRIES ───────────────────────────────────────────────────────────
export async function getPublicIndustries() {
  try {
    const ind = await db
      .select()
      .from(industries)
      .where(eq(industries.isPublished, true))
      .orderBy(asc(industries.sortOrder), asc(industries.id));

    if (ind.length > 0) return ind;
  } catch (err) {
    console.error('Error querying industries:', err);
  }

  return [];
}

export async function getPublicIndustryBySlug(slug: string) {
  try {
    const [ind] = await db
      .select()
      .from(industries)
      .where(and(eq(industries.slug, slug), eq(industries.isPublished, true)))
      .limit(1);

    if (!ind) return null;

    // Fetch related challenges
    const challenges = await db
      .select()
      .from(industryChallenges)
      .where(and(eq(industryChallenges.industryId, ind.id), eq(industryChallenges.isVisible, true)))
      .orderBy(asc(industryChallenges.sortOrder));

    // Fetch related solutions
    const solutions = await db
      .select()
      .from(industrySolutions)
      .where(and(eq(industrySolutions.industryId, ind.id), eq(industrySolutions.isVisible, true)))
      .orderBy(asc(industrySolutions.sortOrder));

    // Fetch related practice areas
    const paLinks = await db
      .select({ pa: practiceAreas, sortOrder: industryPracticeAreas.sortOrder })
      .from(industryPracticeAreas)
      .innerJoin(practiceAreas, eq(industryPracticeAreas.practiceAreaId, practiceAreas.id))
      .where(eq(industryPracticeAreas.industryId, ind.id))
      .orderBy(asc(industryPracticeAreas.sortOrder));
    const relatedPracticeAreas = paLinks.map((r) => r.pa);

    // Fetch related experts
    const expertLinks = await db
      .select({ tm: teamMembers, sortOrder: industryExperts.sortOrder })
      .from(industryExperts)
      .innerJoin(teamMembers, eq(industryExperts.teamMemberId, teamMembers.id))
      .where(eq(industryExperts.industryId, ind.id))
      .orderBy(asc(industryExperts.sortOrder));
    const relatedExperts = expertLinks.map((r) => r.tm);

    // Fetch related insights
    const insightLinks = await db
      .select({ art: insightsArticles, sortOrder: industryInsights.sortOrder })
      .from(industryInsights)
      .innerJoin(insightsArticles, eq(industryInsights.articleId, insightsArticles.id))
      .where(eq(industryInsights.industryId, ind.id))
      .orderBy(asc(industryInsights.sortOrder));
    const relatedInsights = insightLinks.map((r) => r.art);

    return { ...ind, challenges, solutions, relatedPracticeAreas, relatedExperts, relatedInsights };
  } catch (err) {
    console.error(`Error querying industry by slug ${slug}:`, err);
  }
  return null;
}

// ─── 7. EVENTS ───────────────────────────────────────────────────────────────
export async function getPublicEvents() {
  try {
    const evList = await db
      .select()
      .from(events)
      .where(eq(events.isPublished, true))
      .orderBy(asc(events.date));

    if (evList.length > 0) {
      const result = await Promise.all(
        evList.map(async (ev) => {
          const agenda = await db
            .select()
            .from(eventAgendaItems)
            .where(eq(eventAgendaItems.eventId, ev.id))
            .orderBy(asc(eventAgendaItems.sortOrder));

          const speakers = await db
            .select()
            .from(eventSpeakers)
            .where(eq(eventSpeakers.eventId, ev.id))
            .orderBy(asc(eventSpeakers.sortOrder));

          return { ...ev, agenda, speakers };
        })
      );
      return result;
    }
  } catch (err) {
    console.error('Error querying events:', err);
  }

  return [];
}

export async function getPublicEventBySlug(slug: string) {
  try {
    const [ev] = await db
      .select()
      .from(events)
      .where(and(eq(events.slug, slug), eq(events.isPublished, true)))
      .limit(1);

    if (ev) {
      const agenda = await db
        .select()
        .from(eventAgendaItems)
        .where(eq(eventAgendaItems.eventId, ev.id))
        .orderBy(asc(eventAgendaItems.sortOrder));

      const speakers = await db
        .select()
        .from(eventSpeakers)
        .where(eq(eventSpeakers.eventId, ev.id))
        .orderBy(asc(eventSpeakers.sortOrder));

      return { ...ev, agenda, speakers };
    }
  } catch (err) {
    console.error(`Error querying event by slug ${slug}:`, err);
  }
  return null;
}

// ─── 8. INSIGHTS ARTICLES ────────────────────────────────────────────────────
export async function getPublicInsights() {
  try {
    const articles = await db
      .select()
      .from(insightsArticles)
      .where(eq(insightsArticles.isPublished, true))
      .orderBy(desc(insightsArticles.publishedAt));

    if (articles.length > 0) {
      const result = await Promise.all(
        articles.map(async (art) => {
          let author = null;
          if (art.authorId) {
            const [a] = await db.select().from(teamMembers).where(eq(teamMembers.id, art.authorId)).limit(1);
            author = a || null;
          }
          return { ...art, author };
        })
      );
      return result;
    }
  } catch (err) {
    console.error('Error querying insightsArticles:', err);
  }

  return [];
}

export async function getPublicInsightBySlug(slug: string) {
  try {
    const [article] = await db
      .select()
      .from(insightsArticles)
      .where(and(eq(insightsArticles.slug, slug), eq(insightsArticles.isPublished, true)))
      .limit(1);

    if (article) {
      let author: any = null;
      if (article.authorId) {
        const [a] = await db.select().from(teamMembers).where(eq(teamMembers.id, article.authorId)).limit(1);
        author = a || null;
      }
      if (!author && article.authorName) {
        author = { name: article.authorName, roleTitle: article.authorRole || null, imageUrl: null };
      }

      let content: any[] = [];
      if (article.bodyContent) {
        try {
          content = JSON.parse(article.bodyContent);
        } catch {
          content = [];
        }
      }
      if (content.length === 0 && article.body) {
        content = [{ type: 'paragraph', text: article.body }];
      }

      return { ...article, author, content };
    }
  } catch (err) {
    console.error(`Error querying insight by slug ${slug}:`, err);
  }

  return null;
}

// ─── 9. FAQs ─────────────────────────────────────────────────────────────────
export async function getPublicFaqs(pageContext?: string) {
  try {
    const conditions = [eq(faqs.isPublished, true)];
    if (pageContext) {
      conditions.push(eq(faqs.category, pageContext));
    }

    const result = await db
      .select()
      .from(faqs)
      .where(and(...conditions))
      .orderBy(asc(faqs.sortOrder), asc(faqs.id));

    if (result.length > 0) return result;
  } catch (err) {
    console.error('Error querying faqs:', err);
  }

  return [];
}

// ─── 10. TESTIMONIALS ────────────────────────────────────────────────────────
export async function getPublicTestimonials() {
  try {
    const result = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));

    if (result.length > 0) return result;
  } catch (err) {
    console.error('Error querying testimonials:', err);
  }

  return [];
}

// ─── 11. OFFICE LOCATIONS ────────────────────────────────────────────────────
export async function getPublicOfficeLocations() {
  try {
    const result = await db
      .select()
      .from(officeLocations)
      .where(eq(officeLocations.isPublished, true))
      .orderBy(asc(officeLocations.sortOrder), asc(officeLocations.city));

    if (result.length > 0) return result;
  } catch (err) {
    console.error('Error querying officeLocations:', err);
  }

  return [];
}

export async function getPublicStats() {
  try {
    const statList = await db
      .select()
      .from(stats)
      .where(eq(stats.isPublished, true))
      .orderBy(asc(stats.sortOrder));

    if (statList.length > 0) return statList;
  } catch (err) {
    console.error('Error querying stats:', err);
  }

  return [
    { id: 1, label: 'YEARS OF EXPERIENCE', value: 22, suffix: '+', iconName: 'Clock', sortOrder: 0, isPublished: true, updatedAt: new Date() },
    { id: 2, label: 'CLIENTS WORLDWIDE', value: 1000, suffix: '+', iconName: 'Users', sortOrder: 1, isPublished: true, updatedAt: new Date() },
    { id: 3, label: 'COUNTRIES PRESENT', value: 15, suffix: '+', iconName: 'Globe2', sortOrder: 2, isPublished: true, updatedAt: new Date() },
    { id: 4, label: 'EXPERTS & CONSULTANTS', value: 250, suffix: '+', iconName: 'CheckCircle2', sortOrder: 3, isPublished: true, updatedAt: new Date() },
  ];
}

// ─── 12. SITE-WIDE CMS QUERIES ───────────────────────────────────────────────

export async function getSEOForTarget(targetType: string, targetIdentifier: string) {
  try {
    const [seo] = await db
      .select()
      .from(pageSeo)
      .where(and(eq(pageSeo.targetType, targetType), eq(pageSeo.targetIdentifier, targetIdentifier)))
      .limit(1);

    return seo || null;
  } catch (err) {
    console.error(`Error querying pageSeo for ${targetType}:${targetIdentifier}:`, err);
    return null;
  }
}

export async function getPageCMS(pageSlug: string) {
  try {
    const [page] = await db.select().from(sitePages).where(eq(sitePages.slug, pageSlug)).limit(1);
    const sections = await db
      .select()
      .from(pageSections)
      .where(and(eq(pageSections.pageSlug, pageSlug), eq(pageSections.isVisible, true)))
      .orderBy(asc(pageSections.sortOrder));

    const sectionMap: Record<string, typeof pageSections.$inferSelect> = {};
    for (const sec of sections) {
      sectionMap[sec.sectionKey] = sec;
    }

    return {
      page: page || null,
      sections,
      sectionMap,
    };
  } catch (err) {
    console.error(`Error querying getPageCMS for ${pageSlug}:`, err);
    const sectionMap: Record<string, typeof pageSections.$inferSelect> = {};
    return { page: null, sections: [], sectionMap };
  }
}

export async function getPublicCareersPositions() {
  try {
    const positions = await db
      .select()
      .from(careersPositions)
      .where(eq(careersPositions.isPublished, true))
      .orderBy(asc(careersPositions.sortOrder), desc(careersPositions.createdAt));

    return positions;
  } catch (err) {
    console.error('Error querying careersPositions:', err);
    return [];
  }
}

// ─── REGULATORY UPDATES ──────────────────────────────────────────────────────
export async function getPublicRegulatoryUpdates() {
  try {
    return await db
      .select()
      .from(regulatoryUpdates)
      .where(eq(regulatoryUpdates.isVisible, true))
      .orderBy(asc(regulatoryUpdates.sortOrder));
  } catch (err) {
    console.error('Error querying regulatory updates:', err);
    return [];
  }
}

// ─── KEY JUDGEMENTS ──────────────────────────────────────────────────────────
export async function getPublicKeyJudgements() {
  try {
    return await db
      .select()
      .from(keyJudgements)
      .where(eq(keyJudgements.isVisible, true))
      .orderBy(asc(keyJudgements.sortOrder));
  } catch (err) {
    console.error('Error querying key judgements:', err);
    return [];
  }
}

// ─── RESEARCH RESOURCES ──────────────────────────────────────────────────────
export async function getPublicResearchResources() {
  try {
    return await db
      .select()
      .from(researchResources)
      .where(eq(researchResources.isVisible, true))
      .orderBy(asc(researchResources.sortOrder));
  } catch (err) {
    console.error('Error querying research resources:', err);
    return [];
  }
}

// ─── SHARED INDUSTRY CHALLENGES ───────────────────────────────────────────────
export async function getPublicSharedChallenges() {
  try {
    return await db
      .select()
      .from(industrySharedChallenges)
      .where(eq(industrySharedChallenges.isVisible, true))
      .orderBy(asc(industrySharedChallenges.sortOrder));
  } catch (err) {
    console.error('Error querying shared challenges:', err);
    return [];
  }
}



export async function buildPageMetadata(
  targetType: string,
  targetIdentifier: string,
  defaults: { title: string; description: string }
): Promise<Metadata> {
  const seo = await getSEOForTarget(targetType, targetIdentifier);

  const title = seo?.metaTitle || defaults.title;
  const description = seo?.metaDescription || defaults.description;
  const canonical = seo?.canonicalUrl || undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: (seo?.twitterCard as any) || 'summary_large_image',
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    robots: {
      index: !seo?.robots?.includes('noindex'),
      follow: !seo?.robots?.includes('nofollow'),
    },
  };
}