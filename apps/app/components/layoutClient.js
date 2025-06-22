'use client';

import { usePathname } from 'next/navigation';
import Navbar from './NavBarComponent/Navbar';
import Footer from './FooterComponent/Footer';
import MetaHeader from './MetaStyleComponents/MetaHeader';
import MetaFooter from './MetaStyleComponents/MetaFooter';
import TransacHeader from './Transac/HeaderComponent/TransacHeader';
import FrontendHeader from './FrontendWebDesign/HeaderComponent/HeaderComponent';
import PageLoader from './SavourAndSip/PageAnimationComponent/PageAnimation'; // ✅ Import loader

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isTransac = pathname === '/transac';
  const isFrontendDesign = pathname === '/frontend-web-design';
  const isComingSoonPage = pathname === '/coming-soon';
  const isAuthPage = pathname === '/signup' || pathname === '/login';
  const isTransacComingSoonPage = pathname === '/transac-coming-soon';
  const isFrontendComingSoonPage = pathname === '/frontend-web-design-comingsoon';
  const isFrontendContactUsPage = pathname === '/frontend-web-design-contact-us';
  const isLeModeCoPage = pathname === '/le-mode-co';
  const isLeModeCoComingSoonPage = pathname === '/le-mode-co-comingsoon';
  const isLeModeCoContactUsPage = pathname === '/le-mode-co-contact-us';
  const isSavourAndSip = pathname === '/sip-and-savour';
  const isSavourAndSipComingSoonPage = pathname === '/savour-and-sip-coming-soon';

  // Savour & Sip pages
  const isSavourAboutPage = pathname === '/sip-and-savour/about';
  const isSavourServicesPage = pathname === '/sip-and-savour/services';
  const isSavourEventsPage = pathname === '/sip-and-savour/events';
  const isSavourMenuPage = pathname === '/sip-and-savour/menu';
  const isSavourPricingPage = pathname === '/sip-and-savour/pricing';

  // Check if any Savour & Sip page
  const isAnySavourPage = isSavourAndSip || isSavourAboutPage || isSavourServicesPage ||
                         isSavourEventsPage || isSavourMenuPage || isSavourPricingPage;
  const isConsumerPulsepage = pathname === '/consumer-pulse';
  const isConsumerPulseLoginpage = pathname === '/consumer-pulse-signin';
  const isConsumerPulseSignuppage = pathname === '/consumer-pulse-signup';
  const isConsumerPulseComingSoonpage = pathname === '/consumer-pulse-comingsoon';
  const isVRpage = pathname === '/vr';

  // New coming soon pages
  const isContactUsPage = pathname === '/contact-us';
  const isServicesPage = pathname === '/services';
  const isCre8iveStudioComingSoonPage = pathname === '/cre8ive-studio-comingsoon';
  const isArchonEngineeringComingSoonPage = pathname === '/archon-engineering-comingsoon';
  const isBaltarFinanceComingSoonPage = pathname === '/baltar-finance-comingsoon';
  const isZeitgeistMediaComingSoonPage = pathname === '/zeitgeist-media-comingsoon';
  const isAboutComingSoonPage = pathname === '/about-comingsoon';
  const isCareersComingSoonPage = pathname === '/careers-comingsoon';
  const isPrivacyPolicyPage = pathname === '/privacy-policy';
  const isTermsOfServicePage = pathname === '/terms-of-service';
  const isCookiesPage = pathname === '/cookies';

  // Group all new coming soon pages
  const isAnyNewComingSoonPage = isCre8iveStudioComingSoonPage || isArchonEngineeringComingSoonPage ||
                                isBaltarFinanceComingSoonPage || isZeitgeistMediaComingSoonPage ||
                                isAboutComingSoonPage || isCareersComingSoonPage || isPrivacyPolicyPage ||
                                isTermsOfServicePage || isCookiesPage || isServicesPage;

  // Dashboard pages that should not have default headers/footers
  const isClientDashboard = pathname === '/client-dashboard';

  // Check if any admin page (including nested routes) - comprehensive check
  const isAnyAdminPage = pathname.startsWith('/admin');

  // Frontend Web Design pages
  const isFrontendAboutPage = pathname === '/frontend-web-design/about';
  const isFrontendServicesPage = pathname === '/frontend-web-design/services';
  const isFrontendPortfolioPage = pathname === '/frontend-web-design/portfolio';
  const isFrontendPricingPage = pathname === '/frontend-web-design/pricing';
  const isFrontendFAQPage = pathname === '/frontend-web-design/faq';
  const isFrontendClientPortalPage = pathname === '/frontend-web-design/client-portal';

  // Check if any frontend web design page
  const isAnyFrontendPage = isFrontendDesign || isFrontendAboutPage || isFrontendServicesPage ||
                           isFrontendPortfolioPage || isFrontendPricingPage || isFrontendFAQPage ||
                           isFrontendClientPortalPage || isFrontendContactUsPage || isFrontendComingSoonPage;

  return (
    <div className="w-full overflow-x-hidden bg-black text-white font-sans min-h-screen">
      {/* ✅ Special handling for dashboard pages - no headers/footers */}
      {isAnyAdminPage || isClientDashboard ? (
        <main className="w-full">{children}</main>
      ) :
      /* ✅ Special handling for Savour & Sip pages */
      isAnySavourPage ? (
        <>
          {isSavourAndSip && <PageLoader />}
          <main className="flex-1 w-full">{children}</main>
        </>
      ) : (
        <>
          <div className="flex w-full min-h-screen">
            <div className="flex flex-col flex-1 w-full">

              {/* ✅ Header */}
              {!isSavourAndSipComingSoonPage&&!isAuthPage &&
                !isAnyFrontendPage &&
                !isTransacComingSoonPage &&
                !isLeModeCoPage &&
                !isLeModeCoComingSoonPage &&
                !isLeModeCoContactUsPage &&
                !isConsumerPulsepage &&
                !isConsumerPulseComingSoonpage &&
                !isConsumerPulseLoginpage &&
                !isConsumerPulseSignuppage &&
                !isVRpage &&
                !isAnyNewComingSoonPage &&(
                  isTransac
                    ? <TransacHeader />
                    : (isHome || isContactUsPage)
                      ? <MetaHeader />
                      : <Navbar />
              )}

              {/* ✅ Frontend Web Design Header */}
              {isAnyFrontendPage && <FrontendHeader />}

              {/* ✅ Main Content */}
              <main className="flex-1 w-full">{children}</main>

              {/* ✅ Footer */}
              {!isSavourAndSipComingSoonPage&&!isTransac &&
                !isAnyFrontendPage &&
                !isTransacComingSoonPage &&
                !isComingSoonPage &&
                !isAuthPage &&
                !isLeModeCoPage &&
                !isLeModeCoComingSoonPage &&
                !isLeModeCoContactUsPage &&
                !isConsumerPulsepage &&
                !isConsumerPulseLoginpage &&
                !isConsumerPulseSignuppage &&
                !isConsumerPulseComingSoonpage &&
                !isVRpage &&
                !isAnyNewComingSoonPage &&
                !isContactUsPage &&
                (
                  isHome
                    ? <MetaFooter />
                    : <Footer />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
