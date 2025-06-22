'use client';
import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>🔒 Privacy Policy</h1>
        <p className={styles.subtitle}>
          Your privacy matters to <span className={styles.funky}>Baltar Inc.</span>
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.btn}>Read Policy</button>
          <Link href="/" className={styles.btnSecondary}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
