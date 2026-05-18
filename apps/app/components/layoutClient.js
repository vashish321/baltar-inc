'use client';

import { usePathname } from 'next/navigation';
import MetaHeader from './MetaStyleComponents/MetaHeader';
import MetaFooter from './MetaStyleComponents/MetaFooter';

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  // Pages with their own full-page UI — no shared header/footer
  const isSelfContained =
    pathname.startsWith('/sip-and-savour') ||
    pathname === '/savour-and-sip-coming-soon' ||
    pathname.startsWith('/vr') ||
    pathname.startsWith('/le-mode-co') ||
    pathname.startsWith('/baltar-engineering') ||
    pathname.startsWith('/baltar-international') ||
    pathname.startsWith('/frontend-web-design') ||
    pathname.startsWith('/transac') ||
    pathname.startsWith('/consumer-pulse') ||
    pathname.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/client-dashboard' ||
    // new route group paths (keep for forward compat)
    pathname.startsWith('/hospitality/') ||
    pathname.startsWith('/fashion/') ||
    pathname.startsWith('/consulting/') ||
    pathname.startsWith('/finance/') ||
    pathname.startsWith('/technologies/') ||
    pathname.startsWith('/media/');

  // Homepage and contact: MetaHeader + MetaFooter
  const isMetaPage = pathname === '/' || pathname === '/contact-us';

  if (isSelfContained) {
    return (
      <div style={{ overflowX: 'hidden', width: '100%' }}>
        {children}
      </div>
    );
  }

  if (isMetaPage) {
    return (
      <div style={{ overflowX: 'hidden', width: '100%', background: '#0B0F19' }}>
        <MetaHeader />
        <main>{children}</main>
        {pathname === '/' && null /* MetaFooter is already in page.js for homepage */}
      </div>
    );
  }

  // All other pages: MetaHeader + content
  return (
    <div style={{ overflowX: 'hidden', width: '100%', background: '#0B0F19', color: '#fff' }}>
      <MetaHeader />
      <main>{children}</main>
    </div>
  );
}
