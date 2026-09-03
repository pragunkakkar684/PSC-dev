import {
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import SiteHeader from '../../components/SiteHeader';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';
import Link from 'next/link';
import {
  getPublicHeroSection,
  getPublicPracticeAreaBySlug, 
} from '@/lib/queries/public';

type Challenge = { number: string; title: string; description: string };
type Phase = { phase: string; title: string; description: string };
type Deliverable = { number: string; title: string; description: string };
type Advisor = {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  coreExpertise: string[];
  industryExperience: string[];
};
type Insight = { category: string; date: string; title: string; imageUrl: string };
type Faq = { question: string; answer: string };

type PracticeAreaDetail = {
  number: string;
  eyebrow: string;
  serviceName: string;
  heroHeading: string;
  heroDescription: string;
  heroImageUrl: string;
  challenges: Challenge[];
  approachIntro: string;
  phases: Phase[];
  deliverIntro: string;
  deliverables: Deliverable[];
  industries: string[];
  advisor: Advisor;
  insights: Insight[];
  faqs: Faq[];
};

const sharedIndustries = [
  'Financial Services',
  'Healthcare & Life Sciences',
  'Technology & Media',
  'Energy & Utilities',
  'Manufacturing',
  'Real Estate',
  'Retail & Consumer Goods',
  'Private Equity',
];

const defaultPracticeAreaDetails: Record<string, PracticeAreaDetail> = {
  'risk-assurance': {
    number: '01',
    eyebrow: 'RISK & ASSURANCE',
    serviceName: 'Risk & Assurance',
    heroHeading: 'Risk & Assurance For More Confident Business Decisions.',
    heroDescription:
      'In an environment characterized by volatility and regulatory scrutiny, Risk & Assurance provides the structural clarity required to mitigate risk, optimize operations, and unlock sustainable growth. We build frameworks that endure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=85',
    challenges: [
      { number: '01.', title: 'Regulatory Complexity', description: 'Navigating evolving audit and disclosure frameworks without compromising operational agility.' },
      { number: '02.', title: 'Operational Inefficiency', description: 'Identifying and eliminating control gaps and redundant oversight across disparate business units.' },
      { number: '03.', title: 'Risk Exposure', description: 'Mitigating unquantified vulnerabilities inherent in legacy systems, fraud, or rapid expansion.' },
      { number: '04.', title: 'Strategic Alignment', description: 'Ensuring governance mechanisms are directly calibrated to overarching strategic intent.' },
    ],
    approachIntro:
      'We reject commoditized audit checklists. Every engagement is architected specifically for your organizational reality, prioritizing measurable rigor over box-ticking.',
    phases: [
      { phase: 'PHASE I', title: 'Understand', description: 'We conduct exhaustive diagnostics of your current control environment, identifying friction points and latent vulnerabilities before formulating hypotheses.' },
      { phase: 'PHASE II', title: 'Advise', description: 'We design robust, context-aware assurance frameworks that address root causes. Our recommendations are structurally sound, financially modeled, and inherently executable.' },
      { phase: 'PHASE III', title: 'Deliver', description: 'We partner with your leadership to embed the new controls into daily operations, ensuring theoretical value translates into realized structural advantage.' },
    ],
    deliverIntro:
      'Within the Risk & Assurance domain, we provide specialized capabilities designed to resolve specific structural imperatives.',
    deliverables: [
      { number: '01', title: 'Statutory Audit', description: 'Independent financial statement audits conducted to the highest standards of accuracy and regulatory compliance.' },
      { number: '02', title: 'Internal Audit & Controls', description: 'Ongoing evaluation and strengthening of internal control environments to reduce operational and financial risk.' },
      { number: '03', title: 'Forensic Audit', description: 'Deep-dive investigative audits that uncover fraud, misstatement, and governance failures.' },
      { number: '04', title: 'Risk Assessment', description: 'Structured enterprise risk assessments that quantify exposure and prioritize mitigation across the organization.' },
    ],
    industries: sharedIndustries,
    advisor: {
      name: 'Eleanor Vance',
      title: 'Managing Partner, Risk & Assurance',
      bio: 'Eleanor Vance leads the Risk & Assurance group at PSC Global. With over 18 years of experience architecting control and audit frameworks for enterprise clients, she specializes in translating complex regulatory and operational requirements into actionable, enduring frameworks.',
      imageUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=85',
      coreExpertise: ['Statutory Audit', 'Internal Controls', 'Forensic Investigation'],
      industryExperience: ['Financial Services', 'Manufacturing', 'Private Equity'],
    },
    insights: [
      { category: 'REGULATORY UPDATE', date: 'Aug 2026', title: 'What New Disclosure Mandates Mean for Internal Audit Teams', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85' },
      { category: 'CASE STUDY', date: 'Jul 2026', title: 'Rebuilding Controls After a Cross-Border Acquisition', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=85' },
      { category: 'INSIGHT', date: 'Jun 2026', title: 'The Rising Cost of Reactive Risk Management', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85' },
    ],
    faqs: [
      { question: 'What is the typical duration of a Risk & Assurance engagement?', answer: 'Engagement length depends on scope and organizational complexity. A focused diagnostic typically runs 4–6 weeks, while a full understand–advise–deliver engagement spans several months.' },
      { question: 'How does PSC Global differ from traditional audit firms?', answer: 'We integrate legal, tax, and operational expertise into a single engagement team rather than handing clients between siloed specialists, so recommendations are structurally and financially coherent from day one.' },
      { question: 'Do you assist with the implementation of your recommendations?', answer: 'Yes. Our Deliver phase embeds our team alongside your leadership to operationalize the new controls, not just hand over a report.' },
      { question: 'How do you integrate assurance solutions with existing organizational silos?', answer: 'We map existing ownership and decision rights before designing anything new, so the resulting framework works with your governance structure rather than against it.' },
      { question: 'What metrics do you use to measure the success of an engagement?', answer: 'Success criteria are defined jointly during the Understand phase — typically a mix of risk-reduction, control-maturity, and compliance metrics tied to your original objectives.' },
    ],
  },

  'tax-fiscal-advisory': {
    number: '02',
    eyebrow: 'TAX & FISCAL ADVISORY',
    serviceName: 'Tax & Fiscal Advisory',
    heroHeading: 'Tax & Fiscal Advisory For More Confident Business Decisions.',
    heroDescription:
      'In an environment characterized by volatility and regulatory scrutiny, Tax & Fiscal Advisory provides the structural clarity required to mitigate risk, optimize operations, and unlock sustainable growth. We build frameworks that endure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    challenges: [
      { number: '01.', title: 'Regulatory Complexity', description: 'Navigating evolving tax jurisdictional frameworks without compromising operational agility.' },
      { number: '02.', title: 'Operational Inefficiency', description: 'Identifying and eliminating structural redundancies across disparate tax and finance functions.' },
      { number: '03.', title: 'Risk Exposure', description: 'Mitigating unquantified tax vulnerabilities inherent in legacy structures or rapid expansion.' },
      { number: '04.', title: 'Strategic Alignment', description: 'Ensuring fiscal structuring is directly calibrated to overarching strategic intent.' },
    ],
    approachIntro:
      'We reject commoditized tax filing. Every engagement is architected specifically for your organizational reality, prioritizing measurable efficiency over generic tax planning.',
    phases: [
      { phase: 'PHASE I', title: 'Understand', description: 'We conduct exhaustive diagnostics of your current fiscal architecture, identifying friction points and latent vulnerabilities before formulating hypotheses.' },
      { phase: 'PHASE II', title: 'Advise', description: 'We design robust, context-aware tax frameworks that address root causes. Our recommendations are structurally sound, financially modeled, and inherently executable.' },
      { phase: 'PHASE III', title: 'Deliver', description: 'We partner with your leadership to embed the new fiscal architecture into daily operations, ensuring theoretical value translates into realized structural advantage.' },
    ],
    deliverIntro:
      'Within the Tax & Fiscal Advisory domain, we provide specialized capabilities designed to resolve specific structural imperatives.',
    deliverables: [
      { number: '01', title: 'Direct Taxation', description: 'Corporate income tax planning and compliance structured for efficiency across jurisdictions.' },
      { number: '02', title: 'Indirect Tax (GST/VAT)', description: 'Managing indirect tax obligations across supply chains and cross-border transactions.' },
      { number: '03', title: 'International Taxation', description: 'Structuring cross-border operations to satisfy overlapping tax treaty and residency requirements.' },
      { number: '04', title: 'Transfer Pricing', description: 'Defensible transfer pricing policies that withstand regulatory scrutiny across multiple markets.' },
    ],
    industries: sharedIndustries,
    advisor: {
      name: 'Sarah Jenkins',
      title: 'Partner, Tax Strategy',
      bio: 'Sarah Jenkins leads the Tax & Fiscal Advisory group at PSC Global. With over 15 years of experience architecting fiscal solutions for enterprise clients, she specializes in translating complex regulatory and operational requirements into actionable, enduring frameworks.',
      imageUrl:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=85',
      coreExpertise: ['International Taxation', 'Transfer Pricing', 'Indirect Tax'],
      industryExperience: ['Technology & Media', 'Retail & Consumer Goods', 'Energy & Utilities'],
    },
    insights: [
      { category: 'REGULATORY UPDATE', date: 'Aug 2026', title: 'Preparing Corporate Treasuries for BEPS 2.0 Implementation', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=85' },
      { category: 'CASE STUDY', date: 'Jul 2026', title: 'Restructuring Transfer Pricing After a Multi-Market Expansion', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85' },
      { category: 'INSIGHT', date: 'Jun 2026', title: 'Indirect Tax Complexity in Cross-Border E-Commerce', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85' },
    ],
    faqs: [
      { question: 'What is the typical duration of a Tax & Fiscal Advisory engagement?', answer: 'Engagement length depends on scope and organizational complexity. A focused diagnostic typically runs 4–6 weeks, while a full understand–advise–deliver engagement spans several months.' },
      { question: 'How does PSC Global differ from traditional tax consultancies?', answer: 'We integrate legal, audit, and operational expertise into a single engagement team rather than handing clients between siloed specialists, so recommendations are structurally and financially coherent from day one.' },
      { question: 'Do you assist with the implementation of your recommendations?', answer: 'Yes. Our Deliver phase embeds our team alongside your leadership to operationalize the new fiscal framework, not just hand over a report.' },
      { question: 'How do you integrate tax solutions with existing organizational silos?', answer: 'We map existing ownership and decision rights before designing anything new, so the resulting framework works with your governance structure rather than against it.' },
      { question: 'What metrics do you use to measure the success of an engagement?', answer: 'Success criteria are defined jointly during the Understand phase — typically a mix of tax-efficiency, compliance, and risk metrics tied to your original objectives.' },
    ],
  },

  'corporate-law': {
    number: '03',
    eyebrow: 'CORPORATE LAW',
    serviceName: 'Corporate Law',
    heroHeading: 'Corporate Law For More Confident Business Decisions.',
    heroDescription:
      'In an environment characterized by volatility and regulatory scrutiny, Corporate Law provides the structural clarity required to mitigate risk, optimize operations, and unlock sustainable growth. We build frameworks that endure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85',
    challenges: [
      { number: '01.', title: 'Regulatory Complexity', description: 'Navigating evolving corporate and contract law frameworks without compromising operational agility.' },
      { number: '02.', title: 'Operational Inefficiency', description: 'Identifying and eliminating structural redundancies across disparate legal and compliance functions.' },
      { number: '03.', title: 'Risk Exposure', description: 'Mitigating unquantified legal vulnerabilities inherent in legacy contracts or rapid expansion.' },
      { number: '04.', title: 'Strategic Alignment', description: 'Ensuring legal structuring is directly calibrated to overarching strategic intent.' },
    ],
    approachIntro:
      'We reject commoditized legal templates. Every engagement is architected specifically for your organizational reality, prioritizing measurable certainty over boilerplate documentation.',
    phases: [
      { phase: 'PHASE I', title: 'Understand', description: 'We conduct exhaustive diagnostics of your current legal architecture, identifying friction points and latent vulnerabilities before formulating hypotheses.' },
      { phase: 'PHASE II', title: 'Advise', description: 'We design robust, context-aware legal frameworks that address root causes. Our recommendations are structurally sound, financially modeled, and inherently executable.' },
      { phase: 'PHASE III', title: 'Deliver', description: 'We partner with your leadership to embed the new legal architecture into daily operations, ensuring theoretical value translates into realized structural advantage.' },
    ],
    deliverIntro:
      'Within the Corporate Law domain, we provide specialized capabilities designed to resolve specific structural imperatives.',
    deliverables: [
      { number: '01', title: 'Corporate Structuring', description: 'Entity formation and governance design that balances liability protection with operational flexibility.' },
      { number: '02', title: 'Contract Advisory', description: 'Drafting and negotiating commercial contracts that protect your position without slowing deal velocity.' },
      { number: '03', title: 'Dispute Resolution', description: 'Managing litigation and arbitration strategy to resolve disputes efficiently and protect enterprise value.' },
      { number: '04', title: 'Regulatory Filings', description: 'Ensuring statutory and regulatory filings are accurate, timely, and defensible under audit.' },
    ],
    industries: sharedIndustries,
    advisor: {
      name: 'Marcus Chen',
      title: 'Head of Regulatory Compliance',
      bio: 'Marcus Chen leads the Corporate Law group at PSC Global. With over 16 years of experience architecting legal solutions for enterprise clients, he specializes in translating complex regulatory and operational requirements into actionable, enduring frameworks.',
      imageUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
      coreExpertise: ['Corporate Structuring', 'Contract Law', 'Regulatory Filings'],
      industryExperience: ['Healthcare & Life Sciences', 'Real Estate', 'Manufacturing'],
    },
    insights: [
      { category: 'REGULATORY UPDATE', date: 'Aug 2026', title: 'Corporate Governance Standards Are Tightening Globally', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85' },
      { category: 'CASE STUDY', date: 'Jul 2026', title: 'Restructuring Entity Ownership Ahead of a Cross-Border Merger', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85' },
      { category: 'INSIGHT', date: 'Jun 2026', title: 'Why Contract Governance Fails at Scale', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=85' },
    ],
    faqs: [
      { question: 'What is the typical duration of a Corporate Law engagement?', answer: 'Engagement length depends on scope and organizational complexity. A focused diagnostic typically runs 4–6 weeks, while a full understand–advise–deliver engagement spans several months.' },
      { question: 'How does PSC Global differ from traditional law firms?', answer: 'We integrate tax, audit, and operational expertise into a single engagement team rather than handing clients between siloed specialists, so recommendations are structurally and financially coherent from day one.' },
      { question: 'Do you assist with the implementation of your recommendations?', answer: 'Yes. Our Deliver phase embeds our team alongside your leadership to operationalize the new legal framework, not just hand over a report.' },
      { question: 'How do you integrate legal solutions with existing organizational silos?', answer: 'We map existing ownership and decision rights before designing anything new, so the resulting framework works with your governance structure rather than against it.' },
      { question: 'What metrics do you use to measure the success of an engagement?', answer: 'Success criteria are defined jointly during the Understand phase — typically a mix of risk-reduction, compliance, and contract-efficiency metrics tied to your original objectives.' },
    ],
  },

  'business-advisory': {
    number: '04',
    eyebrow: 'BUSINESS ADVISORY',
    serviceName: 'Business Advisory',
    heroHeading: 'Business Advisory For More Confident Business Decisions.',
    heroDescription:
      'In an environment characterized by volatility and regulatory scrutiny, Business Advisory provides the structural clarity required to mitigate risk, optimize operations, and unlock sustainable growth. We build frameworks that endure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=85',
    challenges: [
      { number: '01.', title: 'Regulatory Complexity', description: 'Navigating evolving market entry and expansion frameworks without compromising operational agility.' },
      { number: '02.', title: 'Operational Inefficiency', description: 'Identifying and eliminating structural redundancies across disparate business units.' },
      { number: '03.', title: 'Risk Exposure', description: 'Mitigating unquantified strategic vulnerabilities inherent in legacy positioning or rapid expansion.' },
      { number: '04.', title: 'Strategic Alignment', description: 'Ensuring execution mechanisms are directly calibrated to overarching strategic intent.' },
    ],
    approachIntro:
      'We reject commoditized strategy decks. Every engagement is architected specifically for your organizational reality, prioritizing measurable outcomes over theoretical frameworks.',
    phases: [
      { phase: 'PHASE I', title: 'Understand', description: 'We conduct exhaustive diagnostics of your current market position, identifying friction points and latent opportunities before formulating hypotheses.' },
      { phase: 'PHASE II', title: 'Advise', description: 'We design robust, context-aware strategic frameworks that address root causes. Our recommendations are structurally sound, financially modeled, and inherently executable.' },
      { phase: 'PHASE III', title: 'Deliver', description: 'We partner with your leadership to embed the new strategy into daily operations, ensuring theoretical value translates into realized structural advantage.' },
    ],
    deliverIntro:
      'Within the Business Advisory domain, we provide specialized capabilities designed to resolve specific structural imperatives.',
    deliverables: [
      { number: '01', title: 'Market Entry Strategy', description: 'Structured go-to-market planning for organizations entering new geographic or sector markets.' },
      { number: '02', title: 'Feasibility Studies', description: 'Rigorous financial and operational feasibility analysis before major capital commitments.' },
      { number: '03', title: 'Valuation Advisory', description: 'Independent valuation support for transactions, disputes, and strategic planning purposes.' },
      { number: '04', title: 'Performance Improvement', description: 'Diagnosing and resolving underperformance across operational and financial dimensions.' },
    ],
    industries: sharedIndustries,
    advisor: {
      name: 'David Sterling',
      title: 'Senior Economic Advisor',
      bio: 'David Sterling leads the Business Advisory group at PSC Global. With over 20 years of experience architecting strategic solutions for enterprise clients, he specializes in translating complex regulatory and operational requirements into actionable, enduring frameworks.',
      imageUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85',
      coreExpertise: ['Market Entry Strategy', 'Valuation Advisory', 'Performance Improvement'],
      industryExperience: ['Private Equity', 'Technology & Media', 'Retail & Consumer Goods'],
    },
    insights: [
      { category: 'INDUSTRY INSIGHT', date: 'Aug 2026', title: 'What Determines Market Entry Success in Emerging Economies', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85' },
      { category: 'CASE STUDY', date: 'Jul 2026', title: 'Turning Around Underperformance in a Regional Retail Chain', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85' },
      { category: 'INSIGHT', date: 'Jun 2026', title: 'Why Feasibility Studies Fail to Predict Real-World Costs', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=85' },
    ],
    faqs: [
      { question: 'What is the typical duration of a Business Advisory engagement?', answer: 'Engagement length depends on scope and organizational complexity. A focused diagnostic typically runs 4–6 weeks, while a full understand–advise–deliver engagement spans several months.' },
      { question: 'How does PSC Global differ from traditional management consultancies?', answer: 'We integrate legal, tax, and operational expertise into a single engagement team rather than handing clients between siloed specialists, so recommendations are structurally and financially coherent from day one.' },
      { question: 'Do you assist with the implementation of your recommendations?', answer: 'Yes. Our Deliver phase embeds our team alongside your leadership to operationalize the new strategy, not just hand over a report.' },
      { question: 'How do you integrate advisory solutions with existing organizational silos?', answer: 'We map existing ownership and decision rights before designing anything new, so the resulting framework works with your governance structure rather than against it.' },
      { question: 'What metrics do you use to measure the success of an engagement?', answer: 'Success criteria are defined jointly during the Understand phase — typically a mix of growth, efficiency, and risk-reduction metrics tied to your original objectives.' },
    ],
  },

  'business-process-advisory': {
    number: '05',
    eyebrow: 'BUSINESS PROCESS ADVISORY',
    serviceName: 'Business Process Advisory',
    heroHeading: 'Business Process Advisory For More Confident Business Decisions.',
    heroDescription:
      'In an environment characterized by volatility and regulatory scrutiny, Business Process Advisory provides the structural clarity required to mitigate risk, optimize operations, and unlock sustainable growth. We build frameworks that endure.',
    heroImageUrl:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=85',
    challenges: [
      { number: '01.', title: 'Regulatory Complexity', description: 'Navigating evolving operational compliance frameworks without compromising process agility.' },
      { number: '02.', title: 'Operational Inefficiency', description: 'Identifying and eliminating structural redundancies across disparate operational units.' },
      { number: '03.', title: 'Risk Exposure', description: 'Mitigating unquantified process vulnerabilities inherent in legacy systems or rapid scale-up.' },
      { number: '04.', title: 'Strategic Alignment', description: 'Ensuring process design is directly calibrated to overarching strategic intent.' },
    ],
    approachIntro:
      'We reject commoditized process templates. Every engagement is architected specifically for your organizational reality, prioritizing measurable throughput over theoretical elegance.',
    phases: [
      { phase: 'PHASE I', title: 'Understand', description: 'We conduct exhaustive diagnostics of your current operational architecture, identifying friction points and latent inefficiencies before formulating hypotheses.' },
      { phase: 'PHASE II', title: 'Advise', description: 'We design robust, context-aware process frameworks that address root causes. Our recommendations are structurally sound, financially modeled, and inherently executable.' },
      { phase: 'PHASE III', title: 'Deliver', description: 'We partner with your leadership to embed the new process architecture into daily operations, ensuring theoretical value translates into realized structural advantage.' },
    ],
    deliverIntro:
      'Within the Business Process Advisory domain, we provide specialized capabilities designed to resolve specific structural imperatives.',
    deliverables: [
      { number: '01', title: 'ERP Implementation', description: 'End-to-end ERP rollout planning and execution that minimizes disruption to ongoing operations.' },
      { number: '02', title: 'Process Outsourcing', description: 'Structuring outsourced operational functions with clear governance and performance accountability.' },
      { number: '03', title: 'Shared Services Design', description: 'Building shared services models that consolidate back-office functions without sacrificing responsiveness.' },
      { number: '04', title: 'Automation & RPA', description: 'Deploying robotic process automation to eliminate manual bottlenecks and reduce error rates.' },
    ],
    industries: sharedIndustries,
    advisor: {
      name: 'Elena Rostova',
      title: 'Director, Tech & Startups',
      bio: 'Elena Rostova leads the Business Process Advisory group at PSC Global. With over 12 years of experience architecting operational solutions for enterprise clients, she specializes in translating complex regulatory and operational requirements into actionable, enduring frameworks.',
      imageUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=85',
      coreExpertise: ['ERP Implementation', 'Process Automation', 'Shared Services Design'],
      industryExperience: ['Manufacturing', 'Financial Services', 'Technology & Media'],
    },
    insights: [
      { category: 'INDUSTRY INSIGHT', date: 'Aug 2026', title: 'Why Most ERP Rollouts Exceed Their Original Timeline', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=85' },
      { category: 'CASE STUDY', date: 'Jul 2026', title: 'Cutting Processing Time in Half With Targeted RPA Deployment', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85' },
      { category: 'INSIGHT', date: 'Jun 2026', title: 'Designing Shared Services That Actually Reduce Cost', imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=85' },
    ],
    faqs: [
      { question: 'What is the typical duration of a Business Process Advisory engagement?', answer: 'Engagement length depends on scope and organizational complexity. A focused diagnostic typically runs 4–6 weeks, while a full understand–advise–deliver engagement spans several months.' },
      { question: 'How does PSC Global differ from traditional process consultancies?', answer: 'We integrate legal, tax, and audit expertise into a single engagement team rather than handing clients between siloed specialists, so recommendations are structurally and financially coherent from day one.' },
      { question: 'Do you assist with the implementation of your recommendations?', answer: 'Yes. Our Deliver phase embeds our team alongside your leadership to operationalize the new process architecture, not just hand over a report.' },
      { question: 'How do you integrate process solutions with existing organizational silos?', answer: 'We map existing ownership and decision rights before designing anything new, so the resulting framework works with your governance structure rather than against it.' },
      { question: 'What metrics do you use to measure the success of an engagement?', answer: 'Success criteria are defined jointly during the Understand phase — typically a mix of throughput, cost-reduction, and error-rate metrics tied to your original objectives.' },
    ],
  },
};

const fallbackSlug = 'risk-assurance';

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [hero, dbDetail] = await Promise.all([
    getPublicHeroSection('practice-areas'),
    getPublicPracticeAreaBySlug(params.slug),
  ]);

  const fallback = defaultPracticeAreaDetails[params.slug] ?? defaultPracticeAreaDetails[fallbackSlug];
  const detail: any = dbDetail || fallback;

  return (
    <main id="top">
      <SiteHeader />

      {/* HERO */}
      <AnimatedSection className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <span className="inline-block bg-navy px-3 py-1 font-mono text-xs tracking-[.14em] text-white">
          {detail.eyebrow}
        </span>
        <h1 className="mt-6 max-w-3xl font-serif text-6xl leading-[1.02] tracking-[-.045em] text-ink sm:text-7xl">
          {detail.heroHeading}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 lg:text-lg">
          {detail.heroDescription}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="flex items-center gap-2 bg-ink px-5 py-3 text-sm font-medium text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-slate-800"
          >
            Talk to an Expert <ArrowRight size={16} />
          </Link>
          <a
            href="#deliver"
            className="flex items-center gap-2 border border-ink px-5 py-3 text-sm font-medium transition duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-slate-100"
          >
            Explore Solutions
          </a>
        </div>
      </AnimatedSection>

      {/* CHALLENGES */}
      <AnimatedSection className="bg-[#fdf8f3] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-ink lg:text-5xl">
            The Challenges Businesses Face
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Our clients typically engage us when structural complexity threatens operational
            efficiency or strategic objectives.
          </p>

          <div className="mt-12 grid border-t border-slate-300 md:grid-cols-2 lg:grid-cols-4">
            {(detail.challenges || []).map((c: any) => (
              <div key={c.number} className="border-l border-slate-300 p-6 first:border-l-0 lg:p-8">
                <p className="font-serif text-2xl text-slate-400">{c.number}</p>
                <h3 className="mt-4 font-serif text-xl text-ink lg:text-2xl">{c.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* APPROACH */}
      <AnimatedSection className="px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.4fr]">
          <div>
            <h2 className="font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
              Our Approach — Solutions Designed Around Your Business.
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-600">{detail.approachIntro}</p>
          </div>

          <div className="border-t border-slate-200">
            {(detail.phases || []).map((p: any) => (
              <div
                key={p.phase}
                className="grid gap-2 border-b border-slate-200 py-8 sm:grid-cols-[140px_1fr] sm:gap-8"
              >
                <div>
                  <p className="font-mono text-xs tracking-[.14em] text-sky-700">{p.phase}</p>
                  <p className="mt-2 font-serif text-2xl text-ink lg:text-3xl">{p.title}</p>
                </div>
                <p className="text-sm leading-6 text-slate-600 lg:text-base">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* WHAT WE DELIVER */}
      <AnimatedSection id="deliver" className="border-t border-slate-200 px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.4fr]">
          <div>
            <h2 className="font-serif text-4xl text-ink lg:text-5xl">What We Deliver</h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-600">{detail.deliverIntro}</p>
          </div>

          <div>
            {(detail.deliverables || []).map((d: any) => (
              <div
                key={d.number}
                className="grid gap-2 border-t border-slate-200 py-8 first:border-t-0 sm:grid-cols-[70px_1fr] sm:gap-8"
              >
                <p className="font-serif text-2xl text-slate-400">{d.number}</p>
                <div>
                  <h3 className="font-serif text-2xl text-ink lg:text-3xl">{d.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 lg:text-base">
                    {d.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* INDUSTRIES WE SERVE */}
      <AnimatedSection className="bg-slate-100 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-4xl text-ink lg:text-5xl">Industries We Serve</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Structural requirements vary by sector. We apply our {detail.serviceName ?? detail.eyebrow}{' '}
            expertise with deep contextual knowledge of the following industries.
          </p>

          <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {(detail.industries || []).map((industry: any) => (
              <a
                key={industry}
                href="#"
                className="group flex items-center justify-between border-b border-slate-300 pb-4 font-serif text-xl text-ink transition duration-200 ease-out hover:text-sky-700"
              >
                {industry}
                <ArrowRight
                  size={18}
                  className="shrink-0 text-slate-400 transition duration-200 ease-out group-hover:translate-x-1 group-hover:text-sky-700"
                />
              </a>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* MEET YOUR ADVISOR */}
      {detail.advisor && (
        <AnimatedSection className="px-6 py-24 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src={detail.advisor.imageUrl}
                alt={detail.advisor.name}
                className="h-full w-full object-cover grayscale"
              />
            </div>

            <div>
              <p className="font-mono text-xs tracking-[.18em] text-sky-700">MEET YOUR ADVISOR</p>
              <h2 className="mt-4 font-serif text-5xl leading-tight text-ink lg:text-6xl">
                {detail.advisor.name}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{detail.advisor.title}</p>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-600">{detail.advisor.bio}</p>

              <div className="mt-8 grid max-w-md grid-cols-2 gap-8 border-t border-slate-300 pt-8">
                <div>
                  <p className="font-mono text-xs tracking-[.14em] text-slate-500">CORE EXPERTISE</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {(detail.advisor.coreExpertise || []).map((item: any) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-xs tracking-[.14em] text-slate-500">INDUSTRY EXPERIENCE</p>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {(detail.advisor.industryExperience || []).map((item: any) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="#"
                className="mt-8 inline-flex items-center gap-2 font-mono text-xs tracking-[.1em] text-ink transition duration-200 ease-out hover:text-sky-700"
              >
                VIEW FULL PROFILE <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* INSIGHTS & PERSPECTIVES */}
      <AnimatedSection className="border-t border-slate-200 px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-4xl text-ink lg:text-5xl">Insights &amp; Perspectives</h2>
              <p className="mt-3 max-w-md text-base leading-7 text-slate-600">
                Latest structural thinking on {detail.serviceName ?? detail.eyebrow}.
              </p>
            </div>
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[.1em] text-ink transition duration-200 ease-out hover:text-sky-700"
            >
              VIEW ALL INSIGHTS <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {(detail.insights || []).map((post: any, i: number) => (
              <article key={i}>
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover grayscale transition duration-300 ease-out hover:grayscale-0"
                  />
                </div>
                <p className="mt-4 font-mono text-xs tracking-[.14em] text-slate-400">
                  {post.category} · {post.date}
                </p>
                <h3 className="mt-3 font-serif text-xl leading-tight text-ink lg:text-2xl">
                  {post.title}
                </h3>
                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-[.1em] text-ink transition duration-200 ease-out hover:text-sky-700"
                >
                  READ ARTICLE <ArrowRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection className="bg-slate-100 px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.4fr]">
          <div>
            <h2 className="font-serif text-4xl leading-[1.05] text-ink lg:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-slate-600">
              Common inquiries regarding our {detail.serviceName ?? detail.eyebrow} methodology and
              engagement structures.
            </p>
          </div>

          <div className="border-t border-slate-300">
            {(detail.faqs || []).map((faq: any, i: number) => (
              <details key={i} className="group border-b border-slate-300 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-serif text-lg text-ink lg:text-xl">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-slate-500 transition duration-200 ease-out group-open:rotate-180"
                  />
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 lg:text-base">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
