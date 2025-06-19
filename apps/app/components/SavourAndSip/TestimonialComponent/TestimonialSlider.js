'use client';
import styles from './TestimonialSlider.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function TestimonialSlider() {
  const testimonials = [
    {
      quote: "The team from Savour & Sip were the best bartenders I've ever hired. On time, dressed impeccably, and our guests loved them!",
      author: "Sarah & Michael",
      event: "Private Wedding, Mississauga",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      rating: 5
    },
    {
      quote: "I was blown away by their attention to detail and how effortlessly they staffed our restaurant grand opening.",
      author: "Chef Antonio Rodriguez",
      event: "Restaurant Manager, Toronto",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      rating: 5
    },
    {
      quote: "Professional, reliable, and absolutely fantastic service. They made our corporate gala seamless and elegant.",
      author: "Jennifer Walsh",
      event: "Corporate Event Planner, Ottawa",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      rating: 5
    },
    {
      quote: "From setup to cleanup, their catering team exceeded every expectation. Our guests are still talking about the food!",
      author: "David & Lisa Chen",
      event: "Anniversary Celebration, Markham",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`${styles.star} ${index < rating ? styles.filled : ''}`}>
        ★
      </span>
    ));
  };

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>What Our Clients Say</h2>
          <p className={styles.subtitle}>
            Real experiences from real events across Ontario
          </p>
        </motion.div>

        <motion.div
          className={styles.sliderWrapper}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            autoplay={{ 
              delay: 5000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true 
            }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            loop={true}
            slidesPerView={1}
            className={styles.swiper}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className={styles.testimonialCard}>
                  <div className={styles.imageSection}>
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.author} testimonial`}
                      className={styles.testimonialImage}
                    />
                    <div className={styles.imageOverlay}></div>
                  </div>
                  
                  <div className={styles.contentSection}>
                    <div className={styles.quoteIcon}>"</div>
                    <blockquote className={styles.quote}>
                      {testimonial.quote}
                    </blockquote>
                    
                    <div className={styles.rating}>
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    <div className={styles.authorInfo}>
                      <h4 className={styles.authorName}>{testimonial.author}</h4>
                      <p className={styles.eventDetails}>{testimonial.event}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
