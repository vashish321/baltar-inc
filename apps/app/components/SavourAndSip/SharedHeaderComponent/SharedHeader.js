'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SharedHeader.module.css';

const menuItems = [
  { name: "Home", link: "/sip-and-savour" },
  { name: "About Us", link: "/sip-and-savour/about" },
  { name: "Services", link: "/sip-and-savour/services" },
  { name: "Events We Serve", link: "/sip-and-savour/events" },
  { name: "Menu", link: "/sip-and-savour/menu" },
  { name: "Pricing", link: "/sip-and-savour/pricing" },
];

export default function SharedHeader({ currentPage = '' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMenuClick = (link) => {
    router.push(link);
    setMenuOpen(false);
  };

  const handleButtonClick = (link) => {
    router.push(link);
  };

  return (
    <>
      {/* Header Navbar */}
      <div className={styles.headerNavbar}>
        <button className={styles.menuButton} onClick={() => setMenuOpen(true)}>☰</button>
        <button className={styles.locationButton} onClick={() => handleButtonClick("/sip-and-savour/services")}>
          Book Services
        </button>
      </div>

      {/* Sidebar */}
      {menuOpen && (
        <>
          <div className={styles.menuBackdrop} onClick={() => setMenuOpen(false)}></div>
          <div className={styles.sidebarMenu}>
            <button className={styles.closeButton} onClick={() => setMenuOpen(false)}>×</button>
            <div className={styles.menuSections}>
              <div className={styles.leftMenu}>
                <h3>Navigation</h3>
                <ul>
                  {menuItems.map((item, index) => (
                    <li 
                      key={index} 
                      onClick={() => handleMenuClick(item.link)}
                      className={currentPage === item.link ? styles.active : ''}
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
