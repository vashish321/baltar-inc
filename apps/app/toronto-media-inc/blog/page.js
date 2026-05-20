'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import TMINav from '../TMINav';
import { POSTS } from './posts';

const LIME = '#C8F135';
const EASE = [0.16, 1, 0.3, 1];

const CATEGORIES = ['All', ...Array.from(new Set(POSTS.map(p => p.category)))];

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

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? POSTS : POSTS.filter(p => p.category === activeCategory);
  const [featured, ...rest] = filtered;

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <TMINav />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 80px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, textTransform: 'uppercase', marginBottom: 16 }}>// insights &amp; strategy</p>
          <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 900 }}>
            The TMI<br /><span style={{ color: LIME }}>Blog</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 580, lineHeight: 1.7 }}>
            Web design trends, AI search strategy, SEO tactics, and digital marketing insights for small and medium businesses in Toronto and the GTA.
          </p>
        </FadeUp>
      </section>

      {/* Category filter */}
      <div style={{ padding: '32px 6vw 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 0 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '8px 20px',
              border: '1px solid',
              borderColor: activeCategory === cat ? LIME : 'rgba(255,255,255,0.12)',
              background: activeCategory === cat ? LIME : 'transparent',
              color: activeCategory === cat ? '#080808' : 'rgba(255,255,255,0.5)',
              fontFamily: 'Courier New, monospace', fontSize: '0.6rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: 2, transition: 'all 0.2s',
              marginBottom: 32,
            }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section style={{ padding: '64px 6vw 96px' }}>
        {/* Featured post */}
        {featured && (
          <FadeUp>
            <Link href={`/toronto-media-inc/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 64 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4rem',
                padding: '48px',
                background: 'rgba(200,241,53,0.04)',
                border: '1px solid rgba(200,241,53,0.15)',
                borderRadius: 4,
              }} className="tmi-featured-grid">
                <div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                    <span style={{ fontSize: '0.6rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.14em', color: LIME, padding: '4px 10px', border: `1px solid ${LIME}`, borderRadius: 2 }}>Featured</span>
                    <span style={{ fontSize: '0.6rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>{featured.category}</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.2, marginBottom: 20 }}>{featured.title}</h2>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 28 }}>{featured.excerpt}</p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'Courier New, monospace' }}>{featured.date}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'Courier New, monospace' }}>{featured.readTime}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {featured.tags.map(t => (
                      <span key={t} style={{ fontSize: '0.58rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', padding: '4px 10px', border: '1px solid rgba(200,241,53,0.2)', color: 'rgba(200,241,53,0.6)', borderRadius: 2 }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: LIME, fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', marginTop: 'auto', paddingTop: 24 }}>Read Article →</p>
                </div>
              </div>
            </Link>
          </FadeUp>
        )}

        {/* Post grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }} className="tmi-blog-grid">
          {rest.map((post, i) => (
            <FadeUp key={post.slug} delay={i * 0.07}>
              <Link href={`/toronto-media-inc/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <div style={{
                  padding: '32px 28px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'border-color 0.2s, background 0.2s',
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: '0.58rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.12em', color: LIME, textTransform: 'uppercase' }}>{post.category}</span>
                  </div>
                  <h3 style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.4, marginBottom: 16, flex: 1 }}>{post.title}</h3>
                  <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 24 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'Courier New, monospace' }}>{post.date}</span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'Courier New, monospace' }}>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section style={{ padding: '64px 6vw', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="tmi-newsletter-grid">
            <div>
              <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, marginBottom: 12 }}>// stay ahead of the curve</p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>
                Digital strategy insights for GTA businesses — in your inbox.
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                We publish practical guides on web design, AI search, SEO, and digital marketing every two weeks. No fluff, no spam.
              </p>
            </div>
            <div>
              <a href="mailto:admin@baltar.ca?subject=TMI Blog Newsletter" style={{
                display: 'inline-block', padding: '18px 40px',
                background: LIME, color: '#080808',
                fontFamily: 'Courier New, monospace', fontSize: '0.7rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                fontWeight: 700, textDecoration: 'none', borderRadius: 2,
              }}>
                Subscribe via Email →
              </a>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: 12, fontFamily: 'Courier New, monospace' }}>
                admin@baltar.ca · Toronto, ON
              </p>
            </div>
          </div>
        </FadeUp>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .tmi-blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .tmi-featured-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .tmi-blog-grid { grid-template-columns: 1fr !important; }
          .tmi-newsletter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
