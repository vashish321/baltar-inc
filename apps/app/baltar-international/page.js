'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '../components/SubsidiaryPage/SubsidiaryPage.module.css';

const EASE = [0.16, 1, 0.3, 1];

const services = [
  {
    num: '01',
    name: 'Cross-Border Advisory',
    desc: 'Strategic guidance for companies expanding into new markets — regulatory navigation, local partnerships, and entry-point strategy.',
  },
  {
    num: '02',
    name: 'M&A Strategy',
    desc: 'Buy-side and sell-side advisory for mergers, acquisitions, and investment structuring across North America and beyond.',
  },
  {
    num: '03',
    name: 'Global Operations',
    desc: 'Operational frameworks for international scale — supply chain, entity structuring, and multi-jurisdictional compliance.',
  },
];

export default function BaltarInternationalPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroImg}>
          <Image
            src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=1920&q=80"
            alt="Baltar International"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          />
        </div>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span
            className={styles.heroLabel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            Baltar Consultancy — Toronto, Canada
          </motion.span>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            Baltar<br />International.
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            Cross-border advisory and M&A strategy for companies that think beyond borders. We connect ambition to execution on a global scale.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          >
            <Link href="/contact-us" className={styles.heroCta}>
              Work With Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <p className={styles.introLabel}>Our Focus</p>
        <p className={styles.introText}>
          Baltar International advises businesses navigating complexity — cross-border expansion, strategic acquisitions, and building the operational infrastructure to compete globally.
        </p>
      </section>

      {/* Services */}
      <section className={styles.services}>
        <div className={styles.servicesRule} />
        <div className={styles.servicesGrid}>
          {services.map((s) => (
            <div key={s.num} className={styles.serviceCard}>
              <p className={styles.serviceNum}>{s.num}</p>
              <h3 className={styles.serviceName}>{s.name}</h3>
              <p className={styles.serviceDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <div className={styles.ctaStrip}>
        <p className={styles.ctaText}>
          Ready to take your business international?
        </p>
        <Link href="/contact-us" className={styles.ctaButton}>
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
