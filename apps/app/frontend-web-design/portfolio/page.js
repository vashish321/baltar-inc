'use client';
import styles from './PortfolioPage.module.css';
import { motion } from 'framer-motion';

export default function PortfolioPage() {
  const projects = [
    {
      id: 1,
      title: 'Dr. Sarah Johnson - Family Medicine',
      industry: 'Healthcare',
      image: '/portfolio/medical-site.jpg',
      description: 'Professional medical practice website with patient portal and appointment booking.',
      features: ['Patient Portal', 'Online Booking', 'Medical Forms', 'Insurance Info'],
      liveUrl: '#',
      category: 'Medical'
    },
    {
      id: 2,
      title: 'Artisan Photography Studio',
      industry: 'Creative',
      image: '/portfolio/photography-site.jpg',
      description: 'Stunning portfolio website showcasing wedding and portrait photography.',
      features: ['Gallery System', 'Client Proofing', 'Booking Calendar', 'Payment Integration'],
      liveUrl: '#',
      category: 'Creative'
    },
    {
      id: 3,
      title: 'TechStart Solutions',
      industry: 'Startup',
      image: '/portfolio/startup-site.jpg',
      description: 'Modern SaaS landing page with lead generation and product demos.',
      features: ['Lead Generation', 'Product Demo', 'Pricing Tables', 'Analytics'],
      liveUrl: '#',
      category: 'Startup'
    },
    {
      id: 4,
      title: 'Rainbow Community Center',
      industry: 'LGBT+ Nonprofit',
      image: '/portfolio/nonprofit-site.jpg',
      description: 'Inclusive community website with event management and donation system.',
      features: ['Event Management', 'Donation Portal', 'Volunteer System', 'Resource Library'],
      liveUrl: '#',
      category: 'Nonprofit'
    },
    {
      id: 5,
      title: 'Bella Vista Restaurant',
      industry: 'Restaurant',
      image: '/portfolio/restaurant-site.jpg',
      description: 'Elegant restaurant website with online menu and reservation system.',
      features: ['Digital Menu', 'Reservations', 'Online Ordering', 'Event Booking'],
      liveUrl: '#',
      category: 'Restaurant'
    },
    {
      id: 6,
      title: 'Urban Threads Boutique',
      industry: 'E-commerce',
      image: '/portfolio/ecommerce-site.jpg',
      description: 'Full-featured online clothing store with inventory management.',
      features: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'Inventory Management'],
      liveUrl: '#',
      category: 'E-commerce'
    }
  ];

  const categories = ['All', 'Medical', 'Creative', 'Startup', 'Nonprofit', 'Restaurant', 'E-commerce'];

  return (
    <div className={styles.portfolioPage}>
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
              Our <span className={styles.highlight}>Portfolio</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Show off our best work across different industries and business types
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.container}>
          <div className={styles.filterButtons}>
            {categories.map((category, index) => (
              <motion.button
                key={category}
                className={`${styles.filterButton} ${index === 0 ? styles.active : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className={styles.portfolioSection}>
        <div className={styles.container}>
          <div className={styles.portfolioGrid}>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className={styles.projectCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.projectImage}>
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.placeholderText}>
                      {project.title}
                    </span>
                  </div>
                  <div className={styles.projectOverlay}>
                    <motion.a
                      href="#"
                      className={styles.viewButton}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      View Live Site
                    </motion.a>
                  </div>
                </div>
                
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <h3 className={styles.projectTitle}>
                      {project.title}
                    </h3>
                    <span className={styles.projectIndustry}>
                      {project.industry}
                    </span>
                  </div>
                  
                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>
                  
                  <div className={styles.projectFeatures}>
                    <h4 className={styles.featuresTitle}>Key Features:</h4>
                    <div className={styles.featuresTags}>
                      {project.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className={styles.featureTag}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
            <h2 className={styles.ctaTitle}>Want a website like these?</h2>
            <p className={styles.ctaDescription}>
              Let's create something amazing for your business. Every project is unique and tailored to your specific needs.
            </p>
            <div className={styles.ctaButtons}>
              <motion.a
                href="/frontend-web-design/pricing"
                className={styles.primaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get a Free Quote →
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
