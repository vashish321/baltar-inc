import HeroSection from '../components/SavourAndSip/HeroSectionComponent/HeroSection';
import QuickOverviewBanner from '../components/SavourAndSip/QuickOverviewComponent/QuickOverviewBanner';
import AboutTeaser from '../components/SavourAndSip/AboutTeaserComponent/AboutTeaser';
import WhoWeServe from '../components/SavourAndSip/WhoWeServeComponent/WhoWeServe';
import TestimonialSlider from '../components/SavourAndSip/TestimonialComponent/TestimonialSlider';
import CTAFooterBar from '../components/SavourAndSip/CTAFooterComponent/CTAFooterBar';
import Footer from '../components/SavourAndSip/FooterComponent/Footer';

export default function SavourSipPage() {
  return<>
       <HeroSection />
       <QuickOverviewBanner />
       <AboutTeaser />
       <WhoWeServe />
       <TestimonialSlider />
       <CTAFooterBar />
       <Footer/>
        </>
}
