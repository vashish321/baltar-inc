import Link from 'next/link';
import styles from '../coming-soon/coming-soon.module.css';

export const metadata = {
  title: 'Toronto Media Inc.',
  description: 'Toronto Media Inc. — digital media and web solutions for Canadian businesses. Coming soon.',
};

export default function TorontoMediaIncPage() {
  return (
    <div className={styles.container}>
      <div className={styles.glowBox}>
        <h1 className={styles.title}>Toronto Media Inc.</h1>
        <p className={styles.subtitle}>
          Digital media and web solutions built for Canadian businesses. <span className={styles.funky}>Coming soon.</span>
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
