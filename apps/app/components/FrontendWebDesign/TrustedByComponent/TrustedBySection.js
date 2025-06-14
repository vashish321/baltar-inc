'use client';
import styles from './TrustedBySection.module.css';
import { motion } from 'framer-motion';

export default function TrustedBySection() {
  const trustedBy = [
    {
      icon: '👩‍⚕️',
      title: 'Doctors',
      description: 'Medical professionals building patient trust online'
    },
    {
      icon: '🎨',
      title: 'Creatives',
      description: 'Artists and designers showcasing their portfolios'
    },
    {
      icon: '🚀',
      title: 'Startups',
      description: 'New businesses launching their digital presence'
    },
    {
      icon: '🏳️‍🌈',
      title: 'LGBT-owned businesses',
      description: 'Inclusive businesses serving diverse communities'
    },
    {
      icon: '🤝',
      title: 'Local nonprofits',
      description: 'Organizations making a difference in their communities'
    },
    {
      icon: '🍽️',
      title: 'Restaurants & retailers',
      description: 'Local businesses connecting with customers'
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
    <section className={styles.trustedSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Trusted By</h2>
          <p className={styles.subtitle}>
            We're proud to serve diverse businesses and organizations across Canada
          </p>
        </motion.div>

        <motion.div
          className={styles.trustedGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {trustedBy.map((item, index) => (
            <motion.div
              key={index}
              className={styles.trustedItem}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
            >
              <div className={styles.itemIcon}>
                {item.icon}
              </div>
              <h3 className={styles.itemTitle}>
                {item.title}
              </h3>
              <p className={styles.itemDescription}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.testimonialPreview}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.testimonial}>
            <p className={styles.testimonialText}>
              "Baltar Technologies transformed our online presence. Professional, 
              fast, and exactly what we needed to grow our business."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>
                <span>JD</span>
              </div>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>Dr. Jane Doe</span>
                <span className={styles.authorTitle}>Family Medicine Clinic</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
