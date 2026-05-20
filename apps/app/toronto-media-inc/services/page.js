'use client';
import Link from 'next/link';
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

const SERVICES = [
  {
    num: '01',
    title: 'Web Design & Development',
    tagline: 'Sites that convert visitors into clients.',
    desc: 'We design and build fast, responsive websites using React and Next.js — fully custom, no templates. From small business portfolios to multi-location retail platforms, every pixel is intentional. We obsess over Core Web Vitals, accessibility, and mobile-first performance because Google ranks what users love.',
    deliverables: ['Custom React / Next.js build', 'Mobile-first responsive design', 'Core Web Vitals optimization', 'CMS integration (Sanity, Contentful)', 'Analytics setup (GA4, GTM)', 'Post-launch support'],
    industries: ['Retail', 'Food & Hospitality', 'Healthcare', 'Professional Services'],
    price: 'Starting at $3,500',
  },
  {
    num: '02',
    title: 'SEO & Content Strategy',
    tagline: 'Rank higher. Stay there.',
    desc: 'Search engine optimization built for the GTA market. We combine technical SEO, local SEO, on-page optimization, and content strategy to push your business to the top of Google. We target high-intent keywords — "web design Toronto", "small business website GTA", "retail website designer" — and build sustainable organic traffic pipelines.',
    deliverables: ['Full technical SEO audit', 'Local SEO & Google Business Profile', 'Keyword mapping & content calendar', 'On-page optimization', 'Schema markup & structured data', 'Monthly performance reporting'],
    industries: ['Local Business', 'E-Commerce', 'Tourism', 'Medical'],
    price: 'Starting at $800/mo',
  },
  {
    num: '03',
    title: 'AI-Powered Lead Generation',
    tagline: 'Your site works while you sleep.',
    desc: 'We build AI-driven traffic and lead pipelines that use machine learning models to continuously optimize for conversion. Predictive content targeting, behavioral triggers, smart CTAs, and automated nurture sequences — all tuned by algorithms that get smarter over time. Your cost-per-lead drops as the model learns.',
    deliverables: ['AI content targeting & personalization', 'Behavioral trigger sequences', 'Smart CTA optimization (A/B + ML)', 'Lead scoring & routing', 'CRM integration', 'Monthly model performance review'],
    industries: ['B2B Services', 'Real Estate', 'Finance', 'SaaS'],
    price: 'Starting at $1,500/mo',
  },
  {
    num: '04',
    title: 'Brand Identity & Visual Design',
    tagline: 'Look like you mean business.',
    desc: 'From logo to full brand system. We build cohesive visual identities that scale — wordmarks, colour palettes, typography, brand guidelines, social templates, and print-ready assets. Every brand we create is rooted in market positioning, target audience research, and competitor analysis specific to the GTA.',
    deliverables: ['Logo design (3 concepts)', 'Full brand guidelines document', 'Colour & typography system', 'Social media templates', 'Business card & print collateral', 'Brand asset library (Figma)'],
    industries: ['Startups', 'Retail', 'Food & Beverage', 'Professional Services'],
    price: 'Starting at $2,200',
  },
  {
    num: '05',
    title: 'UX Research & Strategy',
    tagline: 'Design decisions backed by data.',
    desc: 'We run focus groups, usability testing, user interviews, and competitive landscape analysis before a single pixel is designed. Pain point mapping, user journey storyboarding, and information architecture workshops ensure your product is built for how your customers actually think — not how you assume they do.',
    deliverables: ['User persona development', 'Focus group facilitation', 'Usability testing & heatmaps', 'Pain point & journey mapping', 'Information architecture', 'UX strategy report & recommendations'],
    industries: ['Healthcare', 'Education', 'Finance', 'E-Commerce'],
    price: 'Starting at $2,800',
  },
  {
    num: '06',
    title: 'E-Commerce & Conversion Optimization',
    tagline: 'More sales. Less friction.',
    desc: 'We design and optimize e-commerce experiences on Shopify, WooCommerce, and custom Next.js storefronts. Funnel analysis, checkout flow optimization, product page redesigns, and conversion rate testing — all built around getting GTA shoppers to click "buy". We tie every design decision to revenue metrics.',
    deliverables: ['E-commerce platform setup & migration', 'Product & collection page design', 'Checkout flow optimization', 'Payment & shipping integration', 'Conversion rate testing', 'Post-launch performance monitoring'],
    industries: ['Retail', 'Fashion', 'Food & Grocery', 'Health & Wellness'],
    price: 'Starting at $4,500',
  },
];

