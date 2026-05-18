import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export const metadata = {
  title: 'True Cost Index',
  description: 'True Cost Index — transparent pricing intelligence. Coming soon.',
};

export default function TrueCostIndexPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>True Cost Index</h1>
        <p className={styles.subtitle}>
          Transparent pricing intelligence — know what things actually cost. <span className={styles.funky}>Coming soon.</span>
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
