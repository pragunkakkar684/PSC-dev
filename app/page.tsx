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

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <Stats />
      <PracticeAreas />
      <Sectors />
      <Insights />
      <Team />
      <About />
      <Testimonial />
      <Contact />
      <Footer />
    </main>
  );
}