'use client';

import { usePathname } from 'next/navigation';
import MetaHeader from './MetaStyleComponents/MetaHeader';
import MetaFooter from './MetaStyleComponents/MetaFooter';

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  // Pages with their own full-page UI — no shared header/footer
  const isSelfContained =
    pathname.startsWith('/toronto-media-inc') ||
    pathname.startsWith('/baltar-engineering') ||
    pathname.startsWith('/savour-and-sip') ||
    pathname === '/savour-and-sip-coming-soon' ||
    pathname.startsWith('/vr') ||
    pathname.startsWith('/le-mode-co') ||
    pathname.startsWith('/consumer-pulse') ||
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/client-dashboard' ||
    // route group paths (keep for forward compat)
    pathname.startsWith('/hospitality/') ||
    pathname.startsWith('/fashion/') ||
    pathname.startsWith('/consulting/') ||
    pathname.startsWith('/finance/') ||
    pathname.startsWith('/technologies/') ||
    pathname.startsWith('/media/');

  // These pages have their own branded footer — inject MetaHeader but not MetaFooter
  const hasOwnFooter =
    pathname.startsWith('/frontend-web-design') ||
    pathname.startsWith('/transac');

  // Homepage and contact: MetaHeader + MetaFooter
  const isMetaPage = pathname === '/' || pathname === '/contact-us';

  if (isSelfContained) {
    return (
      <div style={{ overflowX: 'hidden', width: '100%' }}>
        {children}
      </div>
    );
  }

  if (hasOwnFooter) {
    return (
      <div style={{ overflowX: 'hidden', width: '100%' }}>
        <MetaHeader />
        <main>{children}</main>
      </div>
    );
  }

  if (isMetaPage) {
    return (
      <div style={{ overflowX: 'hidden', width: '100%', background: '#0B0F19' }}>
        <MetaHeader />
        <main>{children}</main>
        {/* MetaFooter is rendered inside page.js on the homepage; add it here for all other meta pages */}
        {pathname !== '/' && <MetaFooter />}
      </div>
    );
  }

  // All other pages: MetaHeader + content + MetaFooter
  return (
    <div style={{ overflowX: 'hidden', width: '100%', background: '#0B0F19', color: '#fff' }}>
      <MetaHeader />
      <main>{children}</main>
      <MetaFooter />
    </div>
  );
}
