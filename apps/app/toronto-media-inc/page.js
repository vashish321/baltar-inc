'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from '../components/SubsidiaryPage/SubsidiaryPage.module.css';

const EASE = [0.16, 1, 0.3, 1];

const services = [
  {
    num: '01',
    name: 'Digital Media Production',
    desc: 'Video, photography, and content creation built for the platforms that matter — social, streaming, and editorial.',
  },
  {
    num: '02',
    name: 'Brand Storytelling',
    desc: "Campaign strategy, creative direction, and distribution — from a single brand's voice to city-wide coverage.",
  },
  {
    num: '03',
    name: 'Media Consulting',
    desc: 'Audience development, monetisation strategy, and digital transformation advisory for media organisations.',
  },
];

export default function TorontoMediaIncPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroImg}>
          <Image
            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1920&q=80"
            alt="Toronto Media Inc."
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
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
            Baltar Technologies — Toronto, Canada
          </motion.span>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            Toronto<br />Media Inc.
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          >
            Digital media production, brand storytelling, and content strategy rooted in Toronto — built for audiences everywhere.
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
          Toronto Media Inc. is a full-service digital media company. We produce content that moves people and builds brands — from campaign ideation to final distribution.
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
          Tell your story at the highest level.
        </p>
        <Link href="/contact-us" className={styles.ctaButton}>
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
