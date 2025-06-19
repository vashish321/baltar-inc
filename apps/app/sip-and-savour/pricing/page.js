'use client';
import styles from './PricingPage.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SharedHeader from '../../components/SavourAndSip/SharedHeaderComponent/SharedHeader';

export default function PricingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    eventType: '',
    guestCount: '',
    date: '',
    services: [],
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [showModal, setShowModal] = useState(false);

  const showSuccessModal = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 5000); // Auto close after 5 seconds
  };

  const serviceOptions = [
    { id: 'bartending', name: 'Bartending Services', icon: '🥂' },
    { id: 'catering', name: 'Catering Services', icon: '🍽️' },
    { id: 'staffing', name: 'Event Staffing', icon: '🧍‍♂️' },
    { id: 'kitchen', name: 'Kitchen Staffing', icon: '👨‍🍳' }
  ];

  const pricingFactors = [
    {
      icon: '👥',
      title: 'Guest Count',
      description: 'Pricing scales with the number of guests to ensure proper staff-to-guest ratios'
    },
    {
      icon: '🕒',
      title: 'Event Duration',
      description: 'Hourly rates apply with minimum service periods for different event types'
    },
    {
      icon: '📅',
      title: 'Date & Season',
      description: 'Peak seasons and holidays may have premium pricing due to high demand'
    },
    {
      icon: '🍽️',
      title: 'Service Level',
      description: 'From casual service to white-glove hospitality, we match your event style'
    },
    {
      icon: '📍',
      title: 'Location',
      description: 'Travel time and distance from our base in the GTA affects pricing'
    },
    {
      icon: '🎯',
      title: 'Customization',
      description: 'Specialized requests, custom menus, and unique setups are priced accordingly'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // COMMENTED OUT FOR UI/UX DEMO - Backend calls disabled
      /*
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const bookingData = {
        // Client info
        email: formData.email,
        firstName: firstName,
        lastName: lastName,
        phone: formData.phone,

        // Service info
        serviceType: 'SAVOUR_AND_SIP',
        eventDate: formData.date,
        eventLocation: 'TBD', // Will be discussed during consultation
        guestCount: parseInt(formData.guestCount),
        services: formData.services,
        specialRequests: formData.message,

        // Project info
        projectTitle: `${formData.eventType} Event - ${firstName} ${lastName}`,
        projectDescription: formData.message
      };

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (result.success) {
        // Show success modal instead of alert
        showSuccessModal();
        // Reset form
        setFormData({
          eventType: '',
          guestCount: '',
          date: '',
          services: [],
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Failed to submit quote request');
      }
      */

      // Mock form submission for UI demo
      showSuccessModal();
      // Reset form
      setFormData({
        eventType: '',
        guestCount: '',
        date: '',
        services: [],
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error submitting your request. Please try again or contact us directly.');
    }
  };

  return (
    <div className={styles.pricingPage}>
      {/* Shared Header */}
      <SharedHeader currentPage="/sip-and-savour/pricing" />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroVideo}>
          <video autoPlay loop muted playsInline>
            <source src="https://videos.pexels.com/video-files/5490778/5490778-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Custom <span className={styles.highlight}>Pricing</span>
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Every event is unique. Get a personalized quote tailored to your specific needs.
          </motion.p>
        </div>
      </section>

      {/* Pricing Factors */}
      <section className={styles.factorsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.factorsHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.factorsTitle}>What Affects Pricing?</h2>
            <p className={styles.factorsSubtitle}>
              We consider several factors to provide you with the most accurate quote
            </p>
          </motion.div>

          <div className={styles.factorsGrid}>
            {pricingFactors.map((factor, index) => (
              <motion.div
                key={index}
                className={styles.factorCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className={styles.factorIcon}>
                  {factor.icon}
                </div>
                <h3 className={styles.factorTitle}>
                  {factor.title}
                </h3>
                <p className={styles.factorDescription}>
                  {factor.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <div className={styles.quoteGrid}>
            <motion.div
              className={styles.quoteInfo}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.quoteTitle}>Get Your Custom Quote</h2>
              <p className={styles.quoteDescription}>
                Fill out the form and we'll get back to you within 24 hours with a detailed proposal 
                tailored to your event needs.
              </p>
              
              <div className={styles.quoteFeatures}>
                <div className={styles.quoteFeature}>
                  <span className={styles.featureIcon}>⚡</span>
                  <span>24-hour response time</span>
                </div>
                <div className={styles.quoteFeature}>
                  <span className={styles.featureIcon}>💰</span>
                  <span>No hidden fees</span>
                </div>
                <div className={styles.quoteFeature}>
                  <span className={styles.featureIcon}>🎯</span>
                  <span>Customized to your needs</span>
                </div>
                <div className={styles.quoteFeature}>
                  <span className={styles.featureIcon}>📞</span>
                  <span>Free consultation included</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className={styles.quoteForm}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Event Type</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="private">Private Party</option>
                    <option value="restaurant">Restaurant Staffing</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Guest Count</label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Number of guests"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Event Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Services Needed</label>
                  <div className={styles.serviceOptions}>
                    {serviceOptions.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        className={`${styles.serviceOption} ${
                          formData.services.includes(service.id) ? styles.selected : ''
                        }`}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <span className={styles.serviceIcon}>{service.icon}</span>
                        {service.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="(416) 555-1234"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Additional Details</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Tell us more about your event, special requirements, or any questions you have..."
                    rows="4"
                  />
                </div>

                <motion.button
                  type="submit"
                  className={styles.submitButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get My Custom Quote
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.successModal}>
            <div className={styles.modalIcon}>✅</div>
            <h3>Quote Request Submitted Successfully!</h3>
            <p>Thank you for your interest in our catering services. We'll get back to you within 24 hours with a custom quote.</p>
            <div className={styles.modalActions}>
              <a href="/client-dashboard" className={styles.dashboardLink}>
                Track Your Request
              </a>
              <button
                className={styles.modalCloseButton}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
