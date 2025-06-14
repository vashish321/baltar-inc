'use client';
import styles from './HeroComponent.module.css';
import { motion } from 'framer-motion';

export default function HeroComponent() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.backgroundElements}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>
      
      <div className={styles.contentWrapper}>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.heroHeadline}>
            Beautiful, Fast & Fully Managed Websites — 
            <span className={styles.highlight}> No Headaches, Just Results.</span>
          </h1>
          
          <p className={styles.heroSubheadline}>
            From domain to design and everything in between — we're your all-in-one solution 
            for powerful websites that convert, impress, and grow with your business.
          </p>
          
          <div className={styles.ctaButtons}>
            <motion.a
              href="/frontend-web-design-contact-us"
              className={styles.primaryCta}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Website Now
            </motion.a>
            <motion.a
              href="/frontend-web-design/portfolio"
              className={styles.secondaryCta}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Portfolio
            </motion.a>
            <motion.a
              href="/frontend-web-design/pricing"
              className={styles.tertiaryCta}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get a Free Quote
            </motion.a>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className={styles.mockupContainer}>
            <div className={styles.websitePreview}>
              <div className={styles.browserBar}>
                <div className={styles.browserDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className={styles.websiteContent}>
                <div className={styles.designElements}>
                  <div className={styles.designBlock1}></div>
                  <div className={styles.designBlock2}></div>
                  <div className={styles.designBlock3}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
