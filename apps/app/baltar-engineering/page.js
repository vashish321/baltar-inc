'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './BaltarConsulting.module.css';

const EASE = [0.16, 1, 0.3, 1];

const services = [
  {
    num: '01',
    name: 'Structural Engineering',
    desc: 'Load-bearing analysis, foundation design, and full structural certification for residential, commercial, and mixed-use builds.',
  },
  {
    num: '02',
    name: 'Project Management',
    desc: 'End-to-end project delivery from scope definition through completion — on time, on budget, no surprises.',
  },
  {
    num: '03',
    name: 'Site Assessment & Due Diligence',
    desc: 'Feasibility studies, geotechnical review, and pre-acquisition assessment for developers and investors.',
  },
];

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '12', label: 'Years of Practice' },
  { value: '$2B+', label: 'Construction Value' },
  { value: '98%', label: 'On-Time Completion' },
];

const marqueeText = 'STRUCTURAL ENGINEERING · PROJECT MANAGEMENT · SITE ASSESSMENT · FOUNDATION DESIGN · PRECISION DELIVERY · ';

export default function BaltarConsultingPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1920&q=80"
          alt="Construction engineering"
          className={styles.heroBg}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            BALTAR CONSULTANCY — TORONTO
          </motion.span>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            We Build<br />What Matters.
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            Structural engineering and project management for the builds that define cities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
          >
            <Link href="/contact-us" className={styles.heroCta}>
              Start a Project
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Ticker strip */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>

      {/* Services section */}
      <section className={styles.services}>
        <div className={styles.servicesInner}>
          <p className={styles.sectionEyebrow}>WHAT WE DO</p>
          <div className={styles.servicesLayout}>
            <div className={styles.servicesLeft}>
              <h2 className={styles.servicesHeading}>A Fully Integrated Engineering Service</h2>
            </div>
            <div className={styles.servicesRight}>
              {services.map((s, i) => (
                <motion.div
                  key={s.num}
                  className={styles.serviceRow}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                >
                  <div className={styles.serviceTop}>
                    <span className={styles.serviceNum}>{s.num}</span>
                    <h3 className={styles.serviceName}>{s.name}</h3>
                  </div>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                  <hr className={styles.serviceRule} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className={styles.stats}>
        {stats.map((s, i) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* CTA strip */}
      <div className={styles.ctaStrip}>
        <p className={styles.ctaText}>Ready to build something exceptional?</p>
        <Link href="/contact-us" className={styles.ctaButton}>
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
