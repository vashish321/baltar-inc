'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '../components/SubsidiaryPage/SubsidiaryPage.module.css';

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

export default function BaltarConsultingPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroImg}>
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80"
            alt="Baltar Consulting"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
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
            Baltar<br />Consulting.
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            Structural engineering and project management for the builds that matter. Precision from the ground up.
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
        <p className={styles.introLabel}>What We Do</p>
        <p className={styles.introText}>
          Baltar Consulting brings engineering rigour to every project — from residential builds to large-scale commercial developments. We work where the stakes are highest and precision is non-negotiable.
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
          Ready to discuss your next project?
        </p>
        <Link href="/contact-us" className={styles.ctaButton}>
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
