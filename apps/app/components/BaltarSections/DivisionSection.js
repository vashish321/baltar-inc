'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './DivisionSection.module.css';

const EASE = [0.16, 1, 0.3, 1];

export default function DivisionSection({
  label,
  heading,
  sub,
  imgSrc,
  imgAlt = '',
  imgPosition = 'center',
  primaryCta,
  secondaryCta,
  dark = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section ref={ref} className={styles.section}>
      {/* Background image */}
      <div className={styles.imgWrap}>
        <Image
          src={imgSrc}
          alt={imgAlt}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: imgPosition }}
        />
      </div>

      {/* Gradient overlay */}
      <div className={`${styles.overlay} ${dark ? styles.overlayDark : styles.overlayLight}`} />

      {/* Content */}
      <div className={styles.content}>
        <motion.span
          className={`${styles.label} ${dark ? styles.labelDark : styles.labelLight}`}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          {label}
        </motion.span>

        <motion.h2
          className={`${styles.heading} ${dark ? styles.headingDark : styles.headingLight}`}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
        >
          {heading}
        </motion.h2>

        {sub && (
          <motion.p
            className={`${styles.sub} ${dark ? styles.subDark : styles.subLight}`}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {sub}
          </motion.p>
        )}

        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
        >
          {primaryCta && (
            <Link href={primaryCta.href} className={`${styles.btnPrimary} ${dark ? styles.btnPrimaryDark : styles.btnPrimaryLight}`}>
              {primaryCta.label}
            </Link>
          )}
          {secondaryCta && (
            <Link href={secondaryCta.href} className={`${styles.btnSecondary} ${dark ? styles.btnSecondaryDark : styles.btnSecondaryLight}`}>
              {secondaryCta.label}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
