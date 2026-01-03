'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import './HeaderComponent.css';

export default function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cursorStyle, setCursorStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!isMenuOpen) return;
    setCursorStyle({
      left: `${e.clientX - 25}px`,
      top: `${e.clientY - 25}px`,
    });
  };

  useEffect(() => {
    if (isMenuOpen) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMenuOpen]);

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="cuberto-header">
      <div className="header-title">
        <Image src="/Toronto-Media.svg" alt="Toronto Media Inc. Logo" width={40} height={40} />
        <span>Toronto Media Inc.</span>
      </div>
      <button className="menu-button" onClick={() => setIsMenuOpen(true)}>
        menu <span className="hamburger">≡</span>
      </button>

      {isMenuOpen && (
        <>
          <div className="menu-overlay">
            <button className="close-button" onClick={() => setIsMenuOpen(false)}>×</button>
            <div className="menu-content">
              <div className="menu-left">
                <p className="menu-heading">Social media</p>
                <ul>
                  <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
                  <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
                  <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
                  <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
                </ul>
              </div>
              <div className="menu-right">
                <p className="menu-heading">Menu</p>
                <ul className="main-links">
                  <li><a href="/frontend-web-design" onClick={handleMenuClick}>Home</a></li>
                  <li><a href="/frontend-web-design/about" onClick={handleMenuClick}>About Us</a></li>
                  <li><a href="/frontend-web-design/services" onClick={handleMenuClick}>Services</a></li>
                  <li><a href="/frontend-web-design/portfolio" onClick={handleMenuClick}>Portfolio</a></li>
                  <li><a href="/frontend-web-design/pricing" onClick={handleMenuClick}>Pricing</a></li>
                  <li><a href="/frontend-web-design/faq" onClick={handleMenuClick}>FAQ</a></li>
                  <li><a href="/frontend-web-design/client-portal" onClick={handleMenuClick}>Client Portal</a></li>
                  <li><a href="/frontend-web-design-contact-us" onClick={handleMenuClick}>Contact Us</a></li>
                </ul>
                <div className="contact-block">
                  <p>Get in touch</p>
                  <a href="mailto:admin@baltar.ca">admin@baltar.ca</a>
                </div>
              </div>
            </div>
          </div>
          <div className="cursor-circle" style={cursorStyle}></div>
        </>
      )}
    </header>
  );
}
