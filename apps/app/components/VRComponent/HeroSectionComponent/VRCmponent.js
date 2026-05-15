'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SERIF = '"Georgia", "Times New Roman", serif';
const SANS = '"Helvetica Neue", Arial, sans-serif';

const collections = [
  {
    id: 'eyewear',
    title: 'Eyewear',
    sub: 'Architectural frames. Optical precision.',
    src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=80',
    href: '#eyewear',
  },
  {
    id: 'accessories',
    title: 'Accessories',
    sub: 'Leather goods. Considered detail.',
    src: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80',
    href: '#accessories',
  },
  {
    id: 'fragrance',
    title: 'Fragrance',
    sub: 'Rare notes. Lasting impression.',
    src: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=80',
    href: '#fragrance',
  },
];

const editorial = [
  {
    label: 'SS 2026',
    title: 'The Architecture of Form',
    body: 'New season eyewear defined by line, proportion, and the geometry of the face.',
    img: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=700&q=80',
  },
  {
    label: 'Craft',
    title: 'Hand-Finished Leather',
    body: 'Each accessory passes through fifteen pairs of hands before it leaves the atelier.',
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&q=80',
  },
  {
    label: 'Technology',
    title: 'Virtual Try-On',
    body: 'Our AR lens maps your face in milliseconds. Try every frame, anywhere.',
    img: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=700&q=80',
  },
];

function VRNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 3rem', height: '72px',
    backgroundColor: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
    borderBottom: scrolled ? '1px solid #e8e8e8' : '1px solid transparent',
    transition: 'background-color 0.4s, border-color 0.4s',
    fontFamily: SANS,
  };
  const linkStyle = { color: scrolled ? '#111' : '#fff', textDecoration: 'none',
    fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 };

  return (
    <nav style={navStyle}>
      <Link href="/" style={{ ...linkStyle, fontSize: '0.68rem', letterSpacing: '0.18em' }}>← Baltar Inc.</Link>
      <span style={{ ...linkStyle, fontSize: '1rem', fontFamily: SERIF, textTransform: 'none', letterSpacing: '0.04em', fontWeight: 400 }}>VR</span>
      <div style={{ display: 'flex', gap: '2rem' }}>
        {['Collections', 'Editorial', 'Try On', 'Contact'].map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} style={linkStyle}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

export default function VRPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: SANS }}>
      <VRNav />

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, y: heroY }}>
          <img
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1800&q=85"
            alt="VR Collection"
            style={{ width: '100%', height: '115%', objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.55) 100%)' }} />
        </motion.div>

        <motion.div
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', opacity: heroOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', letterSpacing: '0.22em',
              textTransform: 'uppercase', marginBottom: '1.2rem', fontFamily: SANS }}
          >
            Spring / Summer 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2 }}
            style={{ color: '#fff', fontFamily: SERIF, fontSize: 'clamp(3.5rem, 8vw, 8rem)',
              fontWeight: 400, letterSpacing: '-0.01em', textAlign: 'center', lineHeight: 1.05,
              margin: '0 0 2rem', padding: '0 1rem' }}
          >
            VR
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', letterSpacing: '0.06em',
              fontFamily: SERIF, fontStyle: 'italic', marginBottom: '2.5rem' }}
          >
            Luxury Eyewear &amp; Fashion Technology
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}
            style={{ display: 'flex', gap: '1rem' }}
          >
            <a href="#collections" style={{ background: '#fff', color: '#000', padding: '0.85rem 2.5rem',
              textDecoration: 'none', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              fontFamily: SANS, fontWeight: 600 }}>
              Explore
            </a>
            <a href="#try-on" style={{ border: '1px solid rgba(255,255,255,0.7)', color: '#fff',
              padding: '0.85rem 2.5rem', textDecoration: 'none', fontSize: '0.72rem',
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: SANS }}>
              Virtual Try‑On
            </a>
          </motion.div>
        </motion.div>

        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.5)', margin: '0 auto' }}
          />
        </div>
      </section>

      {/* ── Collections ── */}
      <section id="collections" style={{ padding: '8rem 4rem', maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ marginBottom: '4rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '1.5rem',
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
        >
          <h2 style={{ fontFamily: SERIF, fontSize: '2.2rem', fontWeight: 400, color: '#111' }}>Collections</h2>
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>SS 2026</span>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {collections.map((c, i) => (
            <motion.a
              key={c.id} href={c.href}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ scale: 1.01 }}
              style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
            >
              <div style={{ overflow: 'hidden', aspectRatio: '3/4', marginBottom: '1.2rem' }}>
                <motion.img
                  src={c.src} alt={c.title}
                  whileHover={{ scale: 1.06 }} transition={{ duration: 0.7 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <p style={{ fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>{c.id.toUpperCase()}</p>
              <h3 style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 400, color: '#111',
                marginBottom: '0.4rem' }}>{c.title}</h3>
              <p style={{ fontFamily: SERIF, fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>{c.sub}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── AR Try-On Banner ── */}
      <section id="try-on" style={{ background: '#0a0a0a', padding: '8rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
          >
            <p style={{ fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.2em', color: '#888',
              textTransform: 'uppercase', marginBottom: '1.5rem' }}>Technology</p>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400,
              color: '#fff', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              Try before<br />you own.
            </h2>
            <p style={{ fontFamily: SERIF, fontSize: '1.05rem', color: '#aaa', lineHeight: 1.75,
              fontStyle: 'italic', marginBottom: '2rem' }}>
              Our augmented reality engine maps your face in real time. Place any frame, adjust fit,
              compare finishes — before the box ever arrives.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              {['Face mapping in under 2 seconds', 'All 200+ frames available virtually', 'Share looks with friends before buying', 'AI fit recommendations by face shape'].map(f => (
                <div key={f} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />
                  <span style={{ fontFamily: SANS, fontSize: '0.85rem', color: '#ccc', letterSpacing: '0.02em' }}>{f}</span>
                </div>
              ))}
            </div>
            <a href="#waitlist" style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff', padding: '0.9rem 2.5rem', textDecoration: 'none', fontSize: '0.72rem',
              letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: SANS,
              transition: 'border-color 0.3s, background 0.3s' }}>
              Join the Waitlist
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
              alt="AR Try-On"
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem',
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
              padding: '0.8rem 1.2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ color: '#c9a84c', fontSize: '0.65rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', fontFamily: SANS, marginBottom: '0.2rem' }}>Live AR</p>
              <p style={{ color: '#fff', fontSize: '0.8rem', fontFamily: SERIF }}>Architectural Frame — No. 07</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Editorial ── */}
      <section id="editorial" style={{ padding: '8rem 4rem', background: '#fafafa' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ marginBottom: '4rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '1.5rem' }}
          >
            <h2 style={{ fontFamily: SERIF, fontSize: '2.2rem', fontWeight: 400, color: '#111' }}>Editorial</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            {editorial.map((e, i) => (
              <motion.div key={e.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
                  <motion.img src={e.img} alt={e.title}
                    whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }}
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <p style={{ fontFamily: SANS, fontSize: '0.65rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: '#888', marginBottom: '0.6rem' }}>{e.label}</p>
                <h3 style={{ fontFamily: SERIF, fontSize: '1.3rem', fontWeight: 400, color: '#111',
                  marginBottom: '0.8rem', lineHeight: 1.3 }}>{e.title}</h3>
                <p style={{ fontFamily: SERIF, fontSize: '0.9rem', color: '#555', lineHeight: 1.7, fontStyle: 'italic' }}>{e.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist ── */}
      <section id="waitlist" style={{ background: '#111', padding: '7rem 4rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ maxWidth: 560, margin: '0 auto' }}
        >
          <p style={{ fontFamily: SANS, fontSize: '0.68rem', letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>Early Access</p>
          <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400,
            color: '#fff', lineHeight: 1.2, marginBottom: '1.2rem' }}>
            Be First to Experience<br />Virtual Try-On
          </h2>
          <p style={{ fontFamily: SERIF, fontSize: '1rem', color: '#888', fontStyle: 'italic',
            lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Join the waitlist for early access to our AR platform and exclusive first-collection pricing.
          </p>
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form key="form" onSubmit={handleWaitlist}
                style={{ display: 'flex', gap: 0, maxWidth: 440, margin: '0 auto' }}
              >
                <input
                  type="email" required placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, padding: '0.9rem 1.2rem', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.25)', borderRight: 'none', color: '#fff',
                    fontFamily: SANS, fontSize: '0.85rem', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#fff', color: '#111', padding: '0.9rem 1.8rem',
                  border: 'none', cursor: 'pointer', fontFamily: SANS, fontSize: '0.72rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Join
                </button>
              </motion.form>
            ) : (
              <motion.p key="thanks"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ fontFamily: SERIF, color: '#c9a84c', fontSize: '1.05rem', fontStyle: 'italic' }}
              >
                You're on the list. We'll be in touch.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
