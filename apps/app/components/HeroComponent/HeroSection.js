'use client';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Slower, more cinematic
    }
  }, []);

  return (
    <section ref={containerRef} className={styles.hero}>
      {/* Meta-style Background Video with Parallax */}
      <motion.div
        className={styles.videoContainer}
        style={{ scale: videoScale }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={styles.heroVideo}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.videoOverlay} />
      </motion.div>

      {/* Meta-style Animated Text Content */}
      <motion.div
        className={styles.heroContent}
        style={{ opacity: textOpacity, y: textY }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className={styles.titleContainer}
        >
          <h1 className={styles.mainTitle}>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Baltar Inc.
            </motion.span>
          </h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className={styles.subtitle}
          >
            One Company. Limitless Services.
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className={styles.description}
        >
          Baltar Inc. is a multi-division firm offering advanced solutions across construction,
          technology, hospitality, finance, fashion, and media. We blend innovation with
          execution—supporting startups, professionals, and enterprise clients across Canada.
        </motion.p>


      </motion.div>

        {/* Floating Elements */}
        <motion.div
          className={styles.floatingElements}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.div
            className={styles.floatingCircle1}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className={styles.floatingCircle2}
            animate={{
              y: [0, 15, 0],
              x: [0, -15, 0],
              rotate: [0, -180, -360]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className={styles.floatingCircle3}
            animate={{
              y: [0, -25, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
    </section>
  );
}
