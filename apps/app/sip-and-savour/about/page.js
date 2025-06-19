'use client';
import styles from './AboutPage.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SharedHeader from '../../components/SavourAndSip/SharedHeaderComponent/SharedHeader';

export default function AboutPage() {
  const router = useRouter();

  const values = [
    {
      icon: '🏅',
      title: 'Smart Serve & WHMIS Certified Staff',
      description: 'All our team members are properly certified and trained to the highest industry standards.'
    },
    {
      icon: '🕒',
      title: 'Flexible Scheduling & On-Demand Teams',
      description: 'Available when you need us, from last-minute requests to long-term contracts.'
    },
    {
      icon: '🧾',
      title: 'Insured & Bonded',
      description: 'Complete peace of mind with full insurance coverage and bonding for all staff.'
    },
    {
      icon: '📍',
      title: 'Locally Owned & Operated in Ontario',
      description: 'Proud to serve communities across Ontario with local expertise and knowledge.'
    },
    {
      icon: '🤝',
      title: 'Relationship-Focused, Not Just Transactional',
      description: 'We build lasting partnerships with our clients, understanding your unique needs.'
    }
  ];

  const teamMembers = [
    {
      name: 'Sarah Mitchell',
      role: 'Founder & Event Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1888&q=80',
      bio: '15+ years in hospitality management and event coordination'
    },
    {
      name: 'Chef Marcus Rodriguez',
      role: 'Executive Chef',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      bio: 'Culinary arts graduate with experience in fine dining and catering'
    },
    {
      name: 'Jennifer Walsh',
      role: 'Staffing Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
      bio: 'Expert in hospitality recruitment and team coordination'
    }
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Shared Header */}
      <SharedHeader currentPage="/sip-and-savour/about" />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroVideo}>
          <img
            src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="About Us"
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Crafted in Hospitality. <span className={styles.highlight}>Rooted in Passion.</span>
          </motion.h1>
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
                Savour & Sip was founded to solve a growing problem in Ontario's event and hospitality scene: 
                the lack of reliable, professional, and personable staff. With decades of combined experience 
                in bartending, culinary arts, restaurant management, and event coordination, we built a company 
                that provides end-to-end hospitality services that are consistent, elegant, and stress-free.
              </p>
            </motion.div>
            
            <motion.div
              className={styles.storyVisual}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Our founding story" className={styles.storyImage} />
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
              "To elevate the standard of hospitality staffing and catering across Ontario — 
              one perfect event at a time."
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.valuesHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>What Sets Us Apart</h2>
          </motion.div>

          <div className={styles.valuesGrid}>
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
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.teamHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
            <p className={styles.teamSubtitle}>
              The passionate professionals behind every successful event
            </p>
          </motion.div>

          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className={styles.teamCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className={styles.memberImage}>
                  <img src={member.image} alt={member.name} />
                </div>
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  <p className={styles.memberBio}>{member.bio}</p>
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
            <h2 className={styles.ctaTitle}>Ready to Work Together?</h2>
            <p className={styles.ctaDescription}>
              Let's bring your vision to life with professional hospitality services.
            </p>
            <div className={styles.ctaButtons}>
              <motion.button 
                className={styles.primaryButton}
                onClick={() => router.push('/sip-and-savour/services')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Our Services
              </motion.button>
              <motion.button 
                className={styles.secondaryButton}
                onClick={() => router.push('/sip-and-savour/pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get a Quote
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
