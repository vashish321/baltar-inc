'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import TMINav from '../../TMINav';
import { POSTS } from '../posts';

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

function renderBlock(block, i) {
  if (block.type === 'h2') {
    return (
      <h2 key={i} style={{
        fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 700,
        letterSpacing: '-0.02em', color: '#fff',
        marginTop: 48, marginBottom: 16, lineHeight: 1.3,
      }}>
        {block.text}
      </h2>
    );
  }
  if (block.type === 'p') {
    return (
      <p key={i} style={{
        fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.85, marginBottom: 20,
      }}>
        {block.text}
      </p>
    );
  }
  return null;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = POSTS.find(p => p.slug === slug);
  const related = POSTS.filter(p => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div style={{ background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <TMINav />
        <div style={{ padding: '160px 6vw 96px', textAlign: 'center' }}>
          <p style={{ color: LIME, fontFamily: 'Courier New, monospace', marginBottom: 16 }}>// 404</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>Post not found</h1>
          <Link href="/toronto-media-inc/blog" style={{ color: LIME, fontFamily: 'Courier New, monospace', fontSize: '0.8rem', letterSpacing: '0.1em' }}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <TMINav />

      {/* JSON-LD for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        keywords: post.tags.join(', '),
        author: { '@type': 'Organization', name: 'Toronto Media Inc.' },
        publisher: { '@type': 'Organization', name: 'Toronto Media Inc.', url: 'https://www.baltar.ca/toronto-media-inc' },
        datePublished: post.date,
        mainEntityOfPage: `https://www.baltar.ca/toronto-media-inc/blog/${post.slug}`,
      })}} />

      {/* Hero */}
      <section style={{ padding: '140px 6vw 64px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <FadeUp>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
            <Link href="/toronto-media-inc/blog" style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
              ← Blog
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
            <span style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: LIME }}>{post.category}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 800 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Courier New, monospace' }}>{post.date}</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Courier New, monospace' }}>{post.readTime}</span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Courier New, monospace' }}>Toronto Media Inc.</span>
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 700, lineHeight: 1.7 }}>{post.excerpt}</p>
        </FadeUp>
      </section>

      {/* Article body */}
      <section style={{ padding: '64px 6vw', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '5rem', alignItems: 'start' }} className="tmi-article-grid">
        {/* Content */}
        <FadeUp>
          <article>
            {post.body.map((block, i) => renderBlock(block, i))}
          </article>

          {/* Tags */}
          <div style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>// topics</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {post.tags.map(t => (
                <span key={t} style={{ fontSize: '0.62rem', fontFamily: 'Courier New, monospace', letterSpacing: '0.1em', padding: '5px 12px', border: '1px solid rgba(200,241,53,0.2)', color: 'rgba(200,241,53,0.6)', borderRadius: 2 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 56, padding: '40px', background: 'rgba(200,241,53,0.04)', border: '1px solid rgba(200,241,53,0.15)', borderRadius: 4 }}>
            <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.62rem', letterSpacing: '0.14em', color: LIME, marginBottom: 12 }}>// need help with this?</p>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Toronto Media Inc. builds digital systems that drive real results.
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 24 }}>
              Web design, SEO, AI-powered lead generation, and brand strategy for small and medium businesses across the GTA.
            </p>
            <a href="mailto:admin@baltar.ca" style={{
              display: 'inline-block', padding: '14px 32px',
              background: LIME, color: '#080808',
              fontFamily: 'Courier New, monospace', fontSize: '0.65rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontWeight: 700, textDecoration: 'none', borderRadius: 2,
            }}>
              Start a Project →
            </a>
          </div>
        </FadeUp>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ padding: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 }}>
            <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.14em', color: LIME, marginBottom: 16 }}>// about the author</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              Toronto Media Inc. is a digital agency specializing in web design, SEO, and AI-powered marketing for GTA businesses. We publish practical guides for small and medium business owners every two weeks.
            </p>
          </div>
          <div style={{ padding: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.6rem', letterSpacing: '0.14em', color: LIME, marginBottom: 16 }}>// services</p>
            {['Web Design', 'SEO & Content', 'AI Lead Generation', 'Brand Identity', 'UX Research', 'E-Commerce'].map(s => (
              <Link key={s} href="/toronto-media-inc/services" style={{
                display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none', padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                transition: 'color 0.2s',
              }}>
                → {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section style={{ padding: '64px 6vw 96px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <FadeUp>
            <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.65rem', letterSpacing: '0.16em', color: LIME, marginBottom: 40 }}>// more from the blog</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }} className="tmi-related-grid">
            {related.map((p, i) => (
              <FadeUp key={p.slug} delay={i * 0.08}>
                <Link href={`/toronto-media-inc/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <div style={{ padding: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', height: '100%' }}>
                    <p style={{ fontFamily: 'Courier New, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', color: LIME, marginBottom: 12 }}>{p.category}</p>
                    <h4 style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.4, marginBottom: 12 }}>{p.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'Courier New, monospace' }}>{p.date}</p>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .tmi-article-grid { grid-template-columns: 1fr !important; }
          .tmi-related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .tmi-related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
