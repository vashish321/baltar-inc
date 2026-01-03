'use client';
import styles from './FeatureVideos.module.css';
import { useEffect, useRef } from 'react';

const services = [
  {
    name: 'Baltar Finance',
    video: '/video/finance.mp4',
    subsidiaries: [
      { name: 'Wealth Management', desc: 'Helping you grow and protect your assets.', cta: 'Manage Wealth' },
      { name: 'Transac', desc: 'Digital receipts and loyalty tools for businesses.', cta: 'Visit Transac' },
    ],
  },
  {
    name: 'Baltar Technology',
    video: '/video/technology.mp4',
    subsidiaries: [
      { name: 'Frontend Web Design', desc: 'Design-first engineering for modern brands.', cta: 'Explore Designs' },
      { name: 'Cre8ive Studio', desc: 'Creative & interactive experiences that convert.', cta: 'Go to Studio' },
    ],
  },
  {
    name: 'Baltar Consulting',
    video: '/video/consulting.mp4',
    subsidiaries: [
      { name: 'Archon Engineering', desc: 'Digital infra for bold firms.', cta: 'Consult Us' },
    ],
  },
  {
    name: 'Baltar Hospitality',
    video: '/video/hospitality.mp4',
    subsidiaries: [
      { name: 'Savour & Sip', desc: 'Reinventing dining experiences.', cta: 'Dine With Us' },
    ],
  },
  {
    name: 'Baltar Fashion',
    video: '/video/fashion.mp4',
    subsidiaries: [
      { name: 'VR (Luxury Eyewear & Fashion Tech)', desc: 'Augmented style & wearable elegance.', cta: 'View Collections' },
      { name: 'Le Mode Co.', desc: 'A new way to fashion.', cta: 'Explore Brand' },
    ],
  },
  {
    name: 'Baltar Media',
    video: '/video/media.mp4',
    subsidiaries: [
      { name: 'Consumer Pulse', desc: 'Tracking engagement in real-time.', cta: 'Pulse Insights' },
      { name: 'Zeitgeist Media', desc: 'Trend-forward digital storytelling.', cta: 'View Showcase' },
    ],
  },
  {
    name: 'Baltar Retail',
    video: '/video/retail.mp4',
    subsidiaries: [
      { name: 'Baltar Prime', desc: 'The future of commerce, now.', cta: 'Shop Smart' },
    ],
  },
];

export default function FeatureVideos() {
  const videoRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          if (entry.isIntersecting) {
            target.classList.add(styles.zoomIn);
          } else {
            target.classList.remove(styles.zoomIn);
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((el) => el && observer.observe(el));
    return () => videoRefs.current.forEach((el) => el && observer.unobserve(el));
  }, []);

  const getHref = (name) => {
    const lower = name.toLowerCase();
    if (lower === 'transac') return '/transac';
    if (lower === 'frontend web design') return '/frontend-web-design';
    if (lower === 'toronto media inc.') return '/frontend-web-design';
    if(lower === 'savour & sip') return '/sip-and-savour';
    if(lower === 'le mode co.') return '/le-mode-co';
    if(lower==='vr (luxury eyewear & fashion tech)') return '/vr';
    if(lower==='consumer pulse') return '/consumer-pulse';
    return '/coming-soon';
  };

  return (
    <section className={styles.featureSection}>
      <h2 className={styles.sectionHeading}>Services Provided by Baltar Inc.</h2>
      {services.map((service, index) => (
        <div key={index} className={styles.serviceBlock}>
          <h3 className={styles.serviceTitle}>{service.name}</h3>

          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={service.video}
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
          />

          <div className={styles.subsidiaries}>
            {service.subsidiaries.map((sub, i) => {
              const href = getHref(sub.name);
              const openInNewTab = href !== '/coming-soon';

              return (
                <div key={i} className={styles.subCard}>
                  <h4>{sub.name}</h4>
                  <p>{sub.desc}</p>
                  {openInNewTab ? (
                    <a
                      href={href}
                      className={styles.subButton}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sub.cta}
                    </a>
                  ) : (
                    <a href={href} className={styles.subButton}>
                      {sub.cta}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
