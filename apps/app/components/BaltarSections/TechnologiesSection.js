'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './TechnologiesSection.module.css';

export default function TechnologiesSection() {
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

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
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
          <source src="/video/technology.mp4" type="video/mp4" />
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
          <h2 className={styles.sectionTitle}>Baltar Technologies</h2>
          <p className={styles.sectionSubtitle}>Web Infrastructure | Digital Branding | Automation</p>
        </motion.div>

        <div className={styles.servicesGrid}>
          {/* Frontend Web Design & Hosting */}
          <motion.div className={styles.serviceCard} variants={slideInLeft}>
            <div className={styles.cardContent}>
              <h3>Frontend Web Design & Hosting</h3>
              <p>
                We offer full-spectrum web services: design, development, domain registration, 
                hosting, maintenance, and optimization.
              </p>
              <ul className={styles.featureList}>
                <li>High-performance web hosting on secure Canadian and international servers</li>
                <li>Domain setup, SSL, CDN, and email integration</li>
                <li>SEO-optimized, mobile-responsive websites with fast load times</li>
                <li>Ongoing updates through subscription-based maintenance plans</li>
                <li>AI-powered audits for performance, SEO, accessibility, and vulnerabilities</li>
                <li>Client dashboard for support, invoicing, status tracking, and backups</li>
                <li>Booking system to schedule web consultations and audits</li>
                <li>Optional login system and e-commerce integrations for clients</li>
              </ul>
              <p className={styles.serviceDescription}>
                From basic business sites to complex platforms, we design and manage your web presence end-to-end.
              </p>
              <a 
                href="/frontend-web-design" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.serviceLink}
              >
                Explore Web Services →
              </a>
            </div>
          </motion.div>

          {/* Cre8ive Studio */}
          <motion.div className={styles.serviceCard} variants={slideInRight}>
            <div className={styles.cardContent}>
              <h3>Cre8ive Studio</h3>
              <p>
                Our graphic design arm provides branding, creative direction, and print-ready production.
              </p>
              <ul className={styles.featureList}>
                <li>Logo design, brand kits, marketing materials, packaging, and signage</li>
                <li>Online design request system for one-time or recurring projects</li>
                <li>Interactive portfolio showcasing past client work</li>
                <li>AI-powered brand generator for fast visual concepts</li>
                <li>Print store for business cards, flyers, brochures, and banners</li>
                <li>File preparation for web, print, and digital ads</li>
              </ul>
              <p className={styles.serviceDescription}>
                We help brands come to life visually—with intention, precision, and consistency.
              </p>
              <a 
                href="/cre8ive-studio-comingsoon" 
                className={styles.serviceLink}
              >
                View Creative Services →
              </a>
            </div>
          </motion.div>

          {/* Transac */}
          <motion.div className={styles.serviceCard} variants={slideInLeft}>
            <div className={styles.cardContent}>
              <h3>Transac</h3>
              <p>
                Digital receipts and loyalty tools for businesses, streamlining transactions and customer engagement.
              </p>
              <ul className={styles.featureList}>
                <li>Digital receipt management system</li>
                <li>Customer loyalty program integration</li>
                <li>Business analytics and insights</li>
                <li>Seamless payment processing</li>
              </ul>
              <p className={styles.serviceDescription}>
                Modernize your business transactions with smart digital solutions.
              </p>
              <a 
                href="/transac" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.serviceLink}
              >
                Discover Transac →
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
