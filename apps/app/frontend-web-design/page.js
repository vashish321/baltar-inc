'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './FrontendMedia.module.css';

const EASE = [0.16, 1, 0.3, 1];

const services = [
  {
    title: 'Web Design & UI',
    desc: 'Custom interfaces crafted for clarity, speed, and conversion — from landing pages to full product suites.',
  },
  {
    title: 'Frontend Development',
    desc: 'React, Next.js, and modern web technologies built to perform at scale with pixel-perfect execution.',
  },
  {
    title: 'UX Strategy',
    desc: 'User research, information architecture, and wireframing that drive measurable engagement.',
  },
  {
    title: 'SEO & Performance',
    desc: 'Technical SEO audits, Core Web Vitals optimisation, and performance tuning for top-tier rankings.',
  },
];

const stats = [
  { value: '150+', label: 'Sites Launched' },
  { value: '95%', label: 'Client Retention' },
  { value: '7', label: 'Years Building' },
  { value: '40+', label: 'Industries' },
];

const steps = [
  { num: '01', title: 'Discovery', desc: 'Deep-dive into your business goals, audience, and competitive landscape.' },
  { num: '02', title: 'Design', desc: 'High-fidelity mockups and interactive prototypes reviewed with your team.' },
  { num: '03', title: 'Build', desc: 'Clean, maintainable code shipped with full CMS integration and testing.' },
  { num: '04', title: 'Launch', desc: 'Deployment, performance audits, and ongoing support to keep you ahead.' },
];

const workTiles = [
  {
    img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=700&q=80',
    label: 'Brand Identity',
  },
  {
    img: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=700&q=80',
    label: 'Product UI',
  },
  {
    img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=700&q=80',
    label: 'E-Commerce',
  },
];

export default function FrontendMediaIncPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBgNumber}>FMI</div>
        <div className={styles.heroContent}>
          <motion.span
            className={styles.heroLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            FRONTEND MEDIA INC. — BALTAR TECHNOLOGIES
          </motion.span>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            Websites That<br /><em>Win.</em>
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            Design, development, and digital strategy — built for brands that refuse to be ignored.
          </motion.p>
          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
          >
            <Link href="/contact-us" className={styles.ctaPrimary}>
              Start a Project
            </Link>
            <a href="#services" className={styles.ctaGhost}>
              View Services ↓
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Services */}
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
            <div className={styles.serviceTopRule} />
          </div>
          <div className={styles.servicesRight}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
              alt="Web design work"
              className={styles.servicesImage}
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className={styles.process}>
        <div className={styles.processInner}>
          <h2 className={styles.processHeading}>How We Work</h2>
          <div className={styles.processGrid}>
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className={styles.processStep}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              >
                <div className={styles.processNum}>{step.num}</div>
                <h3 className={styles.processStepTitle}>{step.title}</h3>
                <p className={styles.processStepDesc}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio strip */}
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
        <p className={styles.ctaAccent}>Ready to build something remarkable?</p>
        <Link href="/contact-us" className={styles.ctaButton}>
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
