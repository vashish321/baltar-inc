'use client';
import { useState } from 'react';
import styles from './FAQPage.module.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "Can I use my current domain?",
      answer: "Absolutely! We can work with your existing domain or help you transfer it to our hosting platform. If you don't have a domain yet, we'll help you find and register the perfect one for your business."
    },
    {
      question: "Do I need to supply my own content or images?",
      answer: "We can work with whatever content you have, or we can help create it. Our content writing service is available for $75/page, and we can source professional stock images or work with photos you provide."
    },
    {
      question: "How long does it take to build a website?",
      answer: "Most websites are completed within 2-4 weeks, depending on the complexity and how quickly you provide feedback and content. E-commerce sites may take 4-6 weeks due to additional setup requirements."
    },
    {
      question: "Can I make changes later?",
      answer: "Yes! You own your website completely. We provide training on how to make basic updates, and our maintenance plans include ongoing support for changes and updates."
    },
    {
      question: "What's the difference between hosting and a domain?",
      answer: "A domain is your website's address (like yourname.com), while hosting is the server space where your website files live. Think of the domain as your address and hosting as the actual house."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes! All our packages include initial support, and we offer monthly maintenance plans starting at $49/month for ongoing updates, security, and technical support."
    },
    {
      question: "Will my website work on mobile devices?",
      answer: "Absolutely! All our websites are built with mobile-first design, ensuring they look and work perfectly on smartphones, tablets, and desktop computers."
    },
    {
      question: "Do you handle SEO?",
      answer: "Yes, we include basic SEO setup in all packages, including meta tags, site structure, and Google Analytics. Our Professional and E-commerce packages include more comprehensive SEO optimization."
    },
    {
      question: "What if I'm not happy with the design?",
      answer: "We work closely with you throughout the design process and include revisions in our packages. We won't consider the project complete until you're satisfied with the result."
    },
    {
      question: "Can you help with e-commerce and online selling?",
      answer: "Definitely! Our E-commerce package includes everything you need to start selling online, including product catalogs, payment processing, inventory management, and order tracking."
    },
    {
      question: "Do you work with businesses outside of Canada?",
      answer: "While we're based in Canada, we work with clients internationally. However, our primary focus and expertise is with Canadian businesses and regulations."
    },
    {
      question: "What happens to my website if I stop using your services?",
      answer: "You own your website completely. If you choose to move to another provider, we'll help you transfer everything. There are no lock-in contracts or hidden fees."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className={styles.faqPage}>
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
              Frequently Asked <span className={styles.highlight}>Questions</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Got questions? We've got answers. Find everything you need to know about our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={styles.faqItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <motion.button
                  className={`${styles.faqQuestion} ${openFAQ === index ? styles.active : ''}`}
                  onClick={() => toggleFAQ(index)}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                >
                  <span className={styles.questionText}>
                    {faq.question}
                  </span>
                  <motion.span
                    className={styles.faqIcon}
                    animate={{ rotate: openFAQ === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    +
                  </motion.span>
                </motion.button>
                
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      className={styles.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.answerContent}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.ctaTitle}>Still Have Questions?</h2>
            <p className={styles.ctaDescription}>
              We're here to help! Get in touch and we'll answer any questions you have about our services.
            </p>
            <div className={styles.ctaButtons}>
              <motion.a
                href="/frontend-web-design-contact-us"
                className={styles.primaryButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.a>
              <motion.a
                href="/frontend-web-design/pricing"
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
