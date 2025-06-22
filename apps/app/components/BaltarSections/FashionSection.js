'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './FashionSection.module.css';

export default function FashionSection() {
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
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
          <source src="/video/fashion.mp4" type="video/mp4" />
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
          <h2 className={styles.sectionTitle}>Baltar Fashion</h2>
          <p className={styles.sectionSubtitle}>Luxury Retail | Fashion Tech | Subscription Style</p>
        </motion.div>

        <div className={styles.servicesGrid}>
          {/* VR (Eyewear & Fashion Tech) */}
          <motion.div className={styles.serviceCard} variants={scaleIn}>
            <div className={styles.cardContent}>
              <h3>VR (Eyewear & Fashion Tech)</h3>
              <p>
                A fashion-tech brand combining online luxury with real-time interactivity.
              </p>
              <ul className={styles.featureList}>
                <li>Augmented reality try-on for eyewear and accessories</li>
                <li>AI-driven recommendations based on face shape and style history</li>
                <li>Fully integrated loyalty system with rewards, referrals, and discounts</li>
                <li>Secure e-commerce checkout with Stripe, Square, and Apple Pay</li>
              </ul>
              <p className={styles.serviceDescription}>
                We make premium style personal, immersive, and accessible.
              </p>
              <a 
                href="/vr" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.serviceLink}
              >
                Explore VR Fashion →
              </a>
            </div>
          </motion.div>

          {/* Le Mode Co. */}
          <motion.div className={styles.serviceCard} variants={fadeInUp}>
            <div className={styles.cardContent}>
              <h3>Le Mode Co.</h3>
              <p>
                Apparel and accessories with a curated, data-backed shopping experience.
              </p>
              <ul className={styles.featureList}>
                <li>Style quizzes and curated fashion boxes delivered monthly</li>
                <li>Digital lookbooks showcasing new seasonal collections</li>
                <li>Integrated influencer management and affiliate tracking</li>
                <li>Flexible subscriptions and exclusive capsule drops</li>
              </ul>
              <p className={styles.serviceDescription}>
                Fashion, delivered smart—powered by AI, styled by people.
              </p>
              <a 
                href="/le-mode-co" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.serviceLink}
              >
                Discover Le Mode Co. →
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
