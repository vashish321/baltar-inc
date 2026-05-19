'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];
const CREAM   = '#FAF8F3';
const INK     = '#1C1714';
const GOLD    = '#8B6914';
const GOLD_LT = '#C4955A';
const MUTED   = 'rgba(28,23,20,0.5)';
const RULE    = 'rgba(28,23,20,0.1)';

function FadeUp({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-6% 0px' });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >{children}</motion.div>
  );
}

/* ─── Simple self-contained nav matching S&S aesthetic ─── */
function ServicesNav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 72,
      background: 'rgba(250,248,243,0.97)', backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 0 rgba(28,23,20,0.08)',
    }}>
      <Link href="/sip-and-savour" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: INK, textDecoration: 'none', fontWeight: 600 }}>
        ← Savour &amp; Sip
      </Link>
      <Link href="/sip-and-savour" style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.12em', color: INK, textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        Savour &amp; Sip
      </Link>
      <a href="mailto:admin@baltar.ca" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 24px', border: `1px solid ${INK}`, color: INK, textDecoration: 'none' }}>
        Get in Touch
      </a>
    </nav>
  );
}

/* ─── Data ─── */
const SERVICES = [
  {
    id: 'private-clubs',
    eyebrow: 'Club Dining Programs',
    title: 'Yacht Clubs, Curling Clubs & Private Member Clubs',
    subtitle: 'Seasonal kitchen management and full F&B programs tailored to member-based venues.',
    body: `Private clubs demand a level of consistency and refinement that transient catering companies simply can't provide. Savour & Sip specialises in long-term partnerships with yacht clubs, curling clubs, golf clubs, rowing clubs, and private members' associations across the Greater Toronto Area and Ontario.

We take on the full scope of kitchen operations — from menu design and seasonal changeovers to kitchen staffing, inventory management, vendor relationships, and daily service execution. Our team integrates seamlessly with your existing front-of-house staff, maintaining the institutional warmth and standards your members expect.

Whether you need a summer season kitchen at your waterfront yacht club, a full-year program at a curling or golf club, or a weekend catering partner for member events and galas, we build a custom operational model around your facility and membership culture.`,
    bullets: [
      'Full seasonal kitchen management (spring/summer/fall/winter)',
      'Menu planning aligned with club culture and member demographics',
      'On-site chef and kitchen team placement',
      'Inventory, procurement and cost-of-goods management',
      'Front-of-house and floor service coordination',
      'Bar programs and sommelier-curated wine lists',
      'Member event catering: galas, regattas, curling bonspiels, tournaments',
      'Staff training and hospitality standards development',
    ],
    clients: ['Yacht Clubs', 'Curling Clubs', 'Golf & Country Clubs', 'Rowing Clubs', 'Private Members\' Associations'],
    img: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'corporate-dining',
    eyebrow: 'Corporate & Office Dining',
    title: 'Office Dining Programs for Leading Companies',
    subtitle: 'Elevated daily dining and curated food programs for corporate environments that set the standard.',
    body: `The workplace dining experience is increasingly a reflection of company culture and a genuine competitive advantage in talent retention. Savour & Sip provides bespoke corporate dining programs for offices, studios, and headquarters — with the same quality and intentionality we bring to private event catering.

We work with leading media companies, financial institutions, production studios, and professional services firms to design daily lunch programs, executive dining experiences, client entertaining menus, and team celebration events. Our programs are built around your team size, dietary diversity, culinary preferences, and operational calendar — not a generic corporate food contract.

From a weekly rotating lunch program for a team of forty, to a full executive catering suite for board meetings and C-suite entertaining, we operate with discretion, consistency, and craft.`,
    bullets: [
      'Daily or weekly rotating lunch programs',
      'Executive dining and boardroom service',
      'Client entertaining and business development dinners',
      'All-hands meetings, town halls, and company celebrations',
      'Holiday parties and seasonal team events',
      'Dietary diversity: vegan, halal, gluten-free, allergen management',
      'Pop-up food stations and experiential dining activations',
      'Flexible contracts: ongoing programs or one-off engagements',
    ],
    clients: ['Media & Production Companies', 'Financial Institutions & Trading Firms', 'Tech Companies & Startups', 'Law Firms & Professional Services', 'Film & TV Studios'],
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'event-spaces',
    eyebrow: 'Event Venue Partnerships',
    title: 'Event Halls, Banquet Venues & Hospitality Spaces',
    subtitle: 'Preferred catering partner for venues seeking a reliable, high-calibre F&B operator.',
    body: `For event venues without in-house catering, the quality of the food and service directly impacts your reputation and repeat bookings. Savour & Sip operates as a preferred catering partner for event halls, banquet facilities, cultural centres, and hospitality spaces — providing seamless, professional food and beverage service that makes your venue the obvious choice for any occasion.

We work closely with venue operators to understand spatial layouts, kitchen infrastructure, capacity ranges, and client profiles. Our team manages every aspect of the dining experience from arrival canapés to plated desserts — with the kind of operational rigour that makes your venue look effortless to the clients booking it.

Venue partnerships are available on an exclusive or preferred basis, with flexible terms for high-volume and seasonal operators.`,
    bullets: [
      'Exclusive or preferred venue catering partnerships',
      'Full-service event catering from 20 to 1,000+ guests',
      'Banquet and plated dinner service',
      'Cocktail receptions and standing canapé service',
      'Buffet, family-style, and action station formats',
      'Custom menus aligned with venue brand and clientele',
      'Bar programs, wine service, and licensed beverage management',
      'Setup, breakdown, and post-event deep cleaning',
    ],
    clients: ['Banquet Halls & Event Centres', 'Cultural & Heritage Venues', 'Hotel Ballrooms', 'Outdoor & Tented Venues', 'Loft & Industrial Event Spaces'],
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'private-events',
    eyebrow: 'Private & Social Events',
    title: 'Private Dining, Celebrations & Bespoke Events',
    subtitle: 'From intimate dinners to grand receptions — every detail considered, every moment yours.',
    body: `Savour & Sip brings fine dining precision and genuine warmth to private celebrations of all scales. Whether you're hosting a dinner party for twelve in your home, a milestone birthday for two hundred in a rented space, or a wedding reception that needs to feel effortlessly extraordinary — we design and execute every culinary and service element around your vision.

Our private event work spans bespoke multi-course tasting menus, family-style feasts, and themed culinary experiences. We handle the full scope: menu creation, ingredient sourcing, kitchen setup, chef and service team deployment, table styling, and clean-up. You and your guests experience the evening as it should be — unhurried and entirely yours.`,
    bullets: [
      'Bespoke multi-course tasting menus',
      'Family-style and communal dining formats',
      'Wedding catering and reception service',
      'Birthday, anniversary, and milestone celebrations',
      'Holiday dinners and seasonal feasts',
      'Themed culinary experiences (Caribbean, Italian, Pan-Asian, etc.)',
      'Full kitchen and service team deployment at any venue',
      'Dietary customisation and allergen management',
    ],
    clients: ['Private Homes & Residences', 'Wedding & Reception Venues', 'Rooftops & Terraces', 'Rented Spaces & Lofts', 'Destination & Out-of-Town Events'],
    img: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'bartending',
    eyebrow: 'Bar Programs',
    title: 'Curated Bar Programs & Bartending',
    subtitle: 'Bespoke cocktail menus, sommelier-selected wine pairings, and zero-proof programs.',
    body: `A great bar program is inseparable from a great event. Savour & Sip's bartending and beverage services go far beyond staff-and-stock — we design full bar programs that reflect your event's tone, your guests' palates, and the seasonal context of the occasion.

From a single mixologist crafting signature cocktails at a private dinner, to a full multi-station bar operation at a gala of five hundred, our bar teams are trained to deliver with craft and efficiency. We handle glassware, ice, garnish, equipment, licensing guidance, and beverage procurement — so your guests never wait and never wonder what to order next.`,
    bullets: [
      'Custom signature cocktail design',
      'Sommelier-curated wine and champagne selections',
      'Zero-proof and mocktail programs',
      'Mobile bar setup and equipment',
      'Flair and mixology bartenders',
      'Full bar service: glassware, ice, garnish, equipment',
      'Alcohol consulting and shopping lists',
      'Licensed bartenders (Smart Serve certified)',
    ],
    clients: ['Weddings & Receptions', 'Corporate Events & Galas', 'Cocktail Parties', 'Club Events & Member Nights', 'Brand Activations'],
    img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'staffing',
    eyebrow: 'Hospitality Staffing',
    title: 'Kitchen & Front-of-House Staffing',
    subtitle: 'Vetted hospitality professionals for restaurants, venues, and event operations.',
    body: `Whether you need emergency kitchen coverage, seasonal reinforcements, or a long-term staffing contract, Savour & Sip supplies trained, vetted hospitality professionals who integrate with your operation from day one.

Our staffing network spans kitchen roles — prep cooks, line cooks, sous chefs, and executive chefs — through to front-of-house positions including servers, hosts, coat check, and event floor managers. Every placement is pre-screened for experience, reliability, and professionalism. We handle the coordination, so you handle the experience.`,
    bullets: [
      'Prep cooks, line cooks, sous chefs',
      'Servers, bussers, and floor staff',
      'Hosts, greeters, and coat check',
      'Baristas and coffee bar staff',
      'Emergency and short-notice coverage',
      'Seasonal and peak-period reinforcements',
      'Long-term placement contracts',
      'Staff orientated to your brand standards',
    ],
    clients: ['Restaurants & Cafés', 'Hotels & Resorts', 'Catering Companies', 'Event Venues', 'Private Clubs & Member Spaces'],
    img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80',
  },
];

