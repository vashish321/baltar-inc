'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './TorontoMedia.module.css';

const EASE = [0.16, 1, 0.3, 1];

const services = [
  {
    title: 'Digital Media Production',
    desc: 'Video, photography, and content creation built for the platforms that matter.',
  },
  {
    title: 'Brand Storytelling',
    desc: 'Campaign strategy, creative direction, and distribution.',
  },
  {
    title: 'Media Consulting',
    desc: 'Audience development, monetisation strategy, and digital transformation advisory.',
  },
];

const stats = [
  { value: '200+', label: 'Productions' },
  { value: '85+', label: 'Brand Clients' },
  { value: '12', label: 'Industries Served' },
  { value: '8', label: 'Years Active' },
];

const workTiles = [
  {
    img: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=600&q=80',
    label: 'Brand Campaign',
  },
  {
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
    label: 'Editorial Content',
  },
  {
    img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
    label: 'Social Media',
  },
];

export default function TorontoMediaIncPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.span
            className={styles.heroLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            TORONTO MEDIA INC. — BALTAR TECHNOLOGIES
          </motion.span>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            Digital Media.<br />Brands That Move.
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            Video, photography, brand storytelling, and content strategy — rooted in Toronto, built for audiences everywhere.
          </motion.p>
          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
          >
            <Link href="/contact-us" className={styles.ctaPrimary}>
              Work With Us
            </Link>
            <a href="#services" className={styles.ctaGhost}>
              View Services ↓
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats row */}
      <section className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Services section */}
      <section className={styles.services} id="services">
        <div className={styles.servicesInner}>
          <div className={styles.servicesLeft}>
            <p className={styles.sectionEyebrow}>WHAT WE DO</p>
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                className={styles.serviceRow}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              >
                <div className={styles.serviceTopRule} />
                <div className={styles.serviceRowInner}>
                  <div className={styles.serviceText}>
                    <h3 className={styles.serviceTitle}>{s.title}</h3>
                    <p className={styles.serviceDesc}>{s.desc}</p>
                  </div>
                  <span className={styles.serviceArrow}>→</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className={styles.servicesRight}>
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80"
              alt="Media production"
              className={styles.servicesImage}
            />
          </div>
        </div>
      </section>

      {/* Featured work strip */}
      <section className={styles.work}>
        <div className={styles.workInner}>
          <p className={styles.sectionEyebrow}>FEATURED WORK</p>
          <div className={styles.workGrid}>
            {workTiles.map((tile, i) => (
              <motion.div
                key={tile.label}
                className={styles.workTile}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              >
                <img src={tile.img} alt={tile.label} className={styles.workImg} />
                <div className={styles.workOverlay}>
                  <span className={styles.workLabel}>{tile.label}</span>
                  <span className={styles.workArrow}>↗</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <div className={styles.ctaStrip}>
        <p className={styles.ctaAccent}>Tell your story at the highest level.</p>
        <Link href="/contact-us" className={styles.ctaButton}>
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
