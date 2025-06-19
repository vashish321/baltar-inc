'use client';
import styles from './WhoWeServe.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function WhoWeServe() {
  const router = useRouter();

  const clientTypes = [
    {
      title: 'Private Clients',
      description: 'Backyard parties, weddings, home dinners, birthdays',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      video: 'https://videos.pexels.com/video-files/5490778/5490778-uhd_2560_1440_25fps.mp4',
      link: '/sip-and-savour/events'
    },
    {
      title: 'Corporate Clients',
      description: 'Office events, brand launches, fundraisers, galas',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      video: 'https://videos.pexels.com/video-files/4253285/4253285-uhd_2560_1440_25fps.mp4',
      link: '/sip-and-savour/events'
    },
    {
      title: 'Restaurants & Hospitality',
      description: 'Short-term or ongoing kitchen/front-of-house staffing',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      video: 'https://videos.pexels.com/video-files/4253312/4253312-uhd_2560_1440_25fps.mp4',
      link: '/sip-and-savour/services'
    },
    {
      title: 'Event Planners & Venues',
      description: 'Reliable partners for multiple events, weekly or on-call',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      video: 'https://videos.pexels.com/video-files/5490778/5490778-uhd_2560_1440_25fps.mp4',
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

  const handleCardClick = (link) => {
    router.push(link);
  };

  return (
    <section className={styles.whoWeServeSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Who We Serve</h2>
          <p className={styles.subtitle}>
            Professional hospitality services tailored to your unique needs
          </p>
        </motion.div>

        <motion.div
          className={styles.clientGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {clientTypes.map((client, index) => (
            <motion.div
              key={index}
              className={styles.clientCard}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleCardClick(client.link)}
            >
              <div className={styles.mediaWrapper}>
                <video
                  className={styles.clientVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={client.image}
                >
                  <source src={client.video} type="video/mp4" />
                </video>
                <div className={styles.videoOverlay}>
                  <div className={styles.overlayContent}>
                    <h3 className={styles.clientTitle}>{client.title}</h3>
                    <p className={styles.clientDescription}>{client.description}</p>
                    <button className={styles.learnMoreBtn}>Learn More →</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
