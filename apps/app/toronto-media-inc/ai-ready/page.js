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

const PILLARS = [
  {
    num: '01',
    title: 'AI-Optimized Content Architecture',
    desc: 'Modern AI search engines (Google\'s SGE, ChatGPT Search, Perplexity) don\'t crawl the web the same way traditional bots do. Being AI Ready means your content is structured with entity-based SEO, semantic HTML, and machine-readable schema so AI discovery engines can surface you — not your competitors.',
    features: ['Entity-based content structuring', 'Schema.org markup for AI parsing', 'Semantic HTML + heading hierarchy', 'AI search snippet optimization'],
  },
  {
    num: '02',
    title: 'Predictive Traffic Engines',
    desc: 'We deploy ML-powered analytics pipelines that analyze your user behaviour, identify patterns, and predict what content and pages will drive the most conversions — before you publish them. Continuous learning models update weekly based on actual traffic data, meaning your digital strategy gets smarter every month.',
    features: ['Behaviour pattern analysis', 'Predictive content scoring', 'Conversion funnel ML optimization', 'Weekly model retraining cycles'],
  },
  {
    num: '03',
    title: 'AI-Powered Lead Capture',
    desc: 'Standard contact forms capture 2–4% of visitors. Our AI lead capture systems use real-time behavioural signals — scroll depth, page time, click patterns — to trigger personalized CTAs at the moment a visitor is most likely to convert. Dynamic micro-copy, smart exit-intent, and form pre-fill from known data sources.',
    features: ['Behavioural trigger CTAs', 'Real-time personalization engine', 'Smart exit-intent detection', 'Form pre-fill from browser signals'],
  },
  {
    num: '04',
    title: 'Continuous Learning SEO',
    desc: 'Static SEO is dead. AI-powered SEO uses large language models to monitor SERP changes, analyse competitor content gaps, generate topical cluster opportunities, and recommend keyword pivots — automatically. Your content strategy evolves in real time as search intent shifts.',
    features: ['LLM-powered SERP monitoring', 'Automated content gap analysis', 'Topical cluster generation', 'Intent-shift keyword alerts'],
  },
  {
    num: '05',
    title: 'Conversational AI Integration',
    desc: 'Deploy AI chat assistants trained on your business — your services, your FAQs, your pricing, your location. Unlike generic chatbots, TMI-built AI assistants use Retrieval-Augmented Generation (RAG) to answer questions accurately, qualify leads, and route hot prospects to your inbox 24/7.',
    features: ['Business-trained AI chat (RAG)', 'Lead qualification & scoring', 'Appointment booking integration', 'Handoff to human when needed'],
  },
  {
    num: '06',
    title: 'Data Infrastructure for AI',
    desc: 'AI is only as good as the data feeding it. We audit your existing data sources, set up structured data pipelines, and build first-party data collection systems that give your AI models clean, labelled training data. From event tracking schemas to CRM sync — your data stack becomes your competitive moat.',
    features: ['First-party data strategy', 'Event tracking schema design', 'CRM data pipeline & sync', 'Data quality audits & hygiene'],
  },
];

const STATS = [
  { val: '3.2×', label: 'avg. traffic increase with AI content stack' },
  { val: '41%', label: 'higher lead capture vs. standard forms' },
  { val: '78%', label: 'of AI-optimized pages rank on page 1 within 90 days' },
  { val: '$0', label: 'additional ad spend required for organic AI traffic' },
];

const STEPS = [
  { step: '01', title: 'AI Readiness Audit', desc: 'We assess your current site, content, data infrastructure, and competitive position. You get a scored report with a prioritized roadmap.' },
  { step: '02', title: 'Infrastructure Build', desc: 'We implement the technical foundation — schema markup, data pipelines, analytics, and CMS integrations — that AI systems require.' },
  { step: '03', title: 'AI Layer Deployment', desc: 'Content targeting models, lead capture systems, and conversational AI go live. All connected to your existing workflows.' },
  { step: '04', title: 'Continuous Optimization', desc: 'Monthly model reviews, A/B testing cycles, and SERP monitoring keep your AI stack performing as the digital landscape evolves.' },
];