const MARQUEE = ['Yacht Clubs', '·', 'Curling Clubs', '·', 'Corporate Dining', '·', 'Private Clubs', '·', 'Event Venues', '·', 'Office Programs', '·', 'Weddings', '·', 'Toronto & GTA', '·'];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(null);

  return (
    <div style={{ background: CREAM, color: INK, minHeight: '100vh', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <ServicesNav />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '70vh', minHeight: 560, overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85"
          alt="Private dining setup"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', zIndex: 2 }}>
          <motion.span
            style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', display: 'block', marginBottom: 24 }}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          >
            Savour &amp; Sip — What We Offer
          </motion.span>
          <motion.h1
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#fff', margin: '0 0 24px', maxWidth: 900 }}
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          >
            Hospitality at Every Scale
          </motion.h1>
          <motion.p
            style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)', color: 'rgba(255,255,255,0.65)', maxWidth: 580, lineHeight: 1.75, margin: 0 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            From seasonal kitchen management at private clubs to daily corporate dining — we build food and beverage programs that elevate every environment we operate in.
          </motion.p>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ overflow: 'hidden', borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: '18px 0', background: '#FDF9F2' }}>
        <motion.div
          style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        >
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} style={{ fontSize: '0.72rem', fontWeight: item === '·' ? 400 : 500, letterSpacing: item === '·' ? 0 : '0.14em', textTransform: 'uppercase', color: item === '·' ? GOLD_LT : INK }}>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── INTRO ── */}
      <section style={{ padding: '100px 80px 80px', maxWidth: 900, margin: '0 auto', boxSizing: 'border-box' }}>
        <FadeUp>
          <div style={{ width: 40, height: 1, background: GOLD, marginBottom: 32 }} />
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.3rem, 2.2vw, 1.9rem)', fontWeight: 400, lineHeight: 1.55, color: INK, margin: '0 0 28px' }}>
            We are not a generic catering company. We are a hospitality management partner — built for the venues, organisations, and individuals who understand that food and service are never background details.
          </p>
          <p style={{ fontSize: '0.95rem', color: MUTED, lineHeight: 1.85 }}>
            Savour &amp; Sip operates in private clubs, corporate offices, event venues, and private homes across Toronto and the GTA. Our model is built around long-term relationships, seasonal programming, and operational excellence — not one-off transactions.
          </p>
        </FadeUp>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ padding: '0 0 120px' }}>
        {SERVICES.map((svc, i) => (
          <FadeUp key={svc.id} delay={0.05}>
            <div
              id={svc.id}
              style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                minHeight: 560,
                borderTop: `1px solid ${RULE}`,
              }}
            >
              {/* Image — alternates left/right */}
              <div style={{ order: i % 2 === 0 ? 1 : 2, position: 'relative', overflow: 'hidden', minHeight: 400 }}>
                <img
                  src={svc.img}
                  alt={svc.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>

              {/* Text */}
              <div style={{ order: i % 2 === 0 ? 2 : 1, padding: '72px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: i % 2 === 0 ? CREAM : '#FDF9F2' }}>
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 20 }}>{svc.eyebrow}</span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 400, lineHeight: 1.2, color: INK, margin: '0 0 12px' }}>
                  {svc.title}
                </h2>
                <p style={{ fontSize: '0.88rem', fontStyle: 'italic', color: GOLD, marginBottom: 28, lineHeight: 1.6 }}>{svc.subtitle}</p>

                {/* Description — first paragraph */}
                <p style={{ fontSize: '0.88rem', color: MUTED, lineHeight: 1.85, margin: '0 0 28px', whiteSpace: 'pre-line' }}>
                  {svc.body.split('\n\n')[0]}
                </p>

                {/* Bullets */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: INK, fontWeight: 600, margin: '0 0 14px' }}>What We Provide</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                    {svc.bullets.map((b, bi) => (
                      <li key={bi} style={{ fontSize: '0.82rem', color: MUTED, lineHeight: 1.5, paddingLeft: 14, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: GOLD_LT }}>—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Client types */}
                <div style={{ marginBottom: 32 }}>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: INK, fontWeight: 600, margin: '0 0 12px' }}>Who We Work With</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {svc.clients.map((c, ci) => (
                      <span key={ci} style={{ fontSize: '0.75rem', padding: '5px 14px', border: `1px solid ${RULE}`, color: INK, borderRadius: 2 }}>{c}</span>
                    ))}
                  </div>
                </div>

                <a href="mailto:admin@baltar.ca" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: INK, textDecoration: 'none', fontWeight: 700, borderBottom: `1.5px solid ${INK}`, paddingBottom: 3, transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = GOLD; }}
                  onMouseLeave={e => { e.currentTarget.style.color = INK; e.currentTarget.style.borderColor = INK; }}
                >
                  Enquire About This Service →
                </a>
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* ── SEO TARGETS strip ── */}
      <section style={{ background: INK, padding: '80px 80px', borderTop: `1px solid rgba(255,255,255,0.06)` }}>
        <FadeUp>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD_LT, display: 'block', marginBottom: 24 }}>Where We Work</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.2, margin: '0 0 40px' }}>
              Trusted by Private Clubs, Offices &amp; Venues Across the GTA
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', border: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { label: 'Private Members\' Clubs', items: ['Yacht clubs & sailing clubs', 'Curling clubs & bonspiels', 'Golf & country clubs', 'Rowing clubs & regattas'] },
                { label: 'Corporate Offices', items: ['Media & entertainment companies', 'Financial institutions & trading floors', 'Tech headquarters & studios', 'Professional services firms'] },
                { label: 'Event & Hospitality', items: ['Banquet halls & event centres', 'Wedding venues', 'Hotel F&B programs', 'Cultural & heritage spaces'] },
              ].map((col, ci) => (
                <div key={ci} style={{ padding: '40px 36px', borderRight: ci < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <p style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD_LT, margin: '0 0 20px', fontWeight: 600 }}>{col.label}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {col.items.map((item, ii) => (
                      <li key={ii} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 8, paddingLeft: 16, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: GOLD_LT }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '120px 80px', background: CREAM, textAlign: 'center', borderTop: `1px solid ${RULE}` }}>
        <FadeUp>
          <div style={{ width: 40, height: 1, background: GOLD, margin: '0 auto 40px' }} />
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3.4rem)', fontWeight: 400, color: INK, lineHeight: 1.15, margin: '0 0 24px', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
            Let's Talk About What You Need
          </h2>
          <p style={{ fontSize: '0.95rem', color: MUTED, lineHeight: 1.8, maxWidth: 520, margin: '0 auto 48px' }}>
            Every partnership starts with a conversation. Tell us about your venue, your organisation, or your event — and we'll put together a proposal that fits.
          </p>
          <a href="mailto:admin@baltar.ca" style={{ display: 'inline-block', padding: '16px 52px', background: INK, color: CREAM, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#3a2e29'}
            onMouseLeave={e => e.currentTarget.style.background = INK}
          >
            admin@baltar.ca
          </a>
        </FadeUp>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: INK, color: 'rgba(255,255,255,0.4)', padding: '40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Savour &amp; Sip</span>
          <nav style={{ display: 'flex', gap: 32 }}>
            {[{ l: 'Menu', h: '/sip-and-savour/menu' }, { l: 'Events', h: '/sip-and-savour/events' }, { l: 'Back to Home', h: '/sip-and-savour' }].map(({ l, h }) => (
              <Link key={h} href={h} style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{l}</Link>
            ))}
          </nav>
          <span style={{ fontSize: '0.68rem' }}>© {new Date().getFullYear()} Savour &amp; Sip. A Baltar Hospitality Company.</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          nav[style*="padding: 0 48px"] { padding: 0 24px !important; }
        }
      `}</style>
    </div>
  );
}
