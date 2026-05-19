'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE   = [0.16, 1, 0.3, 1];
const CREAM  = '#FAF8F3';
const INK    = '#1C1714';
const GOLD   = '#8B6914';
const GOLD_LT = '#C4955A';
const MUTED  = 'rgba(28,23,20,0.48)';
const RULE   = 'rgba(28,23,20,0.1)';

function FadeUp({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-6% 0px' });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >{children}</motion.div>
  );
}

function EventsNav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 72,
      background: 'rgba(250,248,243,0.97)', backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 0 rgba(28,23,20,0.08)',
    }}>
      <Link href="/savour-and-sip" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: INK, textDecoration: 'none', fontWeight: 600 }}>
        ← Savour &amp; Sip
      </Link>
      <Link href="/savour-and-sip" style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.12em', color: INK, textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        Savour &amp; Sip
      </Link>
      <a href="mailto:admin@baltar.ca" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 24px', border: `1px solid ${INK}`, color: INK, textDecoration: 'none' }}>
        Get in Touch
      </a>
    </nav>
  );
}

const EVENT_TYPES = [
  {
    title: 'Private Clubs & Member Events',
    desc: 'Galas, regattas, bonspiels, annual dinners, member nights, and seasonal celebrations at yacht clubs, curling clubs, golf clubs, and private associations.',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    tags: ['Yacht Club Events', 'Curling Bonspiels', 'Member Dinners', 'Club Galas'],
  },
  {
    title: 'Corporate Events & Office Dining',
    desc: 'Town halls, client entertaining, holiday parties, team celebrations, and daily office dining programs for leading companies across the GTA.',
    img: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=800&q=80',
    tags: ['Company Dinners', 'Client Entertaining', 'Office Programs', 'Holiday Parties'],
  },
  {
    title: 'Weddings & Celebrations',
    desc: 'Rehearsal dinners, ceremonies, receptions, bridal brunches, and milestone celebrations — designed around your vision and executed with precision.',
    img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding Receptions', 'Rehearsal Dinners', 'Milestone Birthdays', 'Anniversaries'],
  },
  {
    title: 'Brand Activations & Pop-Ups',
    desc: 'Launch events, fashion activations, product experiences, and film set catering — delivered with the same craft we bring to private dining.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    tags: ['Brand Launches', 'Fashion Events', 'Film Set Catering', 'Pop-Up Experiences'],
  },
  {
    title: 'Private Dinners & Intimate Gatherings',
    desc: 'Chef-driven dinner parties, tasting menus for eight to thirty, and home entertaining — the same quality, in any setting.',
    img: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=800&q=80',
    tags: ['Private Chef Dinners', 'Tasting Menus', 'Dinner Parties', 'Home Entertaining'],
  },
  {
    title: 'Conferences & Large-Scale Events',
    desc: 'Multi-day conferences, fundraiser galas, and events of 200–1,000+ guests — full food and beverage operations, managed end-to-end.',
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    tags: ['Conferences', 'Galas & Fundraisers', 'Awards Ceremonies', 'Large Banquets'],
  },
];

