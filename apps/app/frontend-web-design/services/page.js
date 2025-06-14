'use client';
import styles from './ServicesPage.module.css';
import { motion } from 'framer-motion';

export default function ServicesPage() {
  const services = [
    {
      icon: '💡',
      title: 'Custom Web Design & Development',
      description: 'We create mobile-friendly, fast-loading websites tailored to your brand, with modern, accessible design and user-friendly navigation.',
      features: [
        'Fully custom or theme-based builds',
        'Responsive design for mobile, tablet, and desktop',
        'User experience (UX) design & layout',
        'UI elements tailored to your brand',
        'Conversion-optimized layouts',
        'Optional blog setup'
      ],
      highlight: 'Whether you\'re a lawyer, baker, artist, or consultant, we design with your customers in mind.'
    },
    {
      icon: '🌐',
      title: 'Domain Name Registration',
      description: 'Secure the perfect .com, .ca, or niche domain for your brand.',
      features: [
        'Domain search & suggestions',
        'Domain purchase & DNS setup',
        'Domain transfer from GoDaddy, Namecheap, etc.',
        'Subdomain configuration',
        'Domain privacy protection'
      ]
    },
    {
      icon: '🖥️',
      title: 'Hosting Solutions',
      description: 'Lightning-fast hosting with real-time security and backups. Free or low-cost hosting plans available.',
      features: [
        'Shared or dedicated hosting',
        'WordPress, HTML, or custom stack hosting',
        'Free SSL certificate (HTTPS)',
        'CDN integration for global speed',
        'Daily/weekly backups',
        'CPanel, Cloudflare, or custom admin panel'
      ]
    },
    {
      icon: '📧',
      title: 'Professional Email Setup',
      description: 'Custom emails like you@yourdomain.com with Gmail, Microsoft 365, or Zoho.',
      features: [
        'Email account setup',
        'Migration from old providers',
        'MX record configuration',
        'Calendar & mobile sync'
      ]
    },
    {
      icon: '🛒',
      title: 'E-Commerce Websites',
      description: 'Start selling online with a complete online store setup.',
      features: [
        'Shopify',
        'WooCommerce (WordPress)',
        'Stripe/PayPal integration',
        'Product listings & cart design',
        'Inventory, tax, shipping setup',
        'Abandoned cart & promo tools'
      ]
    },
    {
      icon: '🛠️',
      title: 'Ongoing Support & Maintenance',
      description: 'Let us manage your site so you can focus on business.',
      features: [
        'Monthly updates',
        'Performance reports',
        'Security patching',
        'Bug fixes',
        'Content & image changes',
        'SEO audits & refresh'
      ]
    }
  ];

  const advancedServices = [
    'Analytics integration',
    'Google Ads setup',
    'Custom animations & interactive features',
    'ADA/AODA compliance',
    'API integrations',
    'Booking systems',
    'Payment portals'
  ];

  return (
    <div className={styles.servicesPage}>
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
              Our <span className={styles.highlight}>Services</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Clearly outline everything we offer to bring your digital vision to life
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <motion.div
                key={index}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.serviceHeader}>
                  <div className={styles.serviceIcon}>
                    {service.icon}
                  </div>
                  <h3 className={styles.serviceTitle}>
                    {service.title}
                  </h3>
                </div>
                
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
                
                <div className={styles.serviceFeatures}>
                  <h4 className={styles.featuresTitle}>Features include:</h4>
                  <ul className={styles.featuresList}>
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={styles.featureItem}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {service.highlight && (
                  <div className={styles.serviceHighlight}>
                    {service.highlight}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Services */}
      <section className={styles.advancedSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.advancedContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.advancedTitle}>
              🚀 Advanced Services
            </h2>
            <p className={styles.advancedSubtitle}>
              For larger or premium clients
            </p>
            
            <div className={styles.advancedGrid}>
              {advancedServices.map((service, index) => (
                <motion.div
                  key={index}
                  className={styles.advancedItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className={styles.advancedBullet}>•</span>
                  {service}
                </motion.div>
              ))}
            </div>
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
            <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
            <p className={styles.ctaDescription}>
              Let's discuss which services are right for your business and create a custom package that fits your needs.
            </p>
            <div className={styles.ctaButtons}>
              <motion.a
                href="/frontend-web-design/pricing"
                className={styles.primaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get a Free Quote
              </motion.a>
              <motion.a
                href="/frontend-web-design/portfolio"
                className={styles.secondaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Portfolio
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
