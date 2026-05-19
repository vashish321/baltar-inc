'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './BaltarInternational.module.css';

const EASE = [0.16, 1, 0.3, 1];

const services = [
  {
    title: 'Cross-Border Advisory',
    desc: 'Strategic guidance for companies expanding into new markets — regulatory navigation, local partnerships, and entry-point strategy.',
  },
  {
    title: 'M&A Strategy',
    desc: 'Buy-side and sell-side advisory for mergers, acquisitions, and investment structuring across North America and beyond.',
  },
  {
    title: 'Global Operations',
    desc: 'Operational frameworks for international scale — supply chain, entity structuring, and multi-jurisdictional compliance.',
  },
];

const stats = [
  { value: '40+', label: 'Markets Advised' },
  { value: '$800M+', label: 'Transaction Value' },
  { value: '15', label: 'Years Operating' },
  { value: '3', label: 'Continents' },
];

const regions = [
  { name: 'North America', countries: 'Canada, United States, Mexico' },
  { name: 'Europe & Middle East', countries: 'United Kingdom, UAE, France' },
  { name: 'Asia-Pacific', countries: 'Singapore, India, Australia' },
];

export default function BaltarInternationalPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80"
          alt="City skyline at night"
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
            BALTAR INTERNATIONAL — TORONTO
          </motion.span>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            Cross-Border<br />Advisory.
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            M&A strategy, global operations, and market entry for companies that think beyond borders.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
          >
            <Link href="/contact-us" className={styles.heroCta}>
              Explore Services
            </Link>
          </motion.div>
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

      {/* Services / Focus areas */}
      <section className={styles.services}>
        <div className={styles.servicesInner}>
          <p className={styles.sectionEyebrow}>OUR FOCUS</p>
          <h2 className={styles.servicesHeading}>Advisory Built for a Borderless World</h2>
          <div className={styles.servicesGrid}>
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <div className={styles.cardTopBorder} />
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardDesc}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions strip */}
      <section className={styles.regions}>
        <div className={styles.regionsInner}>
          <p className={styles.sectionEyebrow}>WHERE WE OPERATE</p>
          <div className={styles.regionsGrid}>
            {regions.map((r, i) => (
              <motion.div
                key={r.name}
                className={styles.regionBlock}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
              >
                <div className={styles.regionAccent} />
                <h3 className={styles.regionName}>{r.name}</h3>
                <p className={styles.regionCountries}>{r.countries}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <div className={styles.ctaStrip}>
        <div className={styles.ctaInner}>
          <p className={styles.ctaText}>Ready to take your business international?</p>
          <Link href="/contact-us" className={styles.ctaButton}>
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
