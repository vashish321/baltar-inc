'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './TransacHeader.module.css';

const navItems = [
  { label: 'Why Transac', href: '#why' },
  { label: 'Demo', href: '#demo' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'App', href: '#app' }
];

export default function TransacHeader() {
  const [active, setActive] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (item) => {
    clearTimeout(timeoutRef.current);
    setActive(item);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActive(null);
    }, 150);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/transac" className={styles.logoWithIcon}>
          <Image src="/Baltar-new.svg" alt="Transac Logo" width={28} height={28} />
          <span className={styles.logoText}>Transac</span>
        </Link>

        <button className={styles.mobileMenuButton} onClick={() => setMobileOpen(true)}>☰</button>

        <nav className={styles.navbar}>
          <div className={styles.navLinks}>
            {navItems.map((item, index) => (
              <a key={index} href={item.href} className={styles.navItem}>
                {item.label}
              </a>
            ))}

            <div
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
              className={styles.navItemWrapper}
            >
              <span className={styles.navItem}>Resources</span>
              {active === 'resources' && (
                <div className={styles.dropdown}>
                  <Link href="/compliance" className={styles.dropdownItem}>Compliance</Link>
                  <Link href="/hardware" className={styles.dropdownItem}>Hardware</Link>
                  <Link href="/loyalty" className={styles.dropdownItem}>Loyalty</Link>
                  <Link href="/integrations" className={styles.dropdownItem}>Integrations</Link>
                </div>
              )}
            </div>

            <Link href="/signup" className={`${styles.navItem} ${styles.ctaButton}`}>
              Join Transac
            </Link>

            <span className={styles.signInPrompt}>
              Already onboard?
              <Link href="/login" className={styles.signInLink}>Sign in</Link>
            </span>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className={`${styles.mobileMenu} ${styles.menuSlide}`}>
            <button onClick={() => setMobileOpen(false)} className={styles.closeBtn}>×</button>

            {navItems.map((item, index) => (
              <a key={index} href={item.href} className={styles.navItem} onClick={() => setMobileOpen(false)}>
                {item.label}
              </a>
            ))}

            {/* Mobile Resources Toggle */}
            <div className={styles.mobileDropdownWrapper}>
              <button
                onClick={() => setShowResources(!showResources)}
                className={styles.mobileDropdownToggle}
              >
                Resources {showResources ? '' : ''}
              </button>
              {showResources && (
                <div className={styles.mobileDropdown}>
                  <Link href="/compliance" className={styles.dropdownItem}>Compliance</Link>
                  <Link href="/hardware" className={styles.dropdownItem}>Hardware</Link>
                  <Link href="/loyalty" className={styles.dropdownItem}>Loyalty</Link>
                  <Link href="/integrations" className={styles.dropdownItem}>Integrations</Link>
                </div>
              )}
            </div>

            <Link href="/signup" className={styles.ctaButton} onClick={() => setMobileOpen(false)}>Join Transac</Link>
            <Link href="/login" className={styles.signInLink} onClick={() => setMobileOpen(false)}>Sign In</Link>
          </div>
        )}
      </div>
    </header>
  );
}
