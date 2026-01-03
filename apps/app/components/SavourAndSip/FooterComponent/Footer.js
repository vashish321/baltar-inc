'use client';

import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <Image src="/Savour-Sip-New.svg" alt="Savour & Sip Logo" width={120} height={120} />
      </div>

      <div className={styles.footerContent}>
        {/* Contact Info */}
        <div className={styles.column}>
          <h4>Contact Us</h4>
          <p>123 Culinary Avenue</p>
          <p>New York, NY 10001</p>
          <p>Email: admin@baltar.ca</p>
        </div>

        {/* Social Links */}
        <div className={styles.column}>
          <h4>Follow Us</h4>
          <p><a href="#">Instagram</a></p>
          <p><a href="#">Facebook</a></p>
          <p><a href="#">LinkedIn</a></p>
        </div>

        {/* Useful Links */}
        <div className={styles.column}>
          <h4>Explore</h4>
          <p><a href="#">About Us</a></p>
          <p><a href="#">Careers</a></p>
          <p><a href="#">Privacy Policy</a></p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} Savour & Sip. All rights reserved.</p>
      </div>
    </footer>
  );
}
