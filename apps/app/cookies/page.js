'use client';
import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export default function CookiesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>🍪 Cookie Policy</h1>
        <p className={styles.subtitle}>
          How <span className={styles.funky}>Baltar Inc.</span> uses cookies.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.btn}>Learn More</button>
          <Link href="/" className={styles.btnSecondary}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
