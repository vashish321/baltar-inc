'use client';
import styles from './QuickSnapshotTiles.module.css';
import { motion } from 'framer-motion';

export default function QuickSnapshotTiles() {
  const tiles = [
    {
      icon: '🌐',
      title: 'Domain Registration & Hosting',
      description: 'Secure your perfect domain and lightning-fast hosting'
    },
    {
      icon: '🎨',
      title: 'Custom Frontend Design',
      description: 'Beautiful, responsive designs tailored to your brand'
    },
    {
      icon: '⚙️',
      title: 'Site Management & Updates',
      description: 'We handle all maintenance so you can focus on business'
    },
    {
      icon: '📱',
      title: 'Mobile & SEO Optimization',
      description: 'Mobile-first design with built-in SEO best practices'
    },
    {
      icon: '🛒',
      title: 'E-Commerce Integration',
      description: 'Complete online store setup with payment processing'
    },
    {
      icon: '🔒',
      title: 'SSL Security & Analytics',
      description: 'Enterprise-grade security with detailed performance insights'
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

  const tileVariants = {
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
    <section className={styles.snapshotSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.tilesGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {tiles.map((tile, index) => (
            <motion.div
              key={index}
              className={styles.tile}
              variants={tileVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className={styles.tileIcon}>
                {tile.icon}
              </div>
              <h3 className={styles.tileTitle}>
                {tile.title}
              </h3>
              <p className={styles.tileDescription}>
                {tile.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
