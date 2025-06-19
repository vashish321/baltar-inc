'use client';
import styles from './QuickOverviewBanner.module.css';
import { motion } from 'framer-motion';

export default function QuickOverviewBanner() {
  const services = [
    {
      icon: '🥂',
      title: 'Bartending Services',
      description: 'Professional mixologists and mobile bar setups'
    },
    {
      icon: '🍽️',
      title: 'Catering & Food Service',
      description: 'Custom menus and professional food service'
    },
    {
      icon: '👨‍🍳',
      title: 'Restaurant & Kitchen Staffing',
      description: 'Experienced chefs, cooks, and kitchen staff'
    },
    {
      icon: '🧍‍♂️',
      title: 'Servers, Hosts, and Event Teams',
      description: 'Professional front-of-house and event staff'
    },
    {
      icon: '🎉',
      title: 'Private, Corporate & Venue Support',
      description: 'Complete event management and staffing solutions'
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
    <section className={styles.overviewSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.servicesGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={styles.serviceCard}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className={styles.serviceIcon}>
                {service.icon}
              </div>
              <h3 className={styles.serviceTitle}>
                {service.title}
              </h3>
              <p className={styles.serviceDescription}>
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
