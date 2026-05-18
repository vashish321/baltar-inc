import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export const metadata = {
  title: 'Baltar Consulting',
  description: 'Baltar Consulting — structural engineering and project management. Coming soon.',
};

export default function BaltarConsultingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>Baltar Consulting</h1>
        <p className={styles.subtitle}>
          Structural engineering and project management solutions. <span className={styles.funky}>Coming soon.</span>
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
