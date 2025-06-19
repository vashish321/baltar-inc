'use client';
import styles from './EventsPage.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SharedHeader from '../../components/SavourAndSip/SharedHeaderComponent/SharedHeader';

export default function EventsPage() {
  const router = useRouter();

  const eventTypes = [
    {
      title: 'Private Events',
      description: 'Birthdays, Anniversaries, Housewarming Parties, Graduations',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      video: 'https://videos.pexels.com/video-files/6893055/6893055-uhd_2560_1440_25fps.mp4',
      features: ['Intimate gatherings', 'Personalized service', 'Custom menus', 'Flexible timing'],
      link: '/sip-and-savour/services'
    },
    {
      title: 'Weddings',
      description: 'Rehearsals, Ceremonies, Receptions, Brunches',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      video: 'https://videos.pexels.com/video-files/8191830/8191830-uhd_2560_1440_25fps.mp4',
      features: ['Full wedding packages', 'Bridal consultations', 'Ceremony & reception', 'Rehearsal dinners'],
      link: '/sip-and-savour/services'
    },
    {
      title: 'Corporate Events',
      description: 'Retreats, Fundraisers, Holiday Parties, Meetings',
      image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      video: 'https://videos.pexels.com/video-files/7579952/7579952-uhd_2560_1440_25fps.mp4',
      features: ['Professional service', 'Large scale catering', 'AV coordination', 'Team building events'],
      link: '/sip-and-savour/services'
    },
    {
      title: 'Venue Partnerships',
      description: 'Regular staffing for halls, clubs, and event spaces',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      video: 'https://videos.pexels.com/video-files/3298637/3298637-uhd_2560_1440_25fps.mp4',
      features: ['Ongoing partnerships', 'Reliable staff', 'Venue-specific training', 'Flexible contracts'],
      link: '/sip-and-savour/services'
    },
    {
      title: 'Pop-Ups & Brand Launches',
      description: 'Fashion events, brand parties, activations',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      video: 'https://videos.pexels.com/video-files/5490778/5490778-uhd_2560_1440_25fps.mp4',
      features: ['Creative concepts', 'Brand alignment', 'Social media ready', 'Unique experiences'],
      link: '/sip-and-savour/services'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className={styles.eventsPage}>
      {/* Shared Header */}
      <SharedHeader currentPage="/sip-and-savour/events" />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroVideo}>
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            alt="Events We Serve"
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
            Events We <span className={styles.highlight}>Serve</span>
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            From intimate gatherings to grand celebrations, we bring professionalism to every occasion
          </motion.p>
        </div>
      </section>

      {/* Events Grid */}
      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.eventsGrid}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {eventTypes.map((event, index) => (
              <motion.div
                key={index}
                className={styles.eventCard}
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                onClick={() => router.push(event.link)}
              >
                <div className={styles.eventMedia}>
                  <video
                    className={styles.eventVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={event.image}
                  >
                    <source src={event.video} type="video/mp4" />
                  </video>
                  <div className={styles.eventOverlay}>
                    <div className={styles.overlayContent}>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <p className={styles.eventDescription}>{event.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.eventContent}>
                  <div className={styles.eventFeatures}>
                    {event.features.map((feature, i) => (
                      <span key={i} className={styles.featureTag}>
                        {feature}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    className={styles.eventButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More →
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.processHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.processTitle}>How We Work</h2>
            <p className={styles.processSubtitle}>
              Our streamlined process ensures your event runs flawlessly
            </p>
          </motion.div>

          <div className={styles.processSteps}>
            {[
              { step: '01', title: 'Consultation', description: 'We discuss your vision, requirements, and budget' },
              { step: '02', title: 'Planning', description: 'Custom proposal with detailed timeline and staffing plan' },
              { step: '03', title: 'Preparation', description: 'Menu planning, staff briefing, and setup coordination' },
              { step: '04', title: 'Execution', description: 'Professional service delivery on your event day' },
              { step: '05', title: 'Follow-up', description: 'Post-event review and feedback collection' }
            ].map((process, index) => (
              <motion.div
                key={index}
                className={styles.processStep}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={styles.stepNumber}>{process.step}</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>{process.title}</h4>
                  <p className={styles.stepDescription}>{process.description}</p>
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
            <h2 className={styles.ctaTitle}>Ready to Plan Your Event?</h2>
            <p className={styles.ctaDescription}>
              Let's create an unforgettable experience together. Contact us for a custom quote.
            </p>
            <div className={styles.ctaButtons}>
              <motion.button 
                className={styles.primaryButton}
                onClick={() => router.push('/sip-and-savour/pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get a Quote
              </motion.button>
              <motion.button 
                className={styles.secondaryButton}
                onClick={() => router.push('/sip-and-savour/services')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Services
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
