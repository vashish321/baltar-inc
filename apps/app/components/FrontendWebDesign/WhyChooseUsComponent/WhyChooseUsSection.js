'use client';
import styles from './WhyChooseUsSection.module.css';
import { motion } from 'framer-motion';

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: '🎯',
      title: 'One-stop solution',
      description: 'hosting, design, email, domains'
    },
    {
      icon: '🚀',
      title: 'No tech skills needed',
      description: 'we handle it all'
    },
    {
      icon: '⚡',
      title: 'Lightning-fast site speeds',
      description: 'and security'
    },
    {
      icon: '🇨🇦',
      title: 'Canadian-owned',
      description: '& operated'
    },
    {
      icon: '💎',
      title: 'Transparent pricing',
      description: 'and ongoing support'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className={styles.whyChooseSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Why Choose Us</h2>
          <p className={styles.subtitle}>
            We're not just another web development company. Here's what makes us different.
          </p>
        </motion.div>

        <motion.div
          className={styles.featuresGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>
                {feature.title}
              </h3>
              <p className={styles.featureDescription}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.ctaSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className={styles.ctaTitle}>
            Ready to get started?
          </h3>
          <p className={styles.ctaDescription}>
            Whether you're starting a business or upgrading your website — we're ready when you are.
          </p>
          <div className={styles.ctaButtons}>
            <motion.a
              href="mailto:admin@baltar.ca"
              className={styles.primaryButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✉️ admin@baltar.ca
            </motion.a>
            <motion.a
              href="/frontend-web-design-contact-us"
              className={styles.secondaryButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started →
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
