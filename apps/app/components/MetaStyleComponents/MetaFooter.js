'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './MetaFooter.module.css';

const footerSections = {
  'Technologies': [
    { name: 'Toronto Media Inc.', href: '/frontend-web-design', external: true },
    { name: 'Cre8ive Studio', href: '/cre8ive-studio-comingsoon', external: false },
    { name: 'Transac', href: '/transac', external: true },
  ],
  'Services': [
    { name: 'Hospitality', href: '/sip-and-savour', external: true },
    { name: 'Engineering', href: '/archon-engineering-comingsoon', external: false },
    { name: 'Finance', href: '/baltar-finance-comingsoon', external: false },
  ],
  'Brands': [
    { name: 'VR Fashion', href: '/vr', external: true },
    { name: 'Le Mode Co.', href: '/le-mode-co', external: true },
    { name: 'Consumer Pulse', href: '/consumer-pulse', external: true },
  ],
  'Company': [
    { name: 'About', href: '/about-comingsoon', external: false },
    { name: 'Careers', href: '/careers-comingsoon', external: false },
    { name: 'Contact', href: '/contact-us', external: false },
  ],
};

export default function MetaFooter() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
        >
          {/* Main Footer Content */}
          <div className={styles.mainContent}>
            {/* Company Info */}
            <motion.div className={styles.companySection} variants={itemVariants}>
              <h3 className={styles.companyName}>Baltar Inc</h3>
              <p className={styles.companyTagline}>One Company. Limitless Services.</p>
              <p className={styles.companyDescription}>
                A multi-division firm offering advanced solutions across construction, 
                technology, hospitality, finance, fashion, and media.
              </p>
            </motion.div>

            {/* Footer Links */}
            <div className={styles.linksGrid}>
              {Object.entries(footerSections).map(([section, links]) => (
                <motion.div key={section} className={styles.linkSection} variants={itemVariants}>
                  <h4 className={styles.sectionTitle}>{section}</h4>
                  <ul className={styles.linkList}>
                    {links.map((link, index) => (
                      <li key={index}>
                        {link.external ? (
                          <a 
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.footerLink}
                          >
                            {link.name}
                          </a>
                        ) : (
                          <Link href={link.href} className={styles.footerLink}>
                            {link.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div className={styles.bottomBar} variants={itemVariants}>
            <div className={styles.bottomContent}>
              <div className={styles.copyright}>
                <span>© {currentYear} Baltar Inc. All rights reserved.</span>
              </div>
              
              <div className={styles.legalLinks}>
                <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
                <Link href="/terms-of-service" className={styles.legalLink}>Terms of Service</Link>
                <Link href="/cookies" className={styles.legalLink}>Cookies</Link>
              </div>
              
              <div className={styles.location}>
                <span>🇨🇦 Canada</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
