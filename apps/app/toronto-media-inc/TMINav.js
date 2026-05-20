'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LIME = '#C8F135';
const BG_SOLID = 'rgba(8,8,8,0.97)';

const NAV_LINKS = [
  { label: 'Services',  href: '/toronto-media-inc/services' },
  { label: 'Past Work', href: '/toronto-media-inc/past-work' },
  { label: 'AI Ready',  href: '/toronto-media-inc/ai-ready' },
  { label: 'Partners',  href: '/toronto-media-inc/partners' },
  { label: 'Blog',      href: '/toronto-media-inc/blog' },
];

export default function TMINav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const bg = scrolled || open ? BG_SOLID : 'transparent';
  const shadow = scrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 60, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 40px',
        background: bg, boxShadow: shadow,
        transition: 'background 0.3s, box-shadow 0.3s',
        backdropFilter: scrolled || open ? 'blur(12px)' : 'none',
      }}>
        {/* Logo */}
        <Link href="/toronto-media-inc" style={{
          fontFamily: 'Courier New, monospace', fontSize: '0.78rem',
          fontWeight: 700, letterSpacing: '0.12em', color: LIME,
          textDecoration: 'none', zIndex: 2,
        }}>
          &gt;_TMI
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}
          className="tmi-desktop-links">
          {NAV_LINKS.map(l => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link key={l.href} href={l.href} style={{
                fontFamily: 'Courier New, monospace',
                fontSize: '0.62rem', letterSpacing: '0.14em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: active ? LIME : 'rgba(255,255,255,0.45)',
                fontWeight: active ? 700 : 400,
                transition: 'color 0.2s',
              }}>
                {active ? '// ' : ''}{l.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA + mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 2 }}>
          <a href="mailto:admin@baltar.ca"
            className="tmi-desktop-cta"
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '0.6rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', textDecoration: 'none',
              color: '#080808', background: LIME,
              padding: '8px 18px', fontWeight: 700,
              borderRadius: 2, whiteSpace: 'nowrap',
            }}>
            Start a Project
          </a>

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen(o => !o)}
            className="tmi-hamburger"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, display: 'flex', flexDirection: 'column', gap: 5,
            }}
            aria-label="Toggle navigation"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 20, height: 1.5,
                background: LIME,
                transition: 'transform 0.3s, opacity 0.3s',
                transform: open
                  ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                  : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'none'
                  : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0, bottom: 0,
          background: '#080808', zIndex: 199, overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          padding: '48px 32px', gap: 0,
        }}>
          {NAV_LINKS.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{
                fontFamily: 'Courier New, monospace',
                fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: pathname === l.href ? LIME : 'rgba(255,255,255,0.7)',
                padding: '20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
              <span style={{ color: LIME, marginRight: 12, fontSize: '0.8rem' }}>0{i + 1}.</span>
              {l.label}
            </Link>
          ))}
          <a href="mailto:admin@baltar.ca" onClick={() => setOpen(false)}
            style={{
              marginTop: 40, display: 'inline-block',
              background: LIME, color: '#080808',
              fontFamily: 'Courier New, monospace',
              fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none', padding: '14px 32px',
            }}>
            Start a Project →
          </a>
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .tmi-desktop-links { display: none !important; }
          .tmi-desktop-cta   { display: none !important; }
          .tmi-hamburger     { display: flex !important; }
        }
        @media (min-width: 769px) {
          .tmi-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}
