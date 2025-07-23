'use client';
import styles from './HeaderComponent.module.css';
import Image from 'next/image';
import Link from 'next/link';


export default function ConsumerPulseHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.logo}>Consumer Pulse</div>
        <div className={styles.actions}>
          <Link href="/consumer-pulse-signin" className={styles.actionLink}>Sign In</Link>
          <a href="/consumer-pulse-comingsoon" className={styles.subscribeBtn}>Subscribe</a>
        </div>
      </div>
      <div className={styles.navbar}>
        <ul className={styles.navItems}>
          <li><Link href="/consumer-pulse">Home</Link></li>
          <li><Link href="/consumer-pulse-surveys">Surveys</Link></li>
          <li><Link href="/consumer-pulse-polling">Live Polling</Link></li>
          <li><Link href="/consumer-pulse-analytics">Analytics</Link></li>
        </ul>
        <input
          type="text"
          placeholder="Keywords to find news"
          className={styles.searchInput}
        />
      </div>
    </header>
  );
}
