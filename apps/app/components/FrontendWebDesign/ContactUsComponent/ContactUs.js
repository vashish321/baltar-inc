'use client';

import styles from './ContactUs.module.css';
import { useState } from 'react';

export default function ContactUsComponent() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    websiteType: '',
    budget: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const showSuccessModal = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 5000); // Auto close after 5 seconds
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quoteData = {
        serviceType: 'FRONTEND_WEB_DESIGN',
        name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company,
        websiteType: form.websiteType,
        budget: form.budget,
        message: form.message
      };

      const response = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData)
      });

      const result = await response.json();

      if (result.success) {
        showSuccessModal();
        // Reset form
        setForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          websiteType: '',
          budget: '',
          message: '',
        });
      } else {
        throw new Error(result.error || 'Failed to submit quote request');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Sorry, there was an error submitting your inquiry. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Let’s Work Together</h1>
        <p className={styles.subtitle}>
          Got an idea, project or partnership in mind? Reach out and let’s make it real.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className={styles.input}
              value={form.name}
              onChange={handleChange}
              required
            />
            <span className={styles.focusBorder}></span>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
            <span className={styles.focusBorder}></span>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className={styles.input}
              value={form.phone}
              onChange={handleChange}
            />
            <span className={styles.focusBorder}></span>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="company"
              placeholder="Company Name (Optional)"
              className={styles.input}
              value={form.company}
              onChange={handleChange}
            />
            <span className={styles.focusBorder}></span>
          </div>

          <div className={styles.inputGroup}>
            <select
              name="websiteType"
              className={styles.input}
              value={form.websiteType}
              onChange={handleChange}
              required
            >
              <option value="">Select Website Type</option>
              <option value="business">Business Website</option>
              <option value="ecommerce">E-commerce Store</option>
              <option value="portfolio">Portfolio/Personal</option>
              <option value="blog">Blog/Content Site</option>
              <option value="nonprofit">Non-profit</option>
              <option value="other">Other</option>
            </select>
            <span className={styles.focusBorder}></span>
          </div>

          <div className={styles.inputGroup}>
            <select
              name="budget"
              className={styles.input}
              value={form.budget}
              onChange={handleChange}
            >
              <option value="">Select Budget Range</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-2500">$1,000 - $2,500</option>
              <option value="2500-5000">$2,500 - $5,000</option>
              <option value="5000+">$5,000+</option>
              <option value="discuss">Let's Discuss</option>
            </select>
            <span className={styles.focusBorder}></span>
          </div>

          <div className={styles.inputGroup}>
            <textarea
              name="message"
              rows="5"
              placeholder="Tell us about your project..."
              className={`${styles.input} ${styles.textarea}`}
              value={form.message}
              onChange={handleChange}
              required
            />
            <span className={styles.focusBorder}></span>
          </div>

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.successModal}>
            <div className={styles.modalIcon}>🚀</div>
            <h3>Project Inquiry Submitted Successfully!</h3>
            <p>Thank you for your interest in our web development services. We'll review your requirements and get back to you within 24 hours.</p>
            <div className={styles.modalActions}>
              <a href="/client-dashboard" className={styles.dashboardLink}>
                Track Your Project
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
    </section>
  );
}
