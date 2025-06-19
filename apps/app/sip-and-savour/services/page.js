'use client';
import styles from './ServicesPage.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SharedHeader from '../../components/SavourAndSip/SharedHeaderComponent/SharedHeader';

export default function ServicesPage() {
  const router = useRouter();

  const services = [
    {
      id: 'bartending',
      icon: '🥂',
      title: 'Bartending Services',
      description: 'Whether you\'re looking for classic elegance or a creative flair, our bartenders know how to mix, serve, and charm. From themed events to high-volume weddings, we provide the full bar experience — without the stress.',
      video: 'https://videos.pexels.com/video-files/5490778/5490778-uhd_2560_1440_25fps.mp4',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      eventTypes: ['Weddings', 'Cocktail Parties', 'Backyard BBQs', 'VIP Dinners', 'Corporate Mixers'],
      staffProvided: ['Mixologists', 'Flair Bartenders', 'Mobile Bar Setup', 'Barbacks', 'Beverage Coordinators'],
      features: ['Custom Signature Cocktails', 'Bar Rentals & Equipment', 'Glassware & Ice Service', 'Alcohol Consulting & Shopping Lists']
    },
    {
      id: 'catering',
      icon: '🍽️',
      title: 'Catering Services',
      description: 'Our chefs source fresh ingredients, tailor every menu to your event, and ensure seamless presentation and timing — so all you have to do is enjoy.',
      video: 'https://videos.pexels.com/video-files/3298637/3298637-uhd_2560_1440_25fps.mp4',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      eventTypes: ['Weddings', 'Corporate Luncheons', 'Private Chef Dinners', 'Pop-Up Events', 'Conferences'],
      servicesInclude: ['Menu Creation & Tastings', 'Food Preparation & Service', 'Buffet or Plated Options', 'Delivery or On-Site Prep', 'Staff for Setup & Clean-up'],
      cateringStyles: ['Canapés & Hors d\'Oeuvres', 'Formal Dinners', 'BBQ & Buffet', 'Family-Style Meals', 'Themed Cuisine (Caribbean, Italian, Vegan, etc.)']
    },
    {
      id: 'staffing',
      icon: '👨‍🍳',
      title: 'Kitchen & Restaurant Staffing',
      description: 'Avoid schedule gaps, overworked staff, or poor customer service. Our vetted hospitality professionals integrate with your team to keep things running without a hitch — on short notice or with a contract.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2077&q=80',
      forBusinesses: 'For Restaurants, Cafés, Hotels, and Catering Companies',
      positionsAvailable: ['Prep Cooks', 'Line Cooks', 'Sous Chefs', 'Dishwashers', 'Baristas', 'FOH Staff (Hosts, Servers)'],
      idealFor: ['Emergency Coverage', 'Peak Season Reinforcements', 'Temporary Staff', 'Long-Term Contracts']
    },
    {
      id: 'events',
      icon: '🧍',
      title: 'Event Staffing',
      description: 'Each staff member is trained in customer service etiquette, presentation, and emergency response. Whether it\'s a 10-person dinner or a 500-guest banquet, we scale to your needs and ensure seamless execution.',
      video: 'https://videos.pexels.com/video-files/4253312/4253312-uhd_2560_1440_25fps.mp4',
      image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      eventTypesSupported: ['Weddings', 'Corporate Galas', 'Fundraisers', 'Brand Activations', 'Film Shoots'],
      rolesSupplied: ['Servers & Bussers', 'Hosts/Hostesses', 'Greeters', 'Coat Check Attendants', 'Runners & Floaters']
    }
  ];

  return (
    <div className={styles.servicesPage}>
      {/* Shared Header */}
      <SharedHeader currentPage="/sip-and-savour/services" />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroVideo}>
          <img
            src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            alt="Our Services"
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
            Our <span className={styles.highlight}>Services</span>
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Professional hospitality solutions tailored to your unique needs
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className={styles.serviceCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={styles.serviceMedia}>
                <video
                  className={styles.serviceVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={service.image}
                >
                  <source src={service.video} type="video/mp4" />
                </video>
                <div className={styles.serviceIcon}>
                  {service.icon}
                </div>
              </div>
              
              <div className={styles.serviceContent}>
                <h2 className={styles.serviceTitle}>{service.title}</h2>
                <p className={styles.serviceDescription}>{service.description}</p>
                
                <div className={styles.serviceDetails}>
                  {service.eventTypes && (
                    <div className={styles.detailSection}>
                      <h4>Types of Events:</h4>
                      <ul>
                        {service.eventTypes.map((type, i) => (
                          <li key={i}>{type}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.staffProvided && (
                    <div className={styles.detailSection}>
                      <h4>Staff Provided:</h4>
                      <ul>
                        {service.staffProvided.map((staff, i) => (
                          <li key={i}>{staff}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.features && (
                    <div className={styles.detailSection}>
                      <h4>Features:</h4>
                      <ul>
                        {service.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.servicesInclude && (
                    <div className={styles.detailSection}>
                      <h4>Services Include:</h4>
                      <ul>
                        {service.servicesInclude.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.cateringStyles && (
                    <div className={styles.detailSection}>
                      <h4>Catering Styles:</h4>
                      <ul>
                        {service.cateringStyles.map((style, i) => (
                          <li key={i}>{style}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.positionsAvailable && (
                    <div className={styles.detailSection}>
                      <h4>Positions Available:</h4>
                      <ul>
                        {service.positionsAvailable.map((position, i) => (
                          <li key={i}>{position}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.idealFor && (
                    <div className={styles.detailSection}>
                      <h4>Ideal For:</h4>
                      <ul>
                        {service.idealFor.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.eventTypesSupported && (
                    <div className={styles.detailSection}>
                      <h4>Event Types Supported:</h4>
                      <ul>
                        {service.eventTypesSupported.map((type, i) => (
                          <li key={i}>{type}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {service.rolesSupplied && (
                    <div className={styles.detailSection}>
                      <h4>Roles Supplied:</h4>
                      <ul>
                        {service.rolesSupplied.map((role, i) => (
                          <li key={i}>{role}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <motion.button
                  className={styles.serviceButton}
                  onClick={() => router.push('/sip-and-savour/pricing')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Quote →
                </motion.button>
              </div>
            </motion.div>
          ))}
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
              Let's discuss which services are right for your event and create a custom package that fits your needs.
            </p>
            <div className={styles.ctaButtons}>
              <motion.button 
                className={styles.primaryButton}
                onClick={() => router.push('/sip-and-savour/pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get a Custom Quote
              </motion.button>
              <motion.button 
                className={styles.secondaryButton}
                onClick={() => router.push('/sip-and-savour/events')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Events We Serve
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
