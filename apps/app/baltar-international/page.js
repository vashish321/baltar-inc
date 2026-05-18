import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export const metadata = {
  title: 'Baltar International',
  description: 'Baltar International — cross-border advisory, M&A, and global operations. Coming soon.',
};

export default function BaltarInternationalPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>Baltar International</h1>
        <p className={styles.subtitle}>
          Cross-border advisory, M&A strategy, and global operations. <span className={styles.funky}>Coming soon.</span>
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/contact-us" className={styles.btn}>
            Get in Touch
          </Link>
          <Link href="/" className={styles.btnSecondary}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
