'use client';
import React from 'react';
import styles from './WhatWeDoComponent.module.css';
import { motion } from 'framer-motion';

export default function WhatWeDoComponent() {
  return (
    <section className={styles.whatWeDoSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.introContent}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.introTitle}>
            Your Digital Partner
          </h2>
          <p className={styles.introParagraph}>
            At Baltar Technologies, we specialize in building sleek, fast, and affordable websites
            for professionals, businesses, and organizations who want more than just a template.
            We handle everything — design, hosting, support — so you can focus on your business
            while we bring your online presence to life.
          </p>
        </motion.div>

        <div className={styles.contentWrapper}>
          <motion.div
            className={styles.left}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className={styles.showcaseVideo}
            >
              <source src="/whatwedo.mp4" type="video/mp4" />
            </video>
          </motion.div>

          <motion.div
            className={styles.right}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className={styles.heading}>
              We focus on intuitive, beautiful, and performance-driven frontend interfaces.
            </h3>
            <motion.a
              href="/frontend-web-design/services"
              className={styles.ctaButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              What we do
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
