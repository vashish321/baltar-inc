'use client';
import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export default function ZeitgeistMediaComingSoonPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>📊 Zeitgeist Media Coming Soon</h1>
        <p className={styles.subtitle}>
          We're creating something <span className={styles.funky}>trending</span> for you.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.btn}>Notify Me</button>
          <Link href="/" className={styles.btnSecondary}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
