import HeroSection from './components/HeroComponent/HeroSection';
import TechnologiesSection from './components/BaltarSections/TechnologiesSection';
import HospitalitySection from './components/BaltarSections/HospitalitySection';
import EngineeringSection from './components/BaltarSections/EngineeringSection';
import FinanceSection from './components/BaltarSections/FinanceSection';
import FashionSection from './components/BaltarSections/FashionSection';
import MediaSection from './components/BaltarSections/MediaSection';
import ContactSection from './components/BaltarSections/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TechnologiesSection />
      <HospitalitySection />
      <EngineeringSection />
      <FinanceSection />
      <FashionSection />
      <MediaSection />
      <ContactSection />
    </>
  );
}
