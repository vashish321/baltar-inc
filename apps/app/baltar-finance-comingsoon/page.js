'use client';
import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export default function BaltarFinanceComingSoonPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>💰 Baltar Finance Coming Soon</h1>
        <p className={styles.subtitle}>
          We're investing in something <span className={styles.funky}>profitable</span> for you.
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
