'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MetaHeader.module.css';

const departments = [
  {
    name: 'Baltar Technologies',
    subsidiaries: [
      { label: 'Toronto Media Inc.', href: '/toronto-media-inc' },
      { label: 'Frontend Media Inc.', href: '/frontend-web-design' },
      { label: 'True Cost Index', href: '/true-cost-index' },
      { label: 'Transac', href: '/transac' },
    ],
  },
  {
    name: 'Baltar Hospitality',
    subsidiaries: [
      { label: 'Savour & Sip', href: '/sip-and-savour' },
    ],
  },
  {
    name: 'Baltar Fashion',
    subsidiaries: [
      { label: 'VR', href: '/vr' },
      { label: 'Le Mode Co.', href: '/le-mode-co' },
    ],
  },
  {
    name: 'Baltar Consultancy',
    subsidiaries: [
      { label: 'Baltar Consulting', href: '/baltar-engineering' },
      { label: 'Baltar International', href: '/baltar-international' },
    ],
  },
];

export default function MetaHeader({ light = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuActive : ''} ${light ? styles.light : ''}`}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className={`${styles.line} ${menuOpen ? styles.lineTop : ''}`} />
              <span className={`${styles.line} ${menuOpen ? styles.lineHide : ''}`} />
              <span className={`${styles.line} ${menuOpen ? styles.lineBottom : ''}`} />
            </button>
            <Link href="/" className={styles.logo} onClick={close}>
              <Image
                src="/baltar-logo.svg"
                alt="Baltar Inc"
                width={44}
                height={44}
                className={styles.logoImg}
                priority
              />
            </Link>
          </div>

          <div className={styles.right}>
            <Link href="/contact-us" className={styles.contactLink} onClick={close}>
              Contact
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.megaMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className={styles.megaInner}>
              {departments.map((dept, i) => (
                <motion.div
                  key={dept.name}
                  className={styles.deptGroup}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className={styles.deptName}>{dept.name}</p>
                  <ul className={styles.subList}>
                    {dept.subsidiaries.map((sub) => (
                      <li key={sub.label}>
                        <Link href={sub.href} className={styles.subLink} onClick={close}>
                          <span>{sub.label}</span>
                          <span className={styles.arrow}>↗</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className={styles.megaFooter}>
              <Link href="/contact-us" className={styles.megaContact} onClick={close}>
                Contact Us
              </Link>
              <Link href="/about-comingsoon" className={styles.megaAbout} onClick={close}>
                About Baltar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
