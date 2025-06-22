'use client';
import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export default function CareersComingSoonPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>💼 Careers Coming Soon</h1>
        <p className={styles.subtitle}>
          Join the <span className={styles.funky}>Baltar Inc.</span> team.
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
