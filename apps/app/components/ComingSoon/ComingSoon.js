'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ComingSoon.module.css';

const EASE = [0.16, 1, 0.3, 1];

export default function ComingSoon({ name, description, division }) {
  return (
    <div className={styles.page}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {division && (
          <p className={styles.division}>{division}</p>
        )}
        <h1 className={styles.name}>{name}</h1>
        <div className={styles.rule} />
        <p className={styles.label}>Coming Soon</p>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        <div className={styles.ctas}>
          <Link href="/contact-us" className={styles.ctaPrimary}>
            Get in Touch
          </Link>
          <Link href="/" className={styles.ctaSecondary}>
            Back to Baltar
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
