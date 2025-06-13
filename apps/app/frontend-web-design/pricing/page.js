'use client';
import styles from './PricingPage.module.css';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const pricingPlans = [
    {
      name: 'Starter',
      price: '$899',
      period: 'one-time',
      description: 'Perfect for small businesses and professionals getting started online',
      features: [
        'Custom 5-page website',
        'Mobile-responsive design',
        'Basic SEO setup',
        'Contact form integration',
        'Free domain for 1 year',
        'Free hosting for 1 year',
        'SSL certificate included',
        '30 days of support'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      name: 'Professional',
      price: '$1,499',
      period: 'one-time',
      description: 'Ideal for growing businesses that need more features and functionality',
      features: [
        'Custom 10-page website',
        'Advanced mobile optimization',
        'Complete SEO package',
        'Google Analytics setup',
        'Professional email setup',
        'Social media integration',
        'Blog setup & training',
        'Free hosting for 1 year',
        '60 days of support'
      ],
      popular: true,
      cta: 'Most Popular'
    },
    {
      name: 'E-Commerce',
      price: '$2,299',
      period: 'one-time',
      description: 'Complete online store solution for businesses ready to sell online',
      features: [
        'Full e-commerce website',
        'Product catalog setup',
        'Payment gateway integration',
        'Inventory management',
        'Order tracking system',
        'Customer account portal',
        'Advanced SEO & marketing',
        'Free hosting for 1 year',
        '90 days of support'
      ],
      popular: false,
      cta: 'Start Selling'
    }
  ];

  const addOns = [
    { name: 'Logo design', price: '$120' },
    { name: 'Monthly maintenance', price: '$49/month' },
    { name: 'Content writing', price: '$75/page' },
    { name: 'Booking system', price: '$150' },
    { name: 'Google Business Setup', price: '$100' },
    { name: 'Advanced Analytics', price: '$200' },
    { name: 'Custom Forms', price: '$80' },
    { name: 'Live Chat Integration', price: '$120' }
  ];

  return (
    <div className={styles.pricingPage}>
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
              Simple, <span className={styles.highlight}>Transparent Pricing</span>
            </h1>
            <p className={styles.heroSubtitle}>
              No hidden fees, no surprises. Choose the package that fits your business needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className={styles.pricingSection}>
        <div className={styles.container}>
          <div className={styles.pricingGrid}>
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>
                    Most Popular
                  </div>
                )}
                
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>{plan.price}</span>
                    <span className={styles.period}>{plan.period}</span>
                  </div>
                  <p className={styles.planDescription}>
                    {plan.description}
                  </p>
                </div>
                
                <div className={styles.planFeatures}>
                  <ul className={styles.featuresList}>
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={styles.featureItem}>
                        <span className={styles.checkmark}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <motion.a
                  href="/frontend-web-design-contact-us"
                  className={`${styles.planButton} ${plan.popular ? styles.popularButton : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {plan.cta}
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className={styles.addOnsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.addOnsHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.addOnsTitle}>Add-Ons</h2>
            <p className={styles.addOnsSubtitle}>
              Enhance your website with these optional services
            </p>
          </motion.div>

          <motion.div
            className={styles.addOnsGrid}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6,
              staggerChildren: 0.1
            }}
          >
            {addOns.map((addOn, index) => (
              <motion.div
                key={index}
                className={styles.addOnItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <span className={styles.addOnName}>{addOn.name}</span>
                <span className={styles.addOnPrice}>{addOn.price}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Custom Package CTA */}
      <section className={styles.customSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.customContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.customTitle}>Need Something Custom?</h2>
            <p className={styles.customDescription}>
              Every business is unique. Let's build a custom package that perfectly fits your needs and budget.
            </p>
            <div className={styles.customButtons}>
              <motion.a
                href="/frontend-web-design-contact-us"
                className={styles.primaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Build Your Own Package →
              </motion.a>
              <motion.a
                href="/frontend-web-design-contact-us"
                className={styles.secondaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get a Free Quote
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
