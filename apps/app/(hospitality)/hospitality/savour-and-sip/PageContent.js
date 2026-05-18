'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const U = 'https://images.unsplash.com/photo-';

const IMGS = {
  hero:       `${U}1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85`,
  intro:      `${U}1424847651672-bf20a4b0982b?auto=format&fit=crop&w=900&q=80`,
  service1:   `${U}1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80`,
  service2:   `${U}1510626176961-4b57d4fbad03?auto=format&fit=crop&w=800&q=80`,
  service3:   `${U}1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80`,
  gallery1:   `${U}1600891964599-d7f18b61c1d4?auto=format&fit=crop&w=900&q=80`,
  gallery2:   `${U}1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80`,
  gallery3:   `${U}1528605248644-14dd04022da1?auto=format&fit=crop&w=600&q=80`,
  gallery4:   `${U}1551218372-a8789b81b253?auto=format&fit=crop&w=600&q=80`,
  gallery5:   `${U}1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80`,
  cta:        `${U}1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85`,
};

const EASE = [0.16, 1, 0.3, 1];

const CREAM   = '#FAF8F3';
const INK     = '#1C1714';
const GOLD    = '#8B6914';
const GOLD_LT = '#C4955A';
const MUTED   = 'rgba(28,23,20,0.45)';
const RULE    = 'rgba(28,23,20,0.1)';

/* ─── reusable fade-up wrapper ─── */
function FadeUp({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Savour Nav ─── */
function SavourNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const navStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 48px',
    height: 72,
    transition: 'background 0.3s ease, box-shadow 0.3s ease',
    background: scrolled ? 'rgba(250,248,243,0.96)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    boxShadow: scrolled ? '0 1px 0 rgba(28,23,20,0.08)' : 'none',
  };

  const linkColor = scrolled ? INK : '#fff';

  return (
    <>
      <nav style={navStyle}>
        <Link href="/" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: linkColor, textDecoration: 'none', fontWeight: 600, transition: 'color 0.3s' }}>
          Baltar Inc.
        </Link>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link href="/hospitality/savour-and-sip" style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.12em', color: linkColor, textDecoration: 'none', transition: 'color 0.3s' }}>
            Savour &amp; Sip
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <Link href="/hospitality/savour-and-sip/menu" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: linkColor, textDecoration: 'none', transition: 'color 0.3s' }}>Menu</Link>
          <Link href="/hospitality/savour-and-sip/events" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: linkColor, textDecoration: 'none', transition: 'color 0.3s' }}>Events</Link>
          <a href="mailto:hospitality@baltar.ca" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 24px', border: `1px solid ${scrolled ? INK : 'rgba(255,255,255,0.6)'}`, color: linkColor, textDecoration: 'none', transition: 'all 0.3s' }}>
            Reserve
          </a>
        </div>
      </nav>
    </>
  );
}

