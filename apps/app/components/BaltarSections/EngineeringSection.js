'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './EngineeringSection.module.css';

export default function EngineeringSection() {
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
          <source src="/video/consulting.mp4" type="video/mp4" />
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
          <h2 className={styles.sectionTitle}>Archon Engineering</h2>
          <p className={styles.sectionSubtitle}>Civil & Structural Engineering | Design | Consulting</p>
        </motion.div>

        <div className={styles.serviceContainer}>
          <motion.div className={styles.mainServiceCard} variants={itemVariants}>
            <div className={styles.cardContent}>
              <p className={styles.intro}>
                A full-service civil and structural engineering firm, delivering residential and 
                commercial design, permitting, and consultancy services.
              </p>
              
              <div className={styles.featuresGrid}>
                <div className={styles.featureColumn}>
                  <h4>Design & Assessment</h4>
                  <ul className={styles.featureList}>
                    <li>Custom home design, renovations, and structural assessments</li>
                    <li>Digital project estimator with instant quoting</li>
                    <li>3D design previews and interactive walkthroughs</li>
                  </ul>
                </div>
                
                <div className={styles.featureColumn}>
                  <h4>Digital Solutions</h4>
                  <ul className={styles.featureList}>
                    <li>Secure client portal for drawings, permits, contracts, and progress updates</li>
                    <li>Integrated scheduling, document signing, invoicing, and online payments</li>
                    <li>Book on-site or virtual consultations through our portal</li>
                    <li>Instant answers with AI-assisted technical chat support</li>
                  </ul>
                </div>
              </div>

              <p className={styles.serviceDescription}>
                Whether you're building a home or developing a property, Archon makes the process 
                streamlined, transparent, and intelligent.
              </p>
              
              <a 
                href="/archon-engineering-comingsoon" 
                className={styles.serviceLink}
              >
                Discover Engineering Services →
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
