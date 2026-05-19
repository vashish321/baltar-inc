'use client';
import styles from './TransacHero.module.css';

export default function TransacHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Seamless Digital Receipts, Unified Loyalty—Built for Modern Commerce</h1>
        <p>
          Transac automatically converts every purchase into a secure digital record—
          while unlocking hidden loyalty value for businesses and consumers.
        </p>

        <div className={styles.heroButtons}>
          <a href="/transac-coming-soon" className={styles.buttonPrimary}>For Merchants →</a>
          <a href="https://play.google.com" target="_blank" className={styles.buttonSecondary}>Get the App →</a>
        </div>
      </div>
    </section>
  );
}
