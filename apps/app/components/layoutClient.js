'use client';

import { usePathname } from 'next/navigation';
import Navbar from './NavBarComponent/Navbar';
import Footer from './FooterComponent/Footer';
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

  // Dashboard pages that should not have default headers/footers
  const isAdminDashboard = pathname === '/admin-dashboard';
  const isAdminLogin = pathname === '/admin-login';
  const isClientDashboard = pathname === '/client-dashboard';

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
      {isAdminDashboard || isAdminLogin || isClientDashboard ? (
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
                !isVRpage &&(
                  isTransac
                    ? <TransacHeader />
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
                (
                  <Footer />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
