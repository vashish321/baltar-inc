'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './FinanceSection.module.css';

export default function FinanceSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);

  useEffect(() => {
    if (videoRef.current && isInView) {
      videoRef.current.play();
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background Video */}
      <motion.div 
        className={styles.videoContainer}
        style={{ scale: videoScale }}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          className={styles.backgroundVideo}
        >
          <source src="/video/finance.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoOverlay} />
      </motion.div>

      {/* Content */}
      <motion.div 
        className={styles.content}
        style={{ y: contentY }}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Baltar Finance</h2>
          <p className={styles.sectionSubtitle}>Wealth Management | Market Tools | Financial Education</p>
        </motion.div>

        <div className={styles.serviceContainer}>
          <motion.div className={styles.mainServiceCard} variants={itemVariants}>
            <div className={styles.cardContent}>
              <h3>Baltar Wealth Management</h3>
              <p className={styles.intro}>
                Providing practical financial tools and personalized guidance for individuals, 
                families, and businesses.
              </p>
              
              <div className={styles.featuresGrid}>
                <div className={styles.featureColumn}>
                  <h4>Investment Tools</h4>
                  <ul className={styles.featureList}>
                    <li>AI-driven investment risk assessment tailored to your goals</li>
                    <li>Live North American market dashboard with real-time updates</li>
                    <li>Automated reports on portfolio health and opportunities</li>
                  </ul>
                </div>
                
                <div className={styles.featureColumn}>
                  <h4>Advisory Services</h4>
                  <ul className={styles.featureList}>
                    <li>Secure inquiry forms with AI-generated response summaries</li>
                    <li>SEO-optimized finance blog with trends, tips, and education</li>
                    <li>Custom service plans for clients needing private consulting</li>
                  </ul>
                </div>
              </div>

              <p className={styles.serviceDescription}>
                Designed for those who want control, insight, and clarity in their financial strategy.
              </p>
              
              <a 
                href="/baltar-finance-comingsoon" 
                className={styles.serviceLink}
              >
                Explore Wealth Management →
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
