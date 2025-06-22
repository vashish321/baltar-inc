'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MetaHeader.module.css';

const navItems = {
  Technologies: ['Frontend Web Design', 'Cre8ive Studio', 'Transac'],
  Hospitality: ['Savour & Sip'],
  Engineering: ['Archon Engineering'],
  Finance: ['Baltar Wealth Management'],
  Fashion: ['VR (Luxury Eyewear & Fashion Tech)', 'Le Mode Co.'],
  Media: ['Consumer Pulse', 'Zeitgeist Media'],
};

const hrefMap = {
  'transac': '/transac',
  'frontend web design': '/frontend-web-design',
  'le mode co.': '/le-mode-co',
  'savour & sip': '/sip-and-savour',
  'consumer pulse': '/consumer-pulse',
  'vr (luxury eyewear & fashion tech)': '/vr',
  'cre8ive studio': '/cre8ive-studio-comingsoon',
  'archon engineering': '/archon-engineering-comingsoon',
  'baltar wealth management': '/baltar-finance-comingsoon',
  'zeitgeist media': '/zeitgeist-media-comingsoon',
};

export default function MetaHeader() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (key) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const renderLink = (item, i) => {
    const lowerItem = item.toLowerCase();
    const href = hrefMap[lowerItem] || '/coming-soon';
    const isIntegratedPage = ['transac', 'frontend web design', 'savour & sip', 'le mode co.', 'consumer pulse', 'vr (luxury eyewear & fashion tech)'].includes(lowerItem);

    if (isIntegratedPage) {
      return (
        <a 
          href={href} 
          key={i} 
          className={styles.dropdownItem}
          target="_blank" 
          rel="noopener noreferrer"
        >
          {item}
        </a>
      );
    } else {
      return (
        <Link href={href} key={i} className={styles.dropdownItem}>
          {item}
        </Link>
      );
    }
  };

  return (
    <motion.header 
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="Baltar Inc" width={32} height={32} />
          <span className={styles.logoText}>Baltar Inc</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {Object.entries(navItems).map(([category, items]) => (
            <div
              key={category}
              className={styles.navItem}
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
            >
              <span className={styles.navLink}>{category}</span>
              
              <AnimatePresence>
                {activeDropdown === category && (
                  <motion.div
                    className={styles.dropdown}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {items.map((item, i) => renderLink(item, i))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.active : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.active : ''}`}></span>
          <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.active : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {Object.entries(navItems).map(([category, items]) => (
              <div key={category} className={styles.mobileCategory}>
                <h3 className={styles.mobileCategoryTitle}>{category}</h3>
                <div className={styles.mobileItems}>
                  {items.map((item, i) => renderLink(item, i))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