export default function AIReadyPage() {
  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <TMINav />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 96px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        {/* Background glyph */}
        <div style={{
          position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)',
          fontSize: 'clamp(14rem, 30vw, 26rem)', fontWeight: 900, color: 'rgba(255,255,255,0.025)',
          lineHeight: 1, pointerEvents: 'none', letterSpacing: '-0.05em', userSelect: 'none',
        }}>AI</div>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// being ai ready</p>
          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 860, position: 'relative' }}>
            The future of search<br />is <span style={{ color: LIME }}>AI-powered.</span><br />Is your business ready?
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 600, lineHeight: 1.7, marginBottom: 40 }}>
            AI is reshaping how people find businesses, how search engines rank content, and how websites convert visitors into clients. Toronto Media Inc. builds the systems that put your business ahead of this shift — not behind it.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="mailto:admin@baltar.ca" style={{
              display: 'inline-block', padding: '16px 36px',
              background: LIME, color: '#080808',
              fontFamily: 'Courier New, monospace', fontSize: '0.68rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontWeight: 700, textDecoration: 'none', borderRadius: 2,
            }}>
              Get Your AI Audit →
            </a>
            <a href="/toronto-media-inc/services" style={{
              display: 'inline-block', padding: '16px 36px',
              background: 'transparent', color: LIME,
              fontFamily: 'Courier New, monospace', fontSize: '0.68rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontWeight: 700, textDecoration: 'none', borderRadius: 2,
              border: `1px solid ${LIME}`,
            }}>
              View Services
            </a>
          </div>
        </FadeUp>
      </section>

      {/* Stats */}
      <FadeUp>
        <section style={{ padding: '56px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ flex: '1 1 200px' }}>
              <p style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: LIME, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{s.val}</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
        </section>
      </FadeUp>

      {/* The 6 pillars */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// what we build</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 64 }}>The 6 pillars of being AI Ready</h2>
        </FadeUp>
        {PILLARS.map((p, i) => (
          <FadeUp key={p.num} delay={i * 0.04}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 1.2fr',
              gap: '2.5rem',
              padding: '48px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              alignItems: 'start',
            }} className="tmi-ai-pillar-row">
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.14em', color: LIME, paddingTop: 4 }}>{p.num}.</p>
              <div>
                <h3 style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>{p.title}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>{p.desc}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map(f => (
                  <p key={f} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: LIME, fontFamily: 'Courier New, monospace', fontSize: '0.65rem' }}>→</span> {f}
                  </p>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 12 }}>// the process</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 64 }}>How we get you there</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }} className="tmi-steps-grid">
          {STEPS.map((s, i) => (
            <FadeUp key={s.step} delay={i * 0.1}>
              <div style={{ padding: '36px 28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.14em', color: LIME, marginBottom: 20 }}>{s.step}.</p>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Callout: why now */}
      <section style={{ padding: '80px 6vw', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(200,241,53,0.04)' }}>
        <FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="tmi-ai-callout-grid">
            <div>
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// why now</p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 24 }}>
                Your competitors are already building their AI advantage.
              </h2>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 24 }}>
                In 2024, over 60% of Google searches ended with zero clicks — users got their answer directly from AI summaries. By 2026, AI-powered search is projected to handle over 80% of informational queries. Businesses that aren&apos;t structuring their content and data for AI discovery won&apos;t just rank lower — they&apos;ll be invisible.
              </p>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
                The GTA&apos;s small and medium business market is at an inflection point. The window to establish AI authority — before your competitors do — is right now.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                ['60%+', 'of Google searches already use AI-generated answers'],
                ['3.2×', 'more organic traffic for AI-optimized sites vs. traditional SEO'],
                ['2026', 'projected year AI search surpasses traditional search volume'],
                ['$0', 'extra ad spend needed when AI traffic pipelines are running'],
              ].map(([val, label]) => (
                <div key={val} style={{ padding: '20px 24px', background: 'rgba(200,241,53,0.06)', border: '1px solid rgba(200,241,53,0.15)', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 20 }}>
                  <p style={{ fontSize: '1.8rem', fontWeight: 800, color: LIME, letterSpacing: '-0.04em', minWidth: 80 }}>{val}</p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 6vw 96px' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, marginBottom: 16 }}>// start your ai journey</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16, maxWidth: 700 }}>
            Free AI Readiness Audit for GTA businesses.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
            We&apos;ll assess your current site, score your AI readiness across 6 dimensions, and deliver a prioritized roadmap — at no cost.
          </p>
          <a href="mailto:admin@baltar.ca" style={{
            display: 'inline-block', padding: '18px 44px',
            background: LIME, color: '#080808',
            fontFamily: 'Courier New, monospace', fontSize: '0.72rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            fontWeight: 700, textDecoration: 'none', borderRadius: 2,
          }}>
            Claim Your Free Audit →
          </a>
        </FadeUp>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .tmi-steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .tmi-ai-pillar-row { grid-template-columns: 1fr !important; }
          .tmi-steps-grid { grid-template-columns: 1fr !important; }
          .tmi-ai-callout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
