import HeroSection from './components/HeroSection/HeroSection';
import DivisionSection from './components/BaltarSections/DivisionSection';
import MetaFooter from './components/MetaStyleComponents/MetaFooter';

export const metadata = {
  title: 'Baltar Inc — One Company. Limitless Services. | Canada',
  description:
    'Baltar Inc is a Canadian multi-division firm operating across technology, hospitality, fashion, and consultancy.',
  alternates: { canonical: 'https://baltar.ca' },
};

const divisions = [
  {
    label: 'Baltar Technologies',
    heading: 'Built to perform. Designed to convert.',
    sub: 'Toronto Media Inc. and Frontend Media Inc. give Canadian businesses the digital infrastructure to compete — fast websites, clean code, and payments that actually work.',
    imgSrc: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    imgPosition: 'center',
    primaryCta: { label: 'See Our Work', href: '/frontend-web-design' },
    secondaryCta: { label: 'Transac Payments', href: '/transac' },
    dark: true,
  },
  {
    label: 'Baltar Hospitality',
    heading: 'The kind of event people talk about afterward.',
    sub: 'Savour & Sip handles the food, the bar, and everything in between — so you can actually be present at your own event. Serving Toronto and the GTA.',
    imgSrc: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80',
    imgPosition: 'center top',
    primaryCta: { label: 'Savour & Sip', href: '/sip-and-savour' },
    secondaryCta: { label: 'Enquire', href: '/sip-and-savour' },
    dark: true,
  },
  {
    label: 'Baltar Fashion',
    heading: 'Eyewear for people who look closely at everything.',
    sub: 'VR is a luxury eyewear and wearable tech label. Each frame is engineered with precision and finished by hand — because the details are the product.',
    imgSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80',
    imgPosition: 'center 30%',
    primaryCta: { label: 'Explore VR', href: '/vr' },
    secondaryCta: { label: 'Le Mode Co.', href: '/le-mode-co' },
    dark: true,
  },
  {
    label: 'Baltar Consultancy',
    heading: 'Clear thinking for complex problems.',
    sub: 'Baltar Consulting handles structural engineering and project management. Baltar International advises on cross-border markets, M&A, and global operations.',
    imgSrc: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80',
    imgPosition: 'center 40%',
    primaryCta: { label: 'Baltar Consulting', href: '/baltar-engineering' },
    secondaryCta: { label: 'Baltar International', href: '/baltar-international' },
    dark: true,
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <div id="divisions">
        {divisions.map((div) => (
          <DivisionSection key={div.label} {...div} />
        ))}
      </div>
      <MetaFooter />
    </>
  );
}
