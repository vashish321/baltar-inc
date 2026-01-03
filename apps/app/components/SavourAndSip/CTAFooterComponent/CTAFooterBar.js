'use client';
import styles from './CTAFooterBar.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CTAFooterBar() {
  const router = useRouter();

  const handleQuoteClick = () => {
    router.push('/sip-and-savour/pricing');
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:admin@baltar.ca';
  };

  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.textContent}>
            <h2 className={styles.ctaTitle}>
              Need last-minute staffing or help planning your event?
            </h2>
            <p className={styles.ctaSubtitle}>
              Professional hospitality staff available across Ontario
            </p>
          </div>
          
          <div className={styles.ctaButtons}>
            <motion.button
              className={styles.phoneButton}
              onClick={handleEmailClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={styles.phoneIcon}>✉️</span>
              Email us: admin@baltar.ca
            </motion.button>
            
            <span className={styles.orText}>or</span>
            
            <motion.button
              className={styles.quoteButton}
              onClick={handleQuoteClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get an Instant Quote →
            </motion.button>
          </div>
        </motion.div>
        
        <motion.div
          className={styles.backgroundVideo}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.video}
          >
            <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          <div className={styles.videoOverlay}></div>
        </motion.div>
      </div>
    </section>
  );
}
