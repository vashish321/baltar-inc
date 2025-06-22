'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './HospitalitySection.module.css';

export default function HospitalitySection() {
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
          <source src="/video/hospitality.mp4" type="video/mp4" />
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
          <h2 className={styles.sectionTitle}>Baltar Hospitality</h2>
          <p className={styles.sectionSubtitle}>Catering | Bartending | Event Staffing & Planning</p>
        </motion.div>

        <div className={styles.serviceContainer}>
          {/* Savour & Sip */}
          <motion.div className={styles.mainServiceCard} variants={itemVariants}>
            <div className={styles.cardContent}>
              <h3>Savour & Sip</h3>
              <p>
                Catering and event solutions for private parties, weddings, and corporate events—plus 
                restaurant and kitchen staffing.
              </p>
              
              <div className={styles.featuresGrid}>
                <div className={styles.featureColumn}>
                  <h4>Event Services</h4>
                  <ul className={styles.featureList}>
                    <li>Fully customized catering menus through our interactive menu builder</li>
                    <li>Bartender and chef-for-hire services for events or private dinners</li>
                    <li>Event package bookings, rental add-ons, and custom quotes</li>
                    <li>Monthly meal plan subscriptions for recurring clients</li>
                  </ul>
                </div>
                
                <div className={styles.featureColumn}>
                  <h4>Technology & Support</h4>
                  <ul className={styles.featureList}>
                    <li>AI-powered event planner tool for food, staffing, and budget estimates</li>
                    <li>Live chat and smart support for dietary, schedule, and service inquiries</li>
                    <li>Hospitality staffing for short-term or permanent placement—front and back of house</li>
                  </ul>
                </div>
              </div>

              <p className={styles.serviceDescription}>
                We make events seamless, elegant, and fully serviced—with food, people, and logistics all covered.
              </p>
              
              <a 
                href="/sip-and-savour" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.serviceLink}
              >
                Explore Savour & Sip →
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
