'use client';
import styles from './ClientPortalPage.module.css';
import { motion } from 'framer-motion';

export default function ClientPortalPage() {
  const features = [
    {
      icon: '📊',
      title: 'Project Progress Tracking',
      description: 'See real-time updates on your website development progress with detailed milestones and timelines.'
    },
    {
      icon: '📁',
      title: 'Document Upload & Management',
      description: 'Easily upload logos, images, content, and other assets directly to your project workspace.'
    },
    {
      icon: '💬',
      title: 'Direct Communication',
      description: 'Chat directly with your development team, ask questions, and provide feedback in real-time.'
    },
    {
      icon: '🔍',
      title: 'Preview & Review',
      description: 'Access staging versions of your website to review and approve changes before they go live.'
    },
    {
      icon: '📋',
      title: 'Task Management',
      description: 'View and manage project tasks, deadlines, and deliverables in one organized dashboard.'
    },
    {
      icon: '📈',
      title: 'Analytics & Reports',
      description: 'Access website performance reports, analytics data, and maintenance summaries.'
    }
  ];

  const benefits = [
    'Complete transparency throughout the development process',
    'Faster project completion with streamlined communication',
    'Secure file sharing and document management',
    'Real-time collaboration with your development team',
    'Access to all project history and documentation',
    'Mobile-friendly interface for on-the-go access'
  ];

  return (
    <div className={styles.clientPortalPage}>
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
              Client <span className={styles.highlight}>Portal</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Your dedicated workspace for project collaboration, file sharing, and progress tracking
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Portal Features</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need to stay connected with your project
            </p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
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
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <div className={styles.benefitsGrid}>
            <motion.div
              className={styles.benefitsContent}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.benefitsTitle}>
                Why Use Our Client Portal?
              </h2>
              <p className={styles.benefitsDescription}>
                Our client portal transforms the traditional web development experience 
                by putting you in control and keeping you informed every step of the way.
              </p>
              
              <ul className={styles.benefitsList}>
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    className={styles.benefitItem}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <span className={styles.benefitIcon}>✓</span>
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              className={styles.benefitsVisual}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.portalMockup}>
                <div className={styles.mockupHeader}>
                  <div className={styles.mockupDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className={styles.mockupTitle}>Client Portal</div>
                </div>
                <div className={styles.mockupContent}>
                  <div className={styles.mockupSidebar}>
                    <div className={styles.sidebarItem}></div>
                    <div className={styles.sidebarItem}></div>
                    <div className={styles.sidebarItem}></div>
                  </div>
                  <div className={styles.mockupMain}>
                    <div className={styles.mainItem}></div>
                    <div className={styles.mainItem}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section className={styles.accessSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.accessContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.accessTitle}>Ready to Get Started?</h2>
            <p className={styles.accessDescription}>
              The client portal is available to all our clients at no additional cost. 
              Get access when you start your project with us.
            </p>
            <div className={styles.accessButtons}>
              <motion.a
                href="/frontend-web-design-contact-us"
                className={styles.primaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Project
              </motion.a>
              <motion.a
                href="/frontend-web-design/about"
                className={styles.secondaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