/* ─── Marquee ─── */
const MARQUEE_ITEMS = ['Private Dining', '·', 'Curated Bar Programs', '·', 'Full-Service Events', '·', 'Corporate Dining', '·', 'Wedding Receptions', '·', 'Toronto & GTA', '·'];

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ overflow: 'hidden', borderTop: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}`, padding: '20px 0', background: CREAM }}>
      <motion.div
        style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      >
        {items.map((item, i) => (
          <span key={i} style={{
            fontSize: '0.72rem',
            fontWeight: item === '·' ? 400 : 500,
            letterSpacing: item === '·' ? 0 : '0.14em',
            textTransform: 'uppercase',
            color: item === '·' ? GOLD_LT : INK,
          }}>
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Menu highlights data ─── */
const menuItems = [
  { category: 'Starters', name: 'Seared Scallops', desc: 'Cauliflower purée, hazelnut brown butter, micro herbs, crispy capers' },
  { category: 'Starters', name: 'Burrata & Heritage Tomato', desc: 'Aged balsamic, basil oil, fleur de sel, warm focaccia' },
  { category: 'Mains',    name: 'Dry-Aged Duck Breast', desc: 'Parsnip & truffle mash, cherry reduction, wilted watercress' },
  { category: 'Mains',    name: 'Pan-Roasted Atlantic Halibut', desc: 'Saffron beurre blanc, fennel confit, heirloom carrots' },
  { category: 'Desserts', name: 'Valrhona Chocolate Délice', desc: 'Tahini ice cream, salted caramel, praline feuilletine' },
];

export default function PageContent() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', guests: '', date: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'hospitality' }),
      });
    } catch {}
    setFormSent(true);
  };

  return (
    <div style={{ background: CREAM, color: INK, minHeight: '100vh', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <SavourNav />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '100svh', minHeight: 640, overflow: 'hidden' }}>
        <Image src={IMGS.hero} alt="Elegantly set dining table" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.55) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 100, textAlign: 'center', zIndex: 2 }}>
          <motion.span
            style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: 24 }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            Baltar Hospitality
          </motion.span>
          <motion.h1
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 7vw, 6.5rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em', color: '#fff', margin: '0 0 28px', maxWidth: 900, padding: '0 24px' }}
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          >
            The Art of the<br />Shared Table
          </motion.h1>
          <motion.div
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.65, ease: EASE }}
          >
            <a href="mailto:hospitality@baltar.ca" style={{ padding: '14px 40px', background: CREAM, color: INK, fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Reserve a Table
            </a>
            <a href="#menu" style={{ padding: '14px 40px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.55)', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
              View Menu
            </a>
          </motion.div>
        </div>
        {/* Scroll cue */}
        <motion.div
          style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.div
            style={{ width: '1.5px', height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.05))' }}
            animate={{ scaleY: [1, 0.4, 1], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── INTRO ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '65vh' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image src={IMGS.intro} alt="Restaurant atmosphere" fill sizes="50vw" style={{ objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 80px 80px 72px', background: '#FDF9F2' }}>
          <FadeUp>
            <div style={{ width: 40, height: 1, background: GOLD, marginBottom: 36 }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 24 }}>Our Philosophy</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 2.8vw, 2.8rem)', fontWeight: 400, lineHeight: 1.2, color: INK, margin: '0 0 24px' }}>
              Hospitality as<br />an Art Form
            </h2>
            <p style={{ fontSize: '0.92rem', color: MUTED, lineHeight: 1.85, maxWidth: 400, margin: '0 0 20px' }}>
              We believe the finest meals are inseparable from the moments they create. Savour & Sip curates dining experiences across Toronto and the GTA — each one shaped by seasonal ingredients, considered pairings, and an unflinching attention to detail.
            </p>
            <p style={{ fontSize: '0.92rem', color: MUTED, lineHeight: 1.85, maxWidth: 400, margin: '0 0 40px' }}>
              From intimate private dinners to large-scale galas, our team manages every element so you can be fully present in the moment.
            </p>
            <a href="#services" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: INK, textDecoration: 'none', fontWeight: 600, borderBottom: `1px solid ${INK}`, paddingBottom: 4 }}>
              Our Services <span>→</span>
            </a>
          </FadeUp>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: '120px 80px', background: CREAM }}>
        <FadeUp>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 16 }}>What We Offer</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', fontWeight: 400, color: INK, margin: '0 0 80px', lineHeight: 1.1 }}>
            Curated Experiences,<br />Delivered Flawlessly
          </h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[
            { num: '01', title: 'Private Dining & Catering', desc: 'Seasonal tasting menus crafted from locally sourced ingredients, presented with the precision of a fine dining kitchen — delivered to your chosen venue.', img: IMGS.service1 },
            { num: '02', title: 'Curated Bar Programs', desc: 'Bespoke cocktail menus, sommelier-selected wine pairings, and zero-proof programs designed to complement every course and occasion.', img: IMGS.service2 },
            { num: '03', title: 'Full-Service Events', desc: 'From intimate gatherings of twenty to gala evenings of five hundred — we manage every operational detail so your guests experience seamless hospitality.', img: IMGS.service3 },
          ].map((s, i) => (
            <FadeUp key={s.num} delay={i * 0.1}>
              <div style={{ background: '#fff', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
                  <Image src={s.img} alt={s.title} fill sizes="33vw" style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '40px 36px 48px' }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: '2.4rem', color: `rgba(139,105,20,0.2)`, display: 'block', marginBottom: 20, lineHeight: 1 }}>{s.num}</span>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: INK, margin: '0 0 16px' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: MUTED, lineHeight: 1.8, margin: '0 0 28px' }}>{s.desc}</p>
                  <a href="mailto:hospitality@baltar.ca" style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD, textDecoration: 'none', fontWeight: 600 }}>
                    Enquire →
                  </a>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section style={{ padding: '0 80px 120px', background: CREAM }}>
        <FadeUp style={{ marginBottom: 48 }}>
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 12 }}>Portfolio</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 400, color: INK, margin: 0 }}>
            A Taste of Our Work
          </h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 4 }}>
          {[IMGS.gallery1, IMGS.gallery2, IMGS.gallery3, IMGS.gallery4, IMGS.gallery5].map((src, i) => (
            <FadeUp key={i} delay={i * 0.07} style={{
              position: 'relative',
              overflow: 'hidden',
              gridRow: i === 0 ? '1 / 3' : 'auto',
              aspectRatio: i === 0 ? '3/4' : '4/3',
            }}>
              <Image src={src} alt={`Gallery ${i + 1}`} fill sizes="33vw" style={{ objectFit: 'cover' }} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── MENU HIGHLIGHTS ── */}
      <section id="menu" style={{ background: '#FDF9F2', padding: '120px 80px', borderTop: `1px solid ${RULE}` }}>
        <FadeUp>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
            <div>
              <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 16 }}>From the Kitchen</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: INK, margin: 0, lineHeight: 1.1 }}>Menu Highlights</h2>
            </div>
            <Link href="/hospitality/savour-and-sip/menu" style={{ fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: INK, textDecoration: 'none', fontWeight: 600, borderBottom: `1px solid ${INK}`, paddingBottom: 3 }}>
              Full Menu →
            </Link>
          </div>
        </FadeUp>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 32, alignItems: 'center', padding: '28px 0', borderTop: i === 0 ? `1px solid ${RULE}` : 'none', borderBottom: `1px solid ${RULE}` }}>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>{item.category}</span>
                <div>
                  <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 400, color: INK, margin: '0 0 6px' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: MUTED, margin: 0, lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ padding: '120px 80px', background: INK, textAlign: 'center' }}>
        <FadeUp>
          <div style={{ width: 40, height: 1, background: GOLD_LT, margin: '0 auto 48px' }} />
          <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', fontWeight: 400, lineHeight: 1.35, color: '#fff', maxWidth: 820, margin: '0 auto 40px', letterSpacing: '-0.01em' }}>
            "The kind of evening you spend weeks trying to explain to people who weren't there."
          </blockquote>
          <cite style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD_LT, fontStyle: 'normal' }}>
            — Corporate Client, Toronto
          </cite>
        </FadeUp>
      </section>

      {/* ── CTA / BOOKING ── */}
      <section style={{ position: 'relative', minHeight: '65vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <Image src={IMGS.cta} alt="Dining atmosphere" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,6,4,0.72)' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 760, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
          <FadeUp>
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD_LT, display: 'block', marginBottom: 24 }}>Reserve Your Evening</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, margin: '0 0 28px' }}>
              Every Detail Considered,<br />Every Moment Yours
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 48, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              Corporate dinners, private celebrations, wedding receptions, brand activations — we bring your vision to life with precision and grace.
            </p>
            <a href="mailto:hospitality@baltar.ca" style={{ display: 'inline-block', padding: '16px 52px', background: CREAM, color: INK, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Begin the Conversation
            </a>
          </FadeUp>
        </div>
      </section>

      {/* ── ENQUIRY FORM ── */}
      <section style={{ background: CREAM, padding: '120px 80px', borderTop: `1px solid ${RULE}` }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <FadeUp>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: GOLD, display: 'block', marginBottom: 16 }}>Make an Enquiry</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, color: INK, margin: '0 0 48px', lineHeight: 1.15 }}>
              Tell Us About Your Event
            </h2>
          </FadeUp>
          <AnimatePresence mode="wait">
            {formSent ? (
              <motion.div key="success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '1.2rem', color: '#fff' }}>✓</div>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 400, color: INK, margin: '0 0 12px' }}>Thank You</h3>
                <p style={{ fontSize: '0.9rem', color: MUTED, lineHeight: 1.7 }}>We'll be in touch within 24 hours to discuss your event.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { label: 'Your Name', field: 'name', type: 'text', placeholder: 'Full name' },
                  { label: 'Email Address', field: 'email', type: 'email', placeholder: 'your@email.com' },
                  { label: 'Number of Guests', field: 'guests', type: 'text', placeholder: 'Approx. number' },
                  { label: 'Preferred Date', field: 'date', type: 'date', placeholder: '' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: INK, display: 'block', marginBottom: 10, fontWeight: 600 }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[field]}
                      onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
                      style={{ width: '100%', padding: '14px 0', background: 'transparent', border: 'none', borderBottom: `1px solid rgba(28,23,20,0.2)`, color: INK, fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.currentTarget.style.borderBottomColor = GOLD}
                      onBlur={e => e.currentTarget.style.borderBottomColor = 'rgba(28,23,20,0.2)'}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: INK, display: 'block', marginBottom: 10, fontWeight: 600 }}>Tell Us More</label>
                  <textarea
                    placeholder="Describe your event, occasion, dietary requirements..."
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    style={{ width: '100%', padding: '14px 0', background: 'transparent', border: 'none', borderBottom: `1px solid rgba(28,23,20,0.2)`, color: INK, fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.currentTarget.style.borderBottomColor = GOLD}
                    onBlur={e => e.currentTarget.style.borderBottomColor = 'rgba(28,23,20,0.2)'}
                  />
                </div>
                <button type="submit" style={{ alignSelf: 'flex-start', marginTop: 16, padding: '16px 48px', background: INK, color: CREAM, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#3a2e29'}
                  onMouseLeave={e => e.currentTarget.style.background = INK}
                >
                  Send Enquiry
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: INK, color: 'rgba(255,255,255,0.5)', padding: '56px 80px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 32, flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.08em', marginBottom: 8 }}>Savour &amp; Sip</div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>A Baltar Hospitality Company</div>
          </div>
          <nav style={{ display: 'flex', gap: 36 }}>
            {[
              { label: 'Menu', href: '/hospitality/savour-and-sip/menu' },
              { label: 'Events', href: '/hospitality/savour-and-sip/events' },
              { label: 'Services', href: '/hospitality/savour-and-sip/services' },
              { label: 'Pricing', href: '/hospitality/savour-and-sip/pricing' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = GOLD_LT}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: '0.68rem' }}>© {new Date().getFullYear()} Savour &amp; Sip. All rights reserved.</span>
          <Link href="/" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Baltar Inc. ↗</Link>
        </div>
      </footer>
    </div>
  );
}
