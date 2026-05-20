'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import TMINav from '../TMINav';

const LIME = '#C8F135';
const EASE = [0.16, 1, 0.3, 1];

function FadeUp({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-6% 0px' });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const FILTERS = ['All', 'Web Dev', 'UX Research', 'Branding', 'SEO', 'E-Commerce'];

const PROJECTS = [
  {
    id: 1,
    client: 'Ontario Clean Water Agency',
    type: 'Web Dev',
    year: '2023',
    tags: ['Next.js', 'UX Research', 'Accessibility', 'Government'],
    headline: 'Rebuilding digital infrastructure for Ontario\'s most critical public utility.',
    summary: 'OCWA serves over 800 communities across Ontario — their digital presence needed to match the scale of their mission. We rebuilt their web infrastructure from the ground up: accessibility-first design, bilingual content architecture, interactive service maps, and a CMS that lets regional teams publish without developer support.',
    outcomes: ['WCAG 2.1 AA compliance achieved', '62% improvement in mobile engagement', 'Bilingual CMS empowers 40+ regional editors', 'Core Web Vitals: all green'],
    sector: 'Government / Public Utilities',
  },
  {
    id: 2,
    client: 'Leslie Dan Faculty of Pharmacy — University of Toronto',
    type: 'UX Research',
    year: '2023',
    tags: ['UX Research', 'Focus Groups', 'Journey Mapping', 'Higher Education'],
    headline: 'Human-centred research to redesign how students, researchers, and industry partners navigate a world-class pharmacy faculty.',
    summary: 'We ran a multi-phase UX engagement for the Leslie Dan Faculty of Pharmacy at U of T. Starting with stakeholder interviews and focus groups, we mapped pain points across three distinct user groups: undergraduate students, graduate researchers, and industry partners. Storyboarding sessions revealed navigation gaps that were causing high bounce rates on key pages like admissions and continuing education.',
    outcomes: ['12 focus groups across 3 user cohorts', 'Pain point hierarchy established for 8 core journeys', 'Storyboard-to-wireframe pipeline delivered', 'Redesign recommendations adopted by internal team'],
    sector: 'Higher Education',
  },
  {
    id: 3,
    client: 'Toronto Medical Clinics Network',
    type: 'Web Dev',
    year: '2024',
    tags: ['Booking Systems', 'PHIPA Compliance', 'Multi-Location', 'Healthcare'],
    headline: 'A unified digital front-end for a network of Toronto-area medical clinics.',
    summary: 'We designed and developed a PHIPA-compliant web platform for a growing network of family medicine and specialist clinics across the GTA. Each clinic location has a branded sub-page, live appointment availability, online intake forms, and a patient portal handoff. SEO was optimized for neighborhood-level search — "family doctor North York", "walk-in clinic Scarborough" — driving measurable increases in new patient bookings.',
    outcomes: ['Online booking adoption up 78% in 90 days', 'Rank #1–3 for 14 local medical search terms', 'PHIPA-compliant intake forms eliminate paper', 'Average page load under 1.2s across all locations'],
    sector: 'Healthcare',
  },
  {
    id: 4,
    client: 'GTA Retail Collective',
    type: 'E-Commerce',
    year: '2024',
    tags: ['Shopify', 'Conversion Optimization', 'Retail', 'E-Commerce'],
    headline: 'Multi-vendor e-commerce platform uniting independent GTA retailers under one digital roof.',
    summary: 'A consortium of 18 independent Toronto-area retailers needed a shared e-commerce presence to compete with big-box online stores. We built a Shopify-based multi-vendor platform with individual seller dashboards, shared cart functionality, and a curated editorial front-end that drives discovery. Conversion rate optimization — including checkout flow A/B testing and mobile UX improvements — was central to the engagement.',
    outcomes: ['18 vendors onboarded in 6 weeks', 'Checkout conversion rate: 3.1% (industry avg: 1.8%)', 'Mobile accounts for 71% of orders', 'Average order value up 23% via upsell modules'],
    sector: 'Retail / E-Commerce',
  },
  {
    id: 5,
    client: 'Northside Tourism Bureau',
    type: 'SEO',
    year: '2024',
    tags: ['Tourism', 'Local SEO', 'Content Strategy', 'Google Maps'],
    headline: 'Putting a Toronto-area tourism board on the map — literally and digitally.',
    summary: 'The Northside Tourism Bureau was invisible online despite representing some of the most visited parks, trails, and attractions north of Toronto. We executed a comprehensive local SEO strategy: Google Business Profile optimization for 22 attractions, schema markup for events and places, a content strategy targeting high-volume travel search terms, and a new editorial hub publishing seasonal guides.',
    outcomes: ['Google Maps impressions up 340% in 6 months', '22 attraction profiles fully optimized', 'Organic traffic up 180% YoY', '1st page rankings for 31 tourism-related keywords'],
    sector: 'Tourism / Government',
  },
  {
    id: 6,
    client: 'Fusion Financial Advisors',
    type: 'Branding',
    year: '2023',
    tags: ['Brand Identity', 'Logo Design', 'Financial Services', 'Web Design'],
    headline: 'A rebrand that built trust before clients ever walked in the door.',
    summary: 'Fusion Financial came to us looking like a 2008 brand in a 2024 market. We ran competitor landscape analysis, surveyed their existing client base, and developed a new brand identity built around clarity, confidence, and approachability. The new wordmark, colour system, and web presence immediately elevated their perceived authority — critical in a trust-based industry.',
    outcomes: ['New brand live across all touchpoints in 8 weeks', 'Client intake inquiries up 41% post-launch', 'Website bounce rate down from 68% to 34%', 'Featured in Toronto Finance Digest'],
    sector: 'Financial Services',
  },
];

export default function PastWorkPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? PROJECTS : PROJECTS.filter(p => p.type === activeFilter);
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <TMINav />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 80px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// selected projects</p>
          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 900 }}>
            Work that<br /><span style={{ color: LIME }}>speaks for itself</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 580, lineHeight: 1.7 }}>
            From government utilities to university faculties, healthcare networks to independent retailers — we build digital products that perform.
          </p>
        </FadeUp>
      </section>

      {/* Stats strip */}
      <FadeUp>
        <section style={{ padding: '40px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          {[['40+', 'Projects delivered'], ['6', 'Industries served'], ['100%', 'Client retention'], ['2×+', 'Avg. traffic growth']].map(([val, label]) => (
            <div key={label}>
              <p style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: LIME, letterSpacing: '-0.04em', lineHeight: 1 }}>{val}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: 4 }}>{label}</p>
            </div>
          ))}
        </section>
      </FadeUp>

      {/* Filter row */}
      <section style={{ padding: '48px 6vw 0' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 48 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '8px 18px', border: '1px solid',
              borderColor: activeFilter === f ? LIME : 'rgba(255,255,255,0.12)',
              background: activeFilter === f ? LIME : 'transparent',
              color: activeFilter === f ? '#080808' : 'rgba(255,255,255,0.5)',
              fontFamily: 'Courier New, monospace', fontSize: '0.6rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: 2, transition: 'all 0.2s',
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Projects */}
        {filtered.map((p, i) => (
          <FadeUp key={p.id} delay={i * 0.05}>
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '40px 0',
              cursor: 'pointer',
            }} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
              {/* Row header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: LIME }}>{p.year}</span>
                    <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)' }}>{p.sector}</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>{p.client}</h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: 640 }}>{p.headline}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <span style={{ fontFamily: 'Courier New, monospace', fontSize: '1rem', color: LIME, transition: 'transform 0.3s', transform: expanded === p.id ? 'rotate(45deg)' : 'none', display: 'block' }}>+</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {p.tags.map(t => (
                      <span key={t} style={{ fontSize: '0.58rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', padding: '3px 8px', border: '1px solid rgba(200,241,53,0.2)', color: 'rgba(200,241,53,0.6)', borderRadius: 2 }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              {expanded === p.id && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}
                  className="tmi-project-expand"
                >
                  <div>
                    <p style={{ fontSize: '0.65rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.14em', color: LIME, marginBottom: 12 }}>// the work</p>
                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8 }}>{p.summary}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.14em', color: LIME, marginBottom: 16 }}>// outcomes</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {p.outcomes.map(o => (
                        <p key={o} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ color: LIME, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>→</span> {o}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </FadeUp>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6vw 96px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 40 }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, marginBottom: 16 }}>// your project could be next</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 32, maxWidth: 600 }}>
            Ready to build something that performs?
          </h2>
          <a href="mailto:admin@baltar.ca" style={{
            display: 'inline-block', padding: '16px 36px',
            background: LIME, color: '#080808',
            fontFamily: 'Courier New, monospace', fontSize: '0.68rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontWeight: 700, textDecoration: 'none', borderRadius: 2,
          }}>
            Start a Conversation →
          </a>
        </FadeUp>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .tmi-project-expand { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
