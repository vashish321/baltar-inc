'use client';
import { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import styles from './subscriptionBoxes.module.css';

export default function SubscriptionBoxes() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(getApiEndpoint('/api/le-mode-co/packages'));
      const result = await response.json();

      if (result.success) {
        setPackages(result.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      // Fallback to static data if API fails
      setPackages([
        {
          name: 'Essentials Box',
          price: 79,
          features: ['3 curated outfits', 'Exclusive accessories', 'Free returns & exchanges', 'Personal stylist access'],
          bestFor: 'Minimalist wardrobe lovers',
          isPopular: false,
        },
        {
          name: 'Luxury Box',
          price: 149,
          features: ['6 premium outfits', 'Designer brands', 'Priority shipping', 'VIP styling support'],
          bestFor: 'Luxury lifestyle enthusiasts',
          isPopular: true,
        },
        {
          name: 'Bespoke Box',
          price: 299,
          features: ['Fully tailored wardrobe', 'Exclusive collaborations', 'Personal fashion consultant', 'Priority events access'],
          bestFor: 'Fashion-forward elites',
          isPopular: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.subscriptionSection} id="subscription">
        <h2 className={styles.heading}>Monthly Curated Fashion Boxes</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading packages...</p>
        </div>
      </section>
    );
  }
  return (
    <section className={styles.subscriptionSection} id="subscription">
      <h2 className={styles.heading}>Monthly Curated Fashion Boxes</h2>
      <div className={styles.grid}>
        {packages.map((pkg, idx) => (
          <div
            key={pkg.id || idx}
            className={`${styles.card} ${pkg.isPopular ? styles.popular : ''}`}
          >
            {pkg.isPopular && <div className={styles.badge}>Most Loved</div>}
            <h3 className={styles.title}>{pkg.name}</h3>
            <p className={styles.price}>
              {typeof pkg.price === 'number' ? `$${pkg.price}/month` : pkg.price}
            </p>
            <ul className={styles.features}>
              {pkg.features.map((feat, i) => (
                <li key={i}>✔ {feat}</li>
              ))}
            </ul>
            <div className={styles.tooltip}>Ideal For: {pkg.bestFor}</div>
            <a href="/le-mode-co-subscribe" className={styles.cta}>Subscribe Now</a>
          </div>
        ))}
      </div>
    </section>
  );
}
