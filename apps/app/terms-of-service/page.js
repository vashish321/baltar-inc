'use client';
import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export default function TermsOfServicePage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>📋 Terms of Service</h1>
        <p className={styles.subtitle}>
          Our terms and conditions for <span className={styles.funky}>Baltar Inc.</span> services.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.btn}>Read Terms</button>
          <Link href="/" className={styles.btnSecondary}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
