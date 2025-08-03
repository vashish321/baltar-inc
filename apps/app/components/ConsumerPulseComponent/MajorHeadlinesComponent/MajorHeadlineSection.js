'use client';

import { useState, useEffect } from 'react';
import styles from './MajorHeadlineSection.module.css';
import Image from 'next/image';

export default function MajorHeadlineSection() {
  const [headline, setHeadline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopHeadline();

    // Set up auto-refresh every 3 minutes for more frequent updates
    const interval = setInterval(fetchTopHeadline, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchTopHeadline = async () => {
    try {
      const response = await fetch('/api/consumer-pulse/articles?status=PUBLISHED&limit=1&_t=' + Date.now());
      const data = await response.json();

      if (data.success && data.articles.length > 0) {
        setHeadline(data.articles[0]);
      }
    } catch (error) {
      console.error('Error fetching headline:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.headlineSection}>
        <div className={styles.loadingState}>
          <div className={styles.loadingPlaceholder}>Loading top story...</div>
        </div>
      </section>
    );
  }

  const displayHeadline = headline || {
    title: "Consumer Pulse Market Research Platform",
    summary: "Real-time consumer insights, sentiment analysis, and market intelligence for businesses",
    imageUrl: "/Trump.jpg"
  };

  return (
    <section className={styles.headlineSection}>
      <div className={styles.imageWrapper}>
        <Image
          src={displayHeadline.imageUrl || "/Trump.jpg"}
          alt="Top News"
          width={200}
          height={90}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {displayHeadline.title}
        </h1>
        <p className={styles.subtitle}>
          {displayHeadline.summary || displayHeadline.content?.substring(0, 150) + '...'}
        </p>
        {headline && (
          <div className={styles.metadata}>
            <span className={styles.category}>{headline.category}</span>
            <span className={styles.sentiment} data-sentiment={headline.sentiment}>
              {headline.sentiment} Sentiment
            </span>
          </div>
        )}
      </div>
    </section>
  );
}