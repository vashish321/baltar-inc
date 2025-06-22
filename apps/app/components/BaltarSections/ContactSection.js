'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './ContactSection.module.css';

export default function ContactSection() {
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

  const bounceIn = {
    hidden: { opacity: 0, scale: 0.3, y: 100 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 1.2
      }
    }
  };

  const slideInUp = {
    hidden: { opacity: 0, y: 150 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
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
          <source src="/testimonial.mp4" type="video/mp4" />
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
          <h2 className={styles.sectionTitle}>Work With Baltar Inc.</h2>
          <p className={styles.sectionSubtitle}>Integrated Services. Intelligent Execution.</p>
        </motion.div>

        <motion.div className={styles.ctaContainer} variants={slideInUp}>
          <p className={styles.ctaDescription}>
            Whether you're a business, homeowner, investor, or startup—Baltar offers streamlined
            services, automated systems, and hands-on support to get you further, faster.
          </p>

          <div className={styles.contactGrid}>
            <motion.div className={styles.contactCard} variants={bounceIn}>
              <h3>Get Started Today</h3>
              <p>Ready to transform your business with our integrated solutions? Contact us to discuss your project and discover how Baltar Inc. can help you achieve your goals.</p>
              <a
                href="/contact-us"
                className={styles.primaryButton}
              >
                Contact Us
              </a>
            </motion.div>
          </div>
        </motion.div>


      </motion.div>
    </section>
  );
}
