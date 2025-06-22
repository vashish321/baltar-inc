'use client';
import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export default function AboutComingSoonPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>📖 About Us Coming Soon</h1>
        <p className={styles.subtitle}>
          Learn more about <span className={styles.funky}>Baltar Inc.</span> story.
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
