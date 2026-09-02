import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../../components/AnimatedSection';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import Link from 'next/link';
import {
  getPublicHeroSection,
  getPublicIndustryBySlug, 
} from '@/lib/queries/public';

type IndustryChallenge = {
  number: string;
  title: string;
  description: string;
};

type IndustryHowWeHelpItem = {
  label: string;
  description: string;
};

type IndustryRelatedPractice = {
  name: string;
  slug: string;
};

type IndustryDetail = {
  eyebrow: string;
  industryName: string;
  heroDescription: string;
  heroImageUrl: string;
  understandingQuote: string;
  understandingParagraphs: string[];
  challengesIntro: string;
  challenges: IndustryChallenge[];
  howWeHelpSubheading: string;
  howWeHelpIntro: string;
  howWeHelp: IndustryHowWeHelpItem[];
  relatedPracticeAreas: IndustryRelatedPractice[];
};

const defaultIndustryDetails: Record<string, IndustryDetail> = {
  manufacturing: {
    eyebrow: 'INDUSTRIES',
    industryName: 'Manufacturing',
    heroDescription:
      'A rigorous, strategic approach to navigating supply chain volatility, industrial compliance, and the operational pressures unique to modern manufacturing. We build practical, resilient architectures for growth.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Resilience in manufacturing is no longer optional — it is the baseline for competing in a volatile global supply chain.',
    understandingParagraphs: [
      'The current landscape of manufacturing is defined by supply chain fragility, rising input costs, and mounting pressure to modernize production lines without disrupting output.',
      'At Advisory Global, we recognize that generalized solutions are insufficient. Manufacturers need bespoke frameworks that account for multi-tier supplier risk, labor regulation, and capital-intensive equipment cycles.',
      'Our approach is rooted in rigorous analysis and decades of applied experience, helping leadership teams optimize fiscal structures and establish governance that satisfies regulators and investors alike.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current industrial and macroeconomic environment.',
    challenges: [
      { number: '01.', title: 'Supply Chain Fragility', description: 'Diversifying supplier bases and building contingency capacity against geopolitical and logistics disruption.' },
      { number: '02.', title: 'Regulatory Complexity', description: 'Navigating environmental, labor, and trade compliance requirements across multiple manufacturing jurisdictions.' },
      { number: '03.', title: 'Capital Intensity', description: 'Structuring financing for equipment modernization and automation without overleveraging the balance sheet.' },
      { number: '04.', title: 'Workforce Transition', description: 'Managing the shift toward automated production while retaining institutional operational knowledge.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Your Production Reality',
    howWeHelpIntro: 'We deploy cross-functional teams combining deep industrial knowledge with specialized technical capabilities.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Cross-border trade and environmental regulation.' },
      { label: 'STRENGTHEN', description: 'Supply chain resilience and supplier governance.' },
      { label: 'TRANSFORM', description: 'Production models toward greater automation.' },
      { label: 'SCALE', description: 'Operations through strategic capital deployment.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  infrastructure: {
    eyebrow: 'INDUSTRIES',
    industryName: 'Infrastructure',
    heroDescription:
      'Long-term strategic advisory for large-scale capital projects, balancing public accountability, financing complexity, and multi-decade operational horizons.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Infrastructure decisions made today set the operational reality for the next thirty years — precision matters at every stage.',
    understandingParagraphs: [
      'The infrastructure sector is defined by long project horizons, heavy capital requirements, and dense regulatory oversight spanning multiple levels of government.',
      'At Advisory Global, we structure financing and governance models that hold up across decades, not just through initial construction and handover.',
      'Our teams partner with public and private stakeholders to de-risk large-scale projects, from environmental approvals through to long-term asset management.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current infrastructure financing environment.',
    challenges: [
      { number: '01.', title: 'Project Financing', description: 'Structuring public-private partnerships and long-duration debt instruments that survive interest rate cycles.' },
      { number: '02.', title: 'Regulatory Approval', description: 'Managing multi-jurisdictional environmental and planning approval processes without derailing timelines.' },
      { number: '03.', title: 'Cost Overrun Risk', description: 'Building contractual and governance safeguards against the inflation and delay risks endemic to megaprojects.' },
      { number: '04.', title: 'Long-Term Asset Management', description: 'Establishing maintenance and governance frameworks that protect asset value over multi-decade lifecycles.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Long-Horizon Delivery',
    howWeHelpIntro: 'We deploy cross-functional teams combining project finance expertise with regulatory and operational depth.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Complex multi-jurisdictional approval processes.' },
      { label: 'STRENGTHEN', description: 'Project financing and risk-sharing structures.' },
      { label: 'TRANSFORM', description: 'Asset management for long-term resilience.' },
      { label: 'SCALE', description: 'Portfolios through structured capital deployment.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  'real-estate': {
    eyebrow: 'INDUSTRIES',
    industryName: 'Real Estate',
    heroDescription:
      'Strategic portfolio management and asset protection for real estate operators navigating shifting valuations, financing costs, and regulatory pressure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Portfolio resilience in real estate now depends as much on financing structure as it does on location.',
    understandingParagraphs: [
      'The real estate landscape is defined by rate-sensitive valuations, shifting tenant demand, and tightening regulatory scrutiny over ownership structures.',
      'At Advisory Global, we build financing and governance architectures that protect portfolio value through market cycles rather than reacting to them.',
      'Our teams work directly with asset managers and developers to structure transactions, optimize tax exposure, and manage risk across diversified holdings.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current real estate and financing environment.',
    challenges: [
      { number: '01.', title: 'Valuation Volatility', description: 'Managing portfolio exposure as interest rate shifts compress or expand asset valuations.' },
      { number: '02.', title: 'Regulatory Scrutiny', description: 'Navigating tightening disclosure and ownership transparency requirements across jurisdictions.' },
      { number: '03.', title: 'Financing Structure', description: 'Structuring debt and equity positions that remain viable through rate cycles.' },
      { number: '04.', title: 'Portfolio Diversification', description: 'Balancing asset class and geographic exposure to reduce concentrated risk.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Portfolio Resilience',
    howWeHelpIntro: 'We deploy cross-functional teams combining real estate finance expertise with regulatory and tax depth.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Ownership transparency and disclosure regulation.' },
      { label: 'STRENGTHEN', description: 'Financing structures across market cycles.' },
      { label: 'TRANSFORM', description: 'Portfolios toward diversified, resilient holdings.' },
      { label: 'SCALE', description: 'Acquisitions through structured capital deployment.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  aviation: {
    eyebrow: 'INDUSTRIES',
    industryName: 'Aviation',
    heroDescription:
      'Navigating complex international aerospace compliance, fleet financing, and operational safety mandates across a highly regulated global sector.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Aviation compliance is not a single framework — it is a mesh of overlapping national and international mandates.',
    understandingParagraphs: [
      'The aviation sector is defined by dense international regulation, capital-intensive fleet cycles, and safety mandates that leave no margin for structural ambiguity.',
      'At Advisory Global, we help operators and lessors structure fleet financing and compliance frameworks that satisfy overlapping national aviation authorities.',
      'Our teams bring applied experience in cross-border leasing, safety certification pathways, and the fiscal structuring unique to aircraft assets.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current aviation regulatory and financing environment.',
    challenges: [
      { number: '01.', title: 'International Compliance', description: 'Reconciling overlapping national aviation authority requirements across operating regions.' },
      { number: '02.', title: 'Fleet Financing', description: 'Structuring aircraft leasing and ownership arrangements that optimize tax and liability exposure.' },
      { number: '03.', title: 'Safety Certification', description: 'Managing certification pathways for new aircraft types and operational expansions.' },
      { number: '04.', title: 'Operational Cost Pressure', description: 'Balancing fuel, maintenance, and crew costs against competitive route economics.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Regulatory Precision',
    howWeHelpIntro: 'We deploy cross-functional teams combining aerospace regulatory knowledge with fleet finance expertise.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Overlapping international aviation authority regimes.' },
      { label: 'STRENGTHEN', description: 'Fleet financing and leasing structures.' },
      { label: 'TRANSFORM', description: 'Operations for long-term certification stability.' },
      { label: 'SCALE', description: 'Fleets through structured capital deployment.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  energy: {
    eyebrow: 'INDUSTRIES',
    industryName: 'Energy',
    heroDescription:
      'Advising on the transition to sustainable power models while managing the regulatory, financing, and operational complexity of legacy energy assets.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'The energy transition is a balance sheet problem as much as it is an engineering one.',
    understandingParagraphs: [
      'The energy sector is defined by the tension between legacy asset economics and the accelerating shift toward renewable generation and storage.',
      'At Advisory Global, we help operators structure financing and governance frameworks that manage transition risk without abandoning near-term reliability.',
      'Our teams bring applied experience in project finance, carbon regulation, and the fiscal structuring of both conventional and renewable energy assets.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current energy transition and regulatory environment.',
    challenges: [
      { number: '01.', title: 'Transition Financing', description: 'Structuring capital allocation across legacy assets and renewable generation build-out.' },
      { number: '02.', title: 'Carbon Regulation', description: 'Navigating evolving emissions frameworks and carbon pricing mechanisms across jurisdictions.' },
      { number: '03.', title: 'Grid Integration', description: 'Managing the operational complexity of integrating variable renewable generation at scale.' },
      { number: '04.', title: 'Stranded Asset Risk', description: 'Protecting balance sheet value as legacy assets face accelerated depreciation timelines.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Transition Risk',
    howWeHelpIntro: 'We deploy cross-functional teams combining energy project finance with carbon and regulatory expertise.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Carbon pricing and emissions compliance regimes.' },
      { label: 'STRENGTHEN', description: 'Financing structures across generation portfolios.' },
      { label: 'TRANSFORM', description: 'Asset mix toward sustainable generation.' },
      { label: 'SCALE', description: 'Renewable build-out through structured capital.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  'banking-finance': {
    eyebrow: 'INDUSTRIES',
    industryName: 'Banking & Finance',
    heroDescription:
      'Securing assets and structuring resilient governance frameworks for financial institutions navigating a volatile global regulatory climate.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Regulatory capital requirements are moving faster than most institutions can restructure around them.',
    understandingParagraphs: [
      'The banking and finance sector is defined by tightening capital adequacy requirements, accelerating digital transformation, and cross-border compliance complexity.',
      'At Advisory Global, we help institutions structure governance and risk frameworks that satisfy regulators without stalling competitive innovation.',
      'Our teams bring applied experience in prudential regulation, digital banking transformation, and the fiscal structuring unique to financial institutions.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current financial regulatory environment.',
    challenges: [
      { number: '01.', title: 'Capital Adequacy', description: 'Structuring balance sheets to satisfy evolving prudential capital requirements.' },
      { number: '02.', title: 'Cross-Border Compliance', description: 'Reconciling divergent regulatory regimes across operating jurisdictions.' },
      { number: '03.', title: 'Digital Transformation', description: 'Modernizing core banking infrastructure while maintaining regulatory continuity.' },
      { number: '04.', title: 'Financial Crime Risk', description: 'Strengthening AML and fraud governance frameworks against increasingly sophisticated threats.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Regulatory Resilience',
    howWeHelpIntro: 'We deploy cross-functional teams combining prudential regulatory knowledge with digital transformation expertise.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Prudential capital and cross-border regulation.' },
      { label: 'STRENGTHEN', description: 'Governance and financial crime frameworks.' },
      { label: 'TRANSFORM', description: 'Core infrastructure for digital banking.' },
      { label: 'SCALE', description: 'Operations through structured capital deployment.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  healthcare: {
    eyebrow: 'INDUSTRIES',
    industryName: 'Healthcare',
    heroDescription:
      'Balancing clinical innovation with operational governance for healthcare providers navigating patient safety mandates and financing pressure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Healthcare governance must satisfy patient safety obligations and financial sustainability simultaneously — neither can be sacrificed.',
    understandingParagraphs: [
      'The healthcare sector is defined by dense clinical regulation, rising operational costs, and the ongoing pressure to modernize care delivery.',
      'At Advisory Global, we help providers and payers structure governance frameworks that protect patient safety while sustaining financial viability.',
      'Our teams bring applied experience in healthcare compliance, provider financing, and the operational restructuring of clinical organizations.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current healthcare regulatory and cost environment.',
    challenges: [
      { number: '01.', title: 'Clinical Compliance', description: 'Navigating dense patient safety and data privacy mandates across care settings.' },
      { number: '02.', title: 'Cost Pressure', description: 'Managing rising operational costs against constrained reimbursement models.' },
      { number: '03.', title: 'Digital Health Integration', description: 'Structuring governance for telehealth and digital care delivery expansion.' },
      { number: '04.', title: 'Workforce Sustainability', description: 'Addressing clinical staffing shortages through operational and financial restructuring.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Patient-Centered Governance',
    howWeHelpIntro: 'We deploy cross-functional teams combining healthcare compliance knowledge with operational finance expertise.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Clinical compliance and data privacy mandates.' },
      { label: 'STRENGTHEN', description: 'Governance frameworks for patient safety.' },
      { label: 'TRANSFORM', description: 'Care delivery through digital integration.' },
      { label: 'SCALE', description: 'Provider networks through structured capital.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  ngos: {
    eyebrow: 'INDUSTRIES',
    industryName: 'NGOs',
    heroDescription:
      'Ensuring transparency, accountability, and lasting impact for non-governmental organizations operating across complex jurisdictions.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Donor trust is built on transparent governance — the moment it slips, funding follows.',
    understandingParagraphs: [
      'The NGO sector is defined by donor accountability requirements, cross-border operational complexity, and the need to demonstrate measurable impact.',
      'At Advisory Global, we help organizations build governance and financial reporting frameworks that satisfy donors, regulators, and beneficiaries alike.',
      'Our teams bring applied experience in nonprofit compliance, grant structuring, and the operational governance unique to mission-driven organizations.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current nonprofit governance and funding environment.',
    challenges: [
      { number: '01.', title: 'Donor Accountability', description: 'Structuring financial reporting frameworks that satisfy institutional and individual donor requirements.' },
      { number: '02.', title: 'Cross-Border Operations', description: 'Navigating divergent nonprofit registration and tax regimes across operating countries.' },
      { number: '03.', title: 'Impact Measurement', description: 'Building credible frameworks for demonstrating programmatic outcomes to stakeholders.' },
      { number: '04.', title: 'Funding Volatility', description: 'Diversifying revenue streams against shifting donor priorities and grant cycles.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Mission-Driven Governance',
    howWeHelpIntro: 'We deploy cross-functional teams combining nonprofit compliance knowledge with financial governance expertise.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Cross-border nonprofit registration and tax regimes.' },
      { label: 'STRENGTHEN', description: 'Donor reporting and governance frameworks.' },
      { label: 'TRANSFORM', description: 'Impact measurement into credible reporting.' },
      { label: 'SCALE', description: 'Programs through diversified funding structures.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  technology: {
    eyebrow: 'INDUSTRIES',
    industryName: 'Technology',
    heroDescription:
      'Scaling digital solutions within legal frameworks, balancing rapid product iteration against tightening data and platform regulation.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Technology companies scale fastest when compliance is designed in from the first architecture decision, not bolted on afterward.',
    understandingParagraphs: [
      'The technology sector is defined by rapid product cycles, intensifying data protection regulation, and increasing scrutiny of platform market power.',
      'At Advisory Global, we help technology companies structure governance frameworks that support fast iteration without accumulating compliance debt.',
      'Our teams bring applied experience in data privacy law, IP protection, and the fiscal structuring unique to high-growth technology enterprises.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current technology regulatory environment.',
    challenges: [
      { number: '01.', title: 'Data Privacy Regulation', description: 'Navigating fragmented global data protection regimes as products scale internationally.' },
      { number: '02.', title: 'Platform Scrutiny', description: 'Managing antitrust and market power regulation as user bases and market share grow.' },
      { number: '03.', title: 'IP Protection', description: 'Structuring intellectual property frameworks that hold up under aggressive competitive pressure.' },
      { number: '04.', title: 'Talent & Equity Structuring', description: 'Building compensation frameworks that attract talent while managing dilution risk.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Rapid, Compliant Scale',
    howWeHelpIntro: 'We deploy cross-functional teams combining data privacy expertise with technology-sector fiscal structuring.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Fragmented global data protection regimes.' },
      { label: 'STRENGTHEN', description: 'IP protection and governance frameworks.' },
      { label: 'TRANSFORM', description: 'Compliance into a competitive advantage.' },
      { label: 'SCALE', description: 'Products through structured capital deployment.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  'e-commerce': {
    eyebrow: 'INDUSTRIES',
    industryName: 'E-Commerce',
    heroDescription:
      'Structuring cross-border retail and logistics operations to navigate fragmented tax regimes, consumer protection law, and supply chain complexity.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Cross-border e-commerce succeeds or fails on the fine print of local tax and consumer protection law.',
    understandingParagraphs: [
      'The e-commerce sector is defined by fragmented indirect tax regimes, tightening consumer protection standards, and logistics complexity at global scale.',
      'At Advisory Global, we help retailers structure operations that remain compliant as they expand into new markets and fulfillment corridors.',
      'Our teams bring applied experience in cross-border tax structuring, consumer law, and the logistics governance unique to digital retail operations.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current cross-border retail environment.',
    challenges: [
      { number: '01.', title: 'Cross-Border Tax', description: 'Navigating fragmented VAT, GST, and customs regimes across expansion markets.' },
      { number: '02.', title: 'Consumer Protection', description: 'Structuring returns, warranty, and disclosure practices that satisfy divergent regional standards.' },
      { number: '03.', title: 'Logistics Complexity', description: 'Managing fulfillment and last-mile delivery governance across multiple jurisdictions.' },
      { number: '04.', title: 'Platform Liability', description: 'Structuring marketplace governance to manage third-party seller and product liability exposure.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Global Retail Operations',
    howWeHelpIntro: 'We deploy cross-functional teams combining cross-border tax expertise with consumer and logistics regulation.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Fragmented VAT, GST, and customs regimes.' },
      { label: 'STRENGTHEN', description: 'Consumer protection and disclosure practices.' },
      { label: 'TRANSFORM', description: 'Fulfillment operations for compliant scale.' },
      { label: 'SCALE', description: 'Markets through structured expansion planning.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  media: {
    eyebrow: 'INDUSTRIES',
    industryName: 'Media',
    heroDescription:
      'Structuring content rights and digital distribution strategies for media organizations navigating fragmented platforms and shifting monetization models.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      'Content rights are the core asset of any media business — and increasingly the hardest thing to protect across platforms.',
    understandingParagraphs: [
      'The media sector is defined by rights fragmentation across streaming platforms, shifting advertising and subscription economics, and intensifying content licensing complexity.',
      'At Advisory Global, we help media organizations structure rights management and distribution frameworks that protect value as platforms multiply.',
      'Our teams bring applied experience in IP licensing, digital distribution structuring, and the fiscal planning unique to content-driven businesses.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current media distribution environment.',
    challenges: [
      { number: '01.', title: 'Rights Fragmentation', description: 'Structuring licensing agreements that protect content value across a growing number of distribution platforms.' },
      { number: '02.', title: 'Monetization Shifts', description: 'Adapting revenue models as advertising and subscription economics continue to evolve.' },
      { number: '03.', title: 'Content Compliance', description: 'Navigating divergent content regulation and disclosure standards across broadcast markets.' },
      { number: '04.', title: 'Platform Dependency', description: 'Reducing concentration risk from reliance on a small number of major distribution platforms.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Content Value Protection',
    howWeHelpIntro: 'We deploy cross-functional teams combining IP licensing expertise with media distribution structuring.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Cross-platform content regulation and rights law.' },
      { label: 'STRENGTHEN', description: 'Licensing and distribution frameworks.' },
      { label: 'TRANSFORM', description: 'Monetization models for platform diversity.' },
      { label: 'SCALE', description: 'Distribution through structured partnerships.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },

  startups: {
    eyebrow: 'INDUSTRIES',
    industryName: 'Startups',
    heroDescription:
      'Agile advisory for rapid scaling and fundraising, giving founders the governance and financial structure to grow without slowing down.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    understandingQuote:
      "Startups don't fail from lack of ambition — they fail from governance and fundraising structures that can't keep pace with growth.",
    understandingParagraphs: [
      'The startup landscape is defined by compressed fundraising timelines, evolving governance expectations from investors, and the constant tension between speed and structure.',
      'At Advisory Global, we help founders build lightweight but durable governance frameworks that scale alongside the business rather than constraining it.',
      'Our teams bring applied experience in venture financing structures, cap table management, and the fiscal planning unique to high-growth early-stage companies.',
    ],
    challengesIntro: 'Strategic imperatives dictated by the current venture financing environment.',
    challenges: [
      { number: '01.', title: 'Fundraising Structure', description: 'Structuring financing rounds that protect founder control while satisfying investor governance expectations.' },
      { number: '02.', title: 'Cap Table Complexity', description: 'Managing dilution and equity structuring across multiple funding rounds and employee grants.' },
      { number: '03.', title: 'Regulatory Onboarding', description: 'Establishing compliance foundations early enough to avoid costly retrofits at scale.' },
      { number: '04.', title: 'Growth vs. Governance', description: 'Balancing rapid iteration against the governance rigor investors and regulators increasingly expect.' },
    ],
    howWeHelpSubheading: 'Advisory Built Around Founder-Led Growth',
    howWeHelpIntro: 'We deploy cross-functional teams combining venture financing expertise with lightweight governance structuring.',
    howWeHelp: [
      { label: 'NAVIGATE', description: 'Early-stage regulatory and compliance onboarding.' },
      { label: 'STRENGTHEN', description: 'Cap table and fundraising governance.' },
      { label: 'TRANSFORM', description: 'Founder-led decisions into durable structure.' },
      { label: 'SCALE', description: 'Growth through structured capital deployment.' },
    ],
    relatedPracticeAreas: [
      { name: 'Risk & Assurance', slug: 'risk-assurance' },
      { name: 'Tax & Fiscal Advisory', slug: 'tax-fiscal-advisory' },
      { name: 'Corporate Law', slug: 'corporate-law' },
      { name: 'Business Advisory', slug: 'business-advisory' },
    ],
  },
};

const fallbackSlug = 'manufacturing';

export default async function IndustryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [hero, dbDetail] = await Promise.all([
    getPublicHeroSection('industries'),
    getPublicIndustryBySlug(params.slug),
  ]);

  const fallback = defaultIndustryDetails[params.slug] ?? defaultIndustryDetails[fallbackSlug];
  const detail = dbDetail || fallback;

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="bg-[#fdf8f3] px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.9fr]">
          <div>
            <p className="font-mono text-xs tracking-[.18em] text-slate-500 uppercase">
              {hero?.eyebrow || detail.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
              {detail.industryName} Built Around Your Industry&apos;s Reality
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-600 lg:text-lg">
              {detail.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-ink px-5 py-3 text-xs font-bold tracking-wide text-white transition hover:bg-slate-800"
              >
                TALK TO OUR INDUSTRY EXPERTS
              </Link>
              <a
                href="#how-we-help"
                className="flex items-center gap-2 border border-ink px-5 py-3 text-xs font-bold tracking-wide transition hover:bg-slate-100"
              >
                EXPLORE RELEVANT SERVICES
              </a>
            </div>
          </div>
          <div className="overflow-hidden">
            <img
              className="h-[360px] w-full object-cover grayscale lg:h-[460px]"
              src={detail.heroImageUrl}
              alt={detail.industryName}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* UNDERSTANDING THE INDUSTRY */}
      <AnimatedSection className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
              Understanding {detail.industryName}
            </h2>
            <div className="mt-6 h-px w-10 bg-ink" />
            <blockquote className="mt-6 max-w-sm font-serif text-2xl leading-snug text-ink italic lg:text-3xl">
              &ldquo;{detail.understandingQuote}&rdquo;
            </blockquote>
          </div>
          <div className="space-y-6">
            {detail.understandingParagraphs.map((p, i) => (
              <p key={i} className="text-base leading-7 text-slate-600 lg:text-lg">
                {p}
              </p>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CHALLENGES */}
      <AnimatedSection className="bg-navy px-6 py-24 text-white lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-4xl leading-tight lg:text-5xl">
            The Challenges Shaping {detail.industryName}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{detail.challengesIntro}</p>

          <div className="mt-12 border-t border-slate-700">
            <div className="grid gap-x-16 gap-y-10 pt-12 sm:grid-cols-2">
              {detail.challenges.map((c) => (
                <div key={c.number}>
                  <p className="font-mono text-xs tracking-[.14em] text-slate-400">{c.number}</p>
                  <h3 className="mt-3 font-serif text-2xl text-white lg:text-3xl">{c.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-300 lg:text-base">
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* HOW WE HELP + RELATED PRACTICE AREAS */}
      <AnimatedSection id="how-we-help" className="px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.3fr_.9fr]">
          <div>
            <h2 className="max-w-lg font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
              How Advisory Global Helps {detail.industryName}
            </h2>

            <blockquote className="mt-8 max-w-md border-l-2 border-ink pl-5 font-serif text-xl italic leading-snug text-ink lg:text-2xl">
              {detail.howWeHelpSubheading}
            </blockquote>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-600">{detail.howWeHelpIntro}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {detail.howWeHelp.map((item) => (
                <div key={item.label} className="border border-slate-200 p-5">
                  <p className="font-mono text-xs font-bold tracking-[.1em] text-slate-500 uppercase">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit border border-slate-200 p-8">
            <h3 className="font-serif text-2xl text-ink lg:text-3xl">Relevant Practice Areas</h3>
            <div className="mt-6 border-t border-slate-200">
              {detail.relatedPracticeAreas.map((pa) => (
                <Link
                  key={pa.slug}
                  href={`/practice-areas/${pa.slug}`}
                  className="flex items-center justify-between border-b border-slate-200 py-5 font-serif text-xl text-ink transition duration-200 ease-out hover:text-sky-700"
                >
                  {pa.name}
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-slate-400 transition duration-200 ease-out group-hover:translate-x-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="bg-sky-50 px-6 py-24 text-center lg:px-10">
        <h2 className="font-serif text-5xl leading-[1.05] text-ink lg:text-6xl">Let&apos;s Discuss Your Industry.</h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 lg:text-base">
          Schedule a confidential consultation with our sector specialists to architect the optimal
          structural approach for your enterprise.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="border border-ink px-5 py-3 text-center text-xs font-bold tracking-wide transition hover:bg-white"
          >
            TALK TO OUR INDUSTRY EXPERTS
          </Link>
          <Link
            href="/contact"
            className="bg-ink px-5 py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-slate-800"
          >
            BOOK A CONSULTATION
          </Link>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