export default function EventsPage() {
  return (
    <div style={{ background: CREAM, color: INK, minHeight: '100vh', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <EventsNav />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '65vh', minHeight: 480, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=85"
          alt="Elegant event reception"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80, textAlign: 'center', padding: '0 24px 80px', zIndex: 2 }}>
          <motion.span
            style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 20 }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            Savour &amp; Sip — Events
          </motion.span>
          <motion.h1
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.6rem, 6vw, 5rem)', fontWeight: 400, lineHeight: 1.05, color: '#fff', margin: '0 0 20px', maxWidth: 800 }}
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          >
            Every Occasion,<br />Elevated
          </motion.h1>
          <motion.p
            style={{ fontSize: 'clamp(0.88rem, 1.5vw, 1rem)', color: 'rgba(255,255,255,0.6)', maxWidth: 500, lineHeight: 1.75 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            From member club galas to intimate private dinners — we bring the same precision and warmth to every event we touch.
          </motion.p>
        </div>
      </section>

      {/* ── EVENT TYPES GRID ── */}
      <section style={{ padding: '100px 80px 80px' }}>
        <FadeUp>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 16 }}>What We Serve</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: INK, margin: '0 0 72px', lineHeight: 1.1 }}>
            Events Built for Every Scale
          </h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {EVENT_TYPES.map((ev, i) => (
            <FadeUp key={ev.title} delay={i * 0.07}>
              <div style={{ background: '#fff', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                  <img src={ev.img} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '32px 32px 40px' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.15rem', fontWeight: 400, color: INK, margin: '0 0 12px', lineHeight: 1.3 }}>{ev.title}</h3>
                  <p style={{ fontSize: '0.83rem', color: MUTED, lineHeight: 1.75, margin: '0 0 20px' }}>{ev.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {ev.tags.map((tag, ti) => (
                      <span key={ti} style={{ fontSize: '0.68rem', padding: '4px 10px', border: `1px solid ${RULE}`, color: MUTED, letterSpacing: '0.06em' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section style={{ background: '#FDF9F2', padding: '100px 80px', borderTop: `1px solid ${RULE}` }}>
        <FadeUp>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 16 }}>The Process</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 400, color: INK, margin: '0 0 64px', lineHeight: 1.1 }}>
            From First Conversation to Last Course
          </h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1px solid ${RULE}` }}>
          {[
            { num: '01', title: 'Consultation', desc: 'We learn about your event — vision, guest count, dietary needs, and the feeling you want to create.' },
            { num: '02', title: 'Proposal', desc: 'A custom menu, staffing plan, and timeline built specifically for your occasion.' },
            { num: '03', title: 'Preparation', desc: 'Ingredient sourcing, kitchen coordination, staff briefing, and venue walkthrough.' },
            { num: '04', title: 'Execution', desc: 'Arrival, setup, flawless service, and full cleanup — so you never think about the details.' },
          ].map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.1}>
              <div style={{ padding: '40px 36px', borderRight: i < 3 ? `1px solid ${RULE}` : 'none', height: '100%', boxSizing: 'border-box' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '2.8rem', color: 'rgba(139,105,20,0.18)', lineHeight: 1, marginBottom: 20 }}>{step.num}</div>
                <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 400, color: INK, margin: '0 0 12px' }}>{step.title}</h4>
                <p style={{ fontSize: '0.85rem', color: MUTED, lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── BOOK YOUR NEXT EVENT ── */}
      <section style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85"
          alt="Dining atmosphere"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,6,4,0.75)' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 700, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
          <FadeUp>
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD_LT, display: 'block', marginBottom: 24 }}>Book Your Next Event</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4.5vw, 3.6rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, margin: '0 0 24px' }}>
              Ready to Make It Memorable?
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 48, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              Whether it's a club dinner for fifty or a private celebration for twelve — reach out and let's start the conversation. Every great event begins the same way.
            </p>
            <a href="mailto:admin@baltar.ca" style={{ display: 'inline-block', padding: '16px 52px', background: CREAM, color: INK, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: 16 }}>
              Begin the Conversation
            </a>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: 16, letterSpacing: '0.06em' }}>
              admin@baltar.ca
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOLLOW US ── */}
      <section style={{ background: INK, padding: '100px 80px', textAlign: 'center' }}>
        <FadeUp>
          <div style={{ width: 40, height: 1, background: GOLD_LT, margin: '0 auto 40px' }} />
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD_LT, display: 'block', marginBottom: 24 }}>Stay in the Loop</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, margin: '0 auto 20px', maxWidth: 640 }}>
            Follow Us to Stay in Touch
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 48px' }}>
            We host pop-up dinners, seasonal events, and exclusive experiences throughout the year. Follow us on Instagram to keep up with what's coming — and be first to know when tickets open.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://www.instagram.com/savourandsip"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 36px', background: CREAM, color: INK, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow on Instagram
            </a>
            <a
              href="mailto:admin@baltar.ca"
              style={{ display: 'inline-block', padding: '14px 36px', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            >
              Join Our Mailing List
            </a>
          </div>
        </FadeUp>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0F0C0A', color: 'rgba(255,255,255,0.4)', padding: '40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Savour &amp; Sip</span>
          <nav style={{ display: 'flex', gap: 32 }}>
            {[{ l: 'Menu', h: '/savour-and-sip/menu' }, { l: 'Services', h: '/savour-and-sip/services' }, { l: 'Back to Home', h: '/savour-and-sip' }].map(({ l, h }) => (
              <Link key={h} href={h} style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{l}</Link>
            ))}
          </nav>
          <span style={{ fontSize: '0.68rem' }}>© {new Date().getFullYear()} Savour &amp; Sip. A Baltar Hospitality Company.</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 960px) {
          section { padding-left: 32px !important; padding-right: 32px !important; }
        }
        @media (max-width: 768px) {
          nav[style*="padding: 0 48px"] { padding: 0 24px !important; }
        }
      `}</style>
    </div>
  );
}
