'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const AMBER = '#C8F135';
const BG_SOLID = 'rgba(10,10,14,0.97)';

const NAV_LINKS = [
  { label: 'Services',  href: '/baltar-engineering/services' },
  { label: 'Projects',  href: '/baltar-engineering/projects' },
  { label: 'Expertise', href: '/baltar-engineering/expertise' },
];

export default function BCNav() {
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
  const shadow = scrolled ? '0 1px 0 rgba(255,255,255,0.05)' : 'none';

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
        <Link href="/baltar-engineering" style={{
          fontFamily: 'Courier New, monospace', fontSize: '0.72rem',
          fontWeight: 700, letterSpacing: '0.16em', color: AMBER,
          textDecoration: 'none', zIndex: 2, textTransform: 'uppercase',
        }}>
          BALTAR<span style={{ color: 'rgba(255,255,255,0.5)', margin: '0 6px' }}>·</span>CONSULTING
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}
          className="bc-desktop-links">
          {NAV_LINKS.map(l => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link key={l.href} href={l.href} style={{
                fontFamily: 'Courier New, monospace',
                fontSize: '0.6rem', letterSpacing: '0.14em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: active ? AMBER : 'rgba(255,255,255,0.4)',
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
            className="bc-desktop-cta"
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '0.58rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', textDecoration: 'none',
              color: '#0a0a0e', background: AMBER,
              padding: '7px 16px', fontWeight: 700,
              borderRadius: 2, whiteSpace: 'nowrap',
            }}>
            Engage Us
          </a>

          <button
            onClick={() => setOpen(o => !o)}
            className="bc-hamburger"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, display: 'flex', flexDirection: 'column', gap: 5,
            }}
            aria-label="Toggle navigation"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 20, height: 1.5,
                background: AMBER,
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
          background: '#0a0a0e', zIndex: 199, overflowY: 'auto',
          display: 'flex', flexDirection: 'column',
          padding: '48px 32px', gap: 0,
        }}>
          {NAV_LINKS.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{
                fontFamily: 'Courier New, monospace',
                fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: pathname === l.href ? AMBER : 'rgba(255,255,255,0.7)',
                padding: '20px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
              <span style={{ color: AMBER, marginRight: 12, fontSize: '0.75rem' }}>0{i + 1}.</span>
              {l.label}
            </Link>
          ))}
          <a href="mailto:admin@baltar.ca" onClick={() => setOpen(false)}
            style={{
              marginTop: 40, display: 'inline-block',
              background: AMBER, color: '#0a0a0e',
              fontFamily: 'Courier New, monospace',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none', padding: '14px 32px', borderRadius: 2,
            }}>
            Engage Us →
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .bc-desktop-links { display: none !important; }
          .bc-desktop-cta   { display: none !important; }
          .bc-hamburger     { display: flex !important; }
        }
        @media (min-width: 769px) {
          .bc-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}
