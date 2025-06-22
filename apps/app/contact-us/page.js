'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ContactUs.module.css';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show success message
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', description: '' });
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>Contact Baltar Inc.</h1>
          <p className={styles.subtitle}>
            Ready to transform your business? Get in touch with our team.
          </p>
        </motion.div>

        <motion.div className={styles.formContainer} variants={itemVariants}>
          {isSubmitted ? (
            <motion.div
              className={styles.successMessage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Thank you for your message!</h3>
              <p>We'll get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>Message *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows="5"
                  placeholder="Tell us about your project or how we can help..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                className={styles.submitButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
              </motion.button>
            </form>
          )}
        </motion.div>

        <motion.div className={styles.backLink} variants={itemVariants}>
          <Link href="/" className={styles.backButton}>
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
