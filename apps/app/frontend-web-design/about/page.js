'use client';
import styles from './AboutPage.module.css';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const values = [
    {
      icon: '🎯',
      title: 'Simplicity in design & process',
      description: 'We believe great design should be intuitive and the process should be straightforward.'
    },
    {
      icon: '💎',
      title: 'Full ownership — no hidden fees',
      description: 'Transparent pricing with no surprises. You own your website and all its content.'
    },
    {
      icon: '💬',
      title: 'Clear communication',
      description: 'We keep you informed every step of the way with regular updates and clear explanations.'
    },
    {
      icon: '🤝',
      title: 'Inclusive & client-first',
      description: 'We welcome all businesses and put your needs at the center of everything we do.'
    },
    {
      icon: '📈',
      title: 'Scalable technology',
      description: 'We build websites that grow with your business using modern, flexible technologies.'
    }
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.heroTitle}>
              We Don't Just Build Websites — 
              <span className={styles.highlight}> We Build Your Brand's Digital Home.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <motion.div
              className={styles.storyContent}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.sectionTitle}>Our Story</h2>
              <p className={styles.storyText}>
                Founded with the vision of helping professionals and businesses stand out online 
                without breaking the bank, Baltar Technologies was built to provide all-in-one 
                digital services with a human touch.
              </p>
              <p className={styles.storyText}>
                We're not just developers — we're designers, strategists, and problem-solvers 
                who understand that your website is often the first impression potential 
                customers have of your business.
              </p>
            </motion.div>
            
            <motion.div
              className={styles.storyVisual}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.visualCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.designElement1}></div>
                  <div className={styles.designElement2}></div>
                  <div className={styles.designElement3}></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.missionContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.missionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              "To make high-end, fully managed websites accessible and affordable to everyone — 
              from startups to established businesses."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.valuesHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <p className={styles.valuesSubtitle}>
              These principles guide everything we do
            </p>
          </motion.div>

          <motion.div
            className={styles.valuesGrid}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6,
              staggerChildren: 0.1
            }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className={styles.valueCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className={styles.valueIcon}>
                  {value.icon}
                </div>
                <h3 className={styles.valueTitle}>
                  {value.title}
                </h3>
                <p className={styles.valueDescription}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.ctaTitle}>Ready to Work Together?</h2>
            <p className={styles.ctaDescription}>
              Let's bring your vision to life with a website that truly represents your brand.
            </p>
            <div className={styles.ctaButtons}>
              <motion.a
                href="/frontend-web-design-contact-us"
                className={styles.primaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Project
              </motion.a>
              <motion.a
                href="/frontend-web-design-contact-us"
                className={styles.secondaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
