'use client';
import { useRef } from 'react';
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

const PARTNERS = [
  {
    name: 'Vercel',
    category: 'Infrastructure',
    desc: 'Edge deployment and hosting for all Next.js projects — global CDN, instant rollbacks, zero-downtime deploys.',
    tags: ['Hosting', 'CDN', 'Next.js'],
  },
  {
    name: 'Sanity.io',
    category: 'Content Management',
    desc: 'Headless CMS partner for projects requiring editorial flexibility. Non-technical clients manage content without touching code.',
    tags: ['CMS', 'Headless', 'Real-Time'],
  },
  {
    name: 'Shopify',
    category: 'E-Commerce',
    desc: 'Certified Shopify development partner for custom storefronts, theme builds, and headless e-commerce architecture.',
    tags: ['E-Commerce', 'Headless', 'GTA Retail'],
  },
  {
    name: 'Google',
    category: 'Search & Analytics',
    desc: 'Official Google Analytics and Search Console integration partner. We implement GA4, GTM, and GSC setups for every client.',
    tags: ['SEO', 'Analytics', 'Ads'],
  },
  {
    name: 'Semrush',
    category: 'SEO Intelligence',
    desc: 'Our SEO research and competitive analysis engine. Keyword tracking, backlink audits, content gap analysis — all Semrush-powered.',
    tags: ['Keyword Research', 'SEO Audit', 'Competitive Intel'],
  },
  {
    name: 'Figma',
    category: 'Design & Prototyping',
    desc: 'All UI/UX design, brand systems, and prototyping delivered in Figma. Clients get full access to their design library.',
    tags: ['UI Design', 'Prototyping', 'Brand Systems'],
  },
  {
    name: 'HubSpot',
    category: 'CRM & Marketing',
    desc: 'CRM and marketing automation integration for clients who want to capture, score, and nurture leads from their website.',
    tags: ['CRM', 'Lead Nurture', 'Email Automation'],
  },
  {
    name: 'Anthropic / OpenAI',
    category: 'AI Infrastructure',
    desc: 'We build AI-powered features — content generation, chatbots, personalization engines — using Claude and GPT-4 APIs.',
    tags: ['AI', 'LLM', 'Personalization'],
  },
];

const CLIENTS = [
  { name: 'Ontario Clean Water Agency', sector: 'Government', year: '2023' },
  { name: 'Leslie Dan Faculty of Pharmacy — U of T', sector: 'Higher Education', year: '2023' },
  { name: 'Toronto Medical Clinics Network', sector: 'Healthcare', year: '2024' },
  { name: 'GTA Retail Collective', sector: 'E-Commerce', year: '2024' },
  { name: 'Northside Tourism Bureau', sector: 'Tourism', year: '2024' },
  { name: 'Fusion Financial Advisors', sector: 'Finance', year: '2023' },
  { name: 'Baltar International', sector: 'Consulting', year: '2024' },
  { name: 'Savour & Sip Hospitality', sector: 'Hospitality', year: '2024' },
];

const PARTNER_TYPES = [
  {
    type: 'Agency Partners',
    desc: 'We work alongside PR agencies, marketing consultancies, and creative studios who need a technical build partner. White-label engagements available.',
    icon: '⬡',
  },
  {
    type: 'Referral Partners',
    desc: 'Accountants, business coaches, and advisors who work with GTA small businesses — refer a client, earn a commission. Simple, transparent, recurring.',
    icon: '⬡',
  },
  {
    type: 'Technology Partners',
    desc: 'SaaS companies and platform providers who want TMI to build integrations, implementations, or partner with us to serve mutual clients.',
    icon: '⬡',
  },
];

export default function PartnersPage() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <TMINav />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 80px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// who we build with</p>
          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 900 }}>
            Partners &amp;<br /><span style={{ color: LIME }}>Clients</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 580, lineHeight: 1.7 }}>
            We build with best-in-class tools and alongside the best teams in the GTA. Our technology partnerships mean your project runs on infrastructure the world&apos;s fastest companies trust.
          </p>
        </FadeUp>
      </section>

      {/* Technology partners */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// technology stack</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 56 }}>Built on platforms that scale</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }} className="tmi-partners-grid">
          {PARTNERS.map((p, i) => (
            <FadeUp key={p.name} delay={i * 0.06}>
              <div style={{
                padding: '32px 28px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                height: '100%',
              }}>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.55rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>{p.category}</p>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 12 }}>{p.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 20 }}>{p.desc}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontSize: '0.55rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', padding: '3px 8px', border: '1px solid rgba(200,241,53,0.2)', color: 'rgba(200,241,53,0.6)', borderRadius: 2 }}>{t}</span>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Client list */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// client roster</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 56 }}>Trusted by organizations across the GTA</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0 }} className="tmi-clients-grid">
          {CLIENTS.map((c, i) => (
            <FadeUp key={c.name} delay={i * 0.05}>
              <div style={{
                padding: '28px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                paddingRight: i % 2 === 0 ? 40 : 0,
                paddingLeft: i % 2 === 1 ? 40 : 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <h3 style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: 4 }}>{c.name}</h3>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em' }}>{c.sector}</p>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'Courier New, monospace' }}>{c.year}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Partnership types */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// work with us</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 56 }}>Partnership programs</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }} className="tmi-partner-types-grid">
          {PARTNER_TYPES.map((pt, i) => (
            <FadeUp key={pt.type} delay={i * 0.1}>
              <div style={{ padding: '40px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: 20, color: LIME }}>{pt.icon}</p>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 14 }}>{pt.type}</h3>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{pt.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6vw 96px' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, marginBottom: 16 }}>// become a partner</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 600 }}>
            Interested in partnering with Toronto Media Inc.?
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
            Whether you&apos;re an agency, an advisor who works with GTA businesses, or a technology platform — we&apos;d love to explore how we can work together.
          </p>
          <a href="mailto:admin@baltar.ca" style={{
            display: 'inline-block', padding: '16px 36px',
            background: LIME, color: '#080808',
            fontFamily: 'Courier New, monospace', fontSize: '0.68rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontWeight: 700, textDecoration: 'none', borderRadius: 2,
          }}>
            Get in Touch →
          </a>
        </FadeUp>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .tmi-partners-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .tmi-partners-grid { grid-template-columns: 1fr !important; }
          .tmi-clients-grid { grid-template-columns: 1fr !important; }
          .tmi-partner-types-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
