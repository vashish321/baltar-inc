"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import styles from "./HeroSection.module.css";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Bringing Hospitality to Life — One Event, One Venue, One Team at a Time.",
    description: "Event bartenders, catering, restaurant staffing, and hospitality experts serving private, corporate, and commercial clients across Ontario.",
    buttonText: "Book Our Services",
    buttonLink: "/sip-and-savour/services",
  },
  {
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Professional Hospitality Staff",
    description: "Trained bartenders, servers, chefs, and event teams ready to make your event unforgettable.",
    buttonText: "Hire Hospitality Staff",
    buttonLink: "/sip-and-savour/services",
  },
  {
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    title: "Complete Event Solutions",
    description: "From intimate dinners to corporate galas, we handle every detail with professionalism and care.",
    buttonText: "Plan Your Event",
    buttonLink: "/sip-and-savour/events",
  },
];

const menuItems = [
  { name: "Home", link: "/sip-and-savour" },
  { name: "About Us", link: "/sip-and-savour/about" },
  { name: "Services", link: "/sip-and-savour/services" },
  { name: "Events We Serve", link: "/sip-and-savour/events" },
  { name: "Menu", link: "/sip-and-savour/menu" },
  { name: "Pricing", link: "/sip-and-savour/pricing" },
];

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true); // ⭐️ NEW
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 100) { // jab hero ke neeche jaaye
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = (link) => {
    router.push(link);
    setMenuOpen(false);
  };

  const handleButtonClick = (link) => {
    router.push(link);
  };

  return (
    <div className={styles.heroContainer}>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false
        }}
        loop={true}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{
          clickable: true,
          dynamicBullets: true
        }}
        speed={800}
        className={styles.swiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <img src={slide.image} alt={slide.title} className={styles.bgVideo} />
            <div className={styles.overlay}></div>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {slide.title}
              </motion.h1>
              {slide.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  {slide.description}
                </motion.p>
              )}
              <motion.button
                className={styles.heroButton}
                onClick={() => handleButtonClick(slide.buttonLink)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {slide.buttonText}
              </motion.button>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navbar */}
      <div
        className={styles.heroNavbar}
        style={{
          opacity: showNavbar ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: showNavbar ? "auto" : "none",
        }}
      >
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
                    <li key={index} onClick={() => handleMenuClick(item.link)}>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
