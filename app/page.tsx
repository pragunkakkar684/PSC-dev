import SiteHeader from './components/SiteHeader';
import Hero from './components/Hero';
import Stats from './components/Stats';
import PracticeAreas from './components/PracticeAreas';
import Sectors from './components/Sectors';
import Insights from './components/Insights';
import Team from './components/Team';
import About from './components/About';
import Testimonial from './components/Testimonial';
import Contact from './components/Contact';
import Footer from './components/Footer';
import {
  getPublicHeroSection,
  getPublicPracticeAreas,
  getPublicIndustries,
  getPublicInsights,
  getPublicTeamMembers,
} from '@/lib/queries/public';

export const revalidate = 0;

export default async function Home() {
  const [heroData, practiceData, industryData, insightData, teamData] = await Promise.all([
    getPublicHeroSection('home'),
    getPublicPracticeAreas(),
    getPublicIndustries(),
    getPublicInsights(),
    getPublicTeamMembers(),
  ]);

  return (
    <main>
      <SiteHeader />
      <Hero data={heroData} />
      <Stats />
      <PracticeAreas data={practiceData} />
      <Sectors data={industryData} />
      <Insights data={insightData} />
      <Team  data={teamData}/>
      <About />
      <Testimonial />
      <Contact />
      <Footer />
    </main>
  );
}