const PACKAGES = [
  {
    name: 'Starter',
    price: '$3,500',
    desc: 'Perfect for small businesses launching their first professional web presence.',
    features: ['5-page custom website', 'Mobile-responsive design', 'Basic SEO setup', 'Contact form + Google Maps', 'Analytics integration', '30-day post-launch support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$7,200',
    desc: 'For established businesses ready to scale traffic and leads with a full digital strategy.',
    features: ['10-page custom website', 'Full SEO + content strategy', 'AI-powered lead capture', 'CRM integration', 'Blog setup with 4 posts', '3-month support retainer'],
    cta: 'Most Popular',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Multi-location, high-traffic, or complex build with ongoing AI optimization.',
    features: ['Unlimited pages & custom features', 'Full AI traffic & lead stack', 'UX research & brand strategy', 'E-commerce or booking system', 'Dedicated account manager', 'SLA-backed ongoing retainer'],
    cta: 'Book a Call',
    highlight: false,
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <TMINav />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 96px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>
            // what we build
          </p>
          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 900 }}>
            Services designed to<br /><span style={{ color: LIME }}>grow your business</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 620, lineHeight: 1.7 }}>
            Web design, SEO, AI lead generation, and brand strategy for small and medium businesses across Toronto and the GTA. No fluff — just work that moves the needle.
          </p>
        </FadeUp>
      </section>

      {/* Services list */}
      <section style={{ padding: '80px 6vw' }}>
        {SERVICES.map((s, i) => (
          <FadeUp key={s.num} delay={i * 0.04}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.8fr)',
              gap: '3rem',
              padding: '56px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
            className="tmi-service-row">
              {/* Left */}
              <div>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.14em', color: LIME, marginBottom: 12 }}>{s.num}.</p>
                <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>{s.title}</h2>
                <p style={{ fontSize: '0.8rem', color: LIME, fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', marginBottom: 20 }}>{s.tagline}</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>{s.price}</p>
              </div>
              {/* Right */}
              <div>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 28 }}>{s.desc}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginBottom: 24 }}>
                  {s.deliverables.map(d => (
                    <p key={d} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: LIME, fontWeight: 700 }}>→</span> {d}
                    </p>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {s.industries.map(ind => (
                    <span key={ind} style={{ fontSize: '0.65rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', padding: '4px 10px', border: '1px solid rgba(200,241,53,0.25)', color: 'rgba(200,241,53,0.7)', borderRadius: 2 }}>{ind}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* Packages */}
      <section style={{ padding: '80px 6vw 96px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// packages</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 56 }}>Transparent pricing</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }} className="tmi-packages-grid">
          {PACKAGES.map((pkg, i) => (
            <FadeUp key={pkg.name} delay={i * 0.1}>
              <div style={{
                padding: '40px 32px',
                background: pkg.highlight ? LIME : 'rgba(255,255,255,0.03)',
                border: `1px solid ${pkg.highlight ? LIME : 'rgba(255,255,255,0.08)'}`,
                height: '100%',
              }}>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.14em', color: pkg.highlight ? '#080808' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>{pkg.name}</p>
                <p style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: pkg.highlight ? '#080808' : '#fff', letterSpacing: '-0.04em', marginBottom: 12 }}>{pkg.price}</p>
                <p style={{ fontSize: '0.9rem', color: pkg.highlight ? 'rgba(8,8,8,0.65)' : 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 28 }}>{pkg.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {pkg.features.map(f => (
                    <li key={f} style={{ fontSize: '0.85rem', color: pkg.highlight ? '#080808' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ color: pkg.highlight ? '#080808' : LIME, marginTop: 2, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="mailto:admin@baltar.ca" style={{
                  display: 'inline-block', padding: '12px 28px',
                  background: pkg.highlight ? '#080808' : LIME,
                  color: pkg.highlight ? LIME : '#080808',
                  fontFamily: 'Courier New, monospace', fontSize: '0.65rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  fontWeight: 700, textDecoration: 'none', borderRadius: 2,
                }}>
                  {pkg.cta} →
                </a>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6vw', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, marginBottom: 12 }}>// not sure where to start?</p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', maxWidth: 600 }}>Let&apos;s talk about what your business needs.</h2>
        </div>
        <a href="mailto:admin@baltar.ca" style={{
          display: 'inline-block', padding: '18px 40px',
          background: LIME, color: '#080808',
          fontFamily: 'Courier New, monospace', fontSize: '0.7rem',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          fontWeight: 700, textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap',
        }}>
          Start a Project →
        </a>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .tmi-service-row { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .tmi-packages-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
