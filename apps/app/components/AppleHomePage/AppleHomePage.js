'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AppleHomePage.module.css';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.16, 1, 0.3, 1];

const DIVISIONS = [
  {
    id: 'technologies',
    eyebrow: 'Baltar Technologies',
    heading: 'Built to perform.\nDesigned to convert.',
    sub: 'Web design, payments, and product infrastructure for Canadian businesses that compete on quality.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    imgPos: 'center',
    primary: { label: 'Learn more', href: '/technologies/toronto-media-inc' },
    secondary: { label: 'Transac', href: '/finance/transac' },
  },
  {
    id: 'hospitality',
    eyebrow: 'Baltar Hospitality',
    heading: 'The kind of event\npeople talk about afterward.',
    sub: 'Savour & Sip. Full-service catering, bar programs, and event hospitality across Toronto and the GTA.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80',
    imgPos: 'center top',
    primary: { label: 'Learn more', href: '/hospitality/savour-and-sip' },
    secondary: { label: 'Enquire', href: '/contact-us' },
  },
  {
    id: 'fashion',
    eyebrow: 'Baltar Fashion',
    heading: 'Eyewear for people who\nlook closely at everything.',
    sub: 'VR. Luxury frames engineered with precision, finished by hand. Made for those who notice the difference.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80',
    imgPos: 'center 30%',
    primary: { label: 'Explore VR', href: '/fashion/vr' },
    secondary: { label: 'View collections', href: '/fashion/vr' },
  },
  {
    id: 'consultancy',
    eyebrow: 'Baltar Consultancy',
    heading: 'Clear thinking for\ncomplex problems.',
    sub: 'Structural engineering, project management, and global advisory. Precision at every stage.',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80',
    imgPos: 'center 40%',
    primary: { label: 'Baltar Consulting', href: '/consulting/baltar-engineering' },
    secondary: { label: 'Baltar International', href: '/consulting/baltar-international' },
  },
];

export default function AppleHomePage() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        sectionRefs.current.forEach((section) => {
          if (!section) return;

          const imgWrap = section.querySelector('[data-parallax]');
          const reveals = section.querySelectorAll('[data-reveal]');

          // Subtle image parallax — scrubbed to scroll
          if (imgWrap) {
            gsap.fromTo(
              imgWrap,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }

          // Staggered text reveal on enter
          if (reveals.length) {
            gsap.fromTo(
              reveals,
              { opacity: 0, y: 36, filter: 'blur(4px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                stagger: 0.09,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 70%',
                },
              }
            );
          }
        });
      });

      return () => ctx.revert();
    });

    // Reduced-motion: just fade in, no movement
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const ctx = gsap.context(() => {
        sectionRefs.current.forEach((section) => {
          if (!section) return;
          const reveals = section.querySelectorAll('[data-reveal]');
          if (reveals.length) {
            gsap.fromTo(
              reveals,
              { opacity: 0 },
              {
                opacity: 1,
                stagger: 0.06,
                duration: 0.5,
                ease: 'none',
                scrollTrigger: { trigger: section, start: 'top 75%' },
              }
            );
          }
        });
      });
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroImgWrap}>
          <Image
            src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
        </div>
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <motion.span
            className={styles.heroEyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          >
            Toronto, Canada
          </motion.span>

          <motion.h1
            className={styles.heroHeading}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: EASE }}
          >
            Baltar Inc.
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          >
            One Company. Limitless Services.
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
          >
            <button
              className={styles.heroBtnPrimary}
              onPointerDown={() =>
                document.getElementById('divisions')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore
            </button>
            <Link href="/contact-us" className={styles.heroBtnSecondary}>
              Get in Touch
            </Link>
          </motion.div>
        </div>

        <motion.div
          className={styles.scrollCue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.7 }}
        >
          <motion.div
            className={styles.scrollBar}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </section>

      {/* ── Division Sections ── */}
      <div id="divisions">
        {DIVISIONS.map((div, i) => (
          <section
            key={div.id}
            ref={(el) => { sectionRefs.current[i] = el; }}
            className={styles.division}
          >
            {/* GSAP parallax target — slightly oversized so movement doesn't expose edges */}
            <div className={styles.divImgWrap} data-parallax="true">
              <Image
                src={div.img}
                alt={div.eyebrow}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover', objectPosition: div.imgPos }}
              />
            </div>

            <div className={styles.divOverlay} />

            <div className={styles.divContent}>
              <span className={styles.divEyebrow} data-reveal="true">
                {div.eyebrow}
              </span>
              <h2 className={styles.divHeading} data-reveal="true">
                {div.heading.split('\n').map((line, j) => (
                  <span key={j} className={styles.divHeadingLine}>{line}</span>
                ))}
              </h2>
              <p className={styles.divSub} data-reveal="true">
                {div.sub}
              </p>
              <div className={styles.divCtas} data-reveal="true">
                <Link href={div.primary.href} className={styles.btnPrimary}>
                  {div.primary.label}
                </Link>
                <Link href={div.secondary.href} className={styles.btnSecondary}>
                  {div.secondary.label}
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
