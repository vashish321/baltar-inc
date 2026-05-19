'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

const EASE = [0.16, 1, 0.3, 1];

const heroImg = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=80';

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.imgWrap}>
        <Image
          src={heroImg}
          alt="Baltar Inc"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
      </div>
      <div className={styles.overlay} />

      <div className={styles.content}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          Toronto, Canada
        </motion.span>
        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        >
          One company.<br />Every industry.
        </motion.h1>
        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        >
          Technology · Hospitality · Fashion · Consultancy
        </motion.p>
        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: EASE }}
        >
          <button
            className={styles.ctaPrimary}
            onClick={() => document.getElementById('divisions')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore
          </button>
          <Link href="/contact-us" className={styles.ctaSecondary}>
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className={styles.scrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className={styles.scrollBar}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
}
