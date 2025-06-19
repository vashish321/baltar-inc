'use client';
import styles from './AboutTeaser.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AboutTeaser() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/sip-and-savour/about");
  };

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <motion.div
            className={styles.textContent}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.title}>About Us</h2>
            <p className={styles.description}>
              At Savour & Sip, hospitality is more than service — it's an experience. 
              Our team of trained, professional bartenders, servers, chefs, and event staff 
              are committed to making every interaction feel seamless, warm, and memorable. 
              Whether you're planning a wedding, managing a high-volume restaurant, or hosting 
              a luxury corporate gala, we're the partner behind the scenes ensuring everything 
              runs smoothly.
            </p>
            <motion.button 
              className={styles.ctaButton}
              onClick={handleButtonClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More About Our Team →
            </motion.button>
          </motion.div>
          
          <motion.div
            className={styles.imageContent}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.imageWrapper}>
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Our professional team" className={styles.mainImage} />
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <span className={styles.overlayText}>Professional</span>
                  <span className={styles.overlayText}>Experienced</span>
                  <span className={styles.overlayText}>Reliable</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
