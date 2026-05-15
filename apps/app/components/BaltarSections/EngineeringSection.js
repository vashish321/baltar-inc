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
    offset: ['start end', 'end start'],
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
      transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const subsidiaries = [
    {
      name: 'Baltar Engineering',
      tagline: 'Civil & Structural Engineering · Design · Permitting',
      description:
        'A full-service civil and structural engineering firm delivering residential and commercial design, permitting, digital estimating, and consultancy services.',
      features: [
        'Structural assessments & custom home design',
        'Digital project estimator with instant quoting',
        'Secure client portal — drawings, permits, invoices',
        'Book on-site or virtual consultations online',
      ],
      href: '/baltar-engineering',
      cta: 'Explore Engineering →',
    },
    {
      name: 'Baltar International',
      tagline: 'Strategy · Market Entry · M&A · Global Operations',
      description:
        'Cross-border business consultancy helping founders and executives enter new markets, execute M&A, and scale operations across 15+ countries.',
      features: [
        'Market entry strategy & feasibility studies',
        'Mergers, acquisitions & due diligence',
        'International trade & regulatory advisory',
        'Corporate development & investor relations',
      ],
      href: '/baltar-international',
      cta: 'Explore International →',
    },
  ];

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background Video */}
      <motion.div className={styles.videoContainer} style={{ scale: videoScale }}>
        <video ref={videoRef} muted loop playsInline className={styles.backgroundVideo}>
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
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h2 className={styles.sectionTitle}>Baltar Consulting</h2>
          <p className={styles.sectionSubtitle}>Engineering · Strategy · International Growth</p>
        </motion.div>

        <div className={styles.serviceContainer} style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {subsidiaries.map((sub) => (
            <motion.div
              key={sub.name}
              className={styles.mainServiceCard}
              variants={itemVariants}
              style={{ flex: '1 1 340px' }}
            >
              <div className={styles.cardContent}>
                <h3 style={{ color: '#c9a84c', marginBottom: '0.35rem', fontSize: '1.25rem', fontWeight: 700 }}>
                  {sub.name}
                </h3>
                <p style={{ color: '#888', fontSize: '0.78rem', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                  {sub.tagline}
                </p>
                <p className={styles.intro}>{sub.description}</p>

                <ul className={styles.featureList} style={{ marginTop: '1rem' }}>
                  {sub.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>

                <a href={sub.href} className={styles.serviceLink} style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                  {sub.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
