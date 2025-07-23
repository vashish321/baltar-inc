'use client';
import { useState, useEffect } from 'react';
import styles from './NewsSection.module.css';

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchArticles();

    // Set up auto-refresh every 3 minutes for more frequent updates
    const interval = setInterval(() => {
      fetchArticles(true); // Silent refresh
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchArticles = async (silent = false) => {
    try {
      if (!silent) {
        setRefreshing(true);
      }

      const response = await fetch('/api/consumer-pulse/articles?status=PUBLISHED&limit=50&_t=' + Date.now());
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fallback data if no articles found
  const fallbackData = [
    {
      id: 1,
      title: "Mark Mobius Says His Funds Hold 95% in Cash on Trade War Risks",
      description:
        "Veteran investor Mark Mobius warns of market volatility as geopolitical tensions rise.",
      image: "/TradeWar.jpg", // Replace with actual image paths
    },
    {
      id: 2,
      title: "China Manufacturing Slumps on US Levies, Spurring Stimulus Calls",
      description:
        "China’s industrial output slowed sharply, prompting calls for central policy support.",
      image: "/USAChina.jpg",
    },
    {
        id: 3,
        title: "Mark Mobius Says His Funds Hold 95% in Cash on Trade War Risks",
        description:
          "Veteran investor Mark Mobius warns of market volatility as geopolitical tensions rise.",
        image: "/TradeWar.jpg", // Replace with actual image paths
      },
      {
        id: 4,
        title: "China Manufacturing Slumps on US Levies, Spurring Stimulus Calls",
        description:
          "China’s industrial output slowed sharply, prompting calls for central policy support.",
        image: "/USAChina.jpg",
      },
  ];

  const displayData = articles.length > 0 ? articles : fallbackData;

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <section className={styles.newsSection}>
        <h2 className={styles.sectionTitle}>Top Stories</h2>
        <div className={styles.loadingGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={styles.loadingCard}>
              <div className={styles.loadingImage}></div>
              <div className={styles.loadingContent}>
                <div className={styles.loadingText}></div>
                <div className={styles.loadingDesc}></div>
                <div className={styles.loadingDesc}></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.newsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.titleSection}>
          <h2 className={styles.sectionTitle}>Top Stories</h2>
          {lastUpdated && (
            <span className={styles.lastUpdated}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <button
          onClick={() => fetchArticles(false)}
          className={styles.refreshButton}
          disabled={loading || refreshing}
        >
          {loading || refreshing ? '🔄' : '↻'} {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className={styles.newsGrid}>
        {displayData.map((item, index) => {
          const cardId = item.id || index;

          return (
            <div
              key={cardId}
              className={styles.newsCard}
              onClick={() => handleArticleClick(item)}
            >
              <div className={styles.imageContainer}>
                <img
                  src={item.imageUrl || item.image || "/consumer-pulse-banner.svg"}
                  alt={item.title}
                  className={styles.image}
                />
              </div>

              <div className={styles.contentContainer}>
                <h3 className={styles.title}>{item.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article Detail Modal */}
      {showModal && selectedArticle && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>

            <div className={styles.modalImage}>
              <img
                src={selectedArticle.imageUrl || selectedArticle.image || "/consumer-pulse-banner.svg"}
                alt={selectedArticle.title}
                className={styles.modalImg}
              />
            </div>

            <div className={styles.modalBody}>
              <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>

              {selectedArticle.summary && (
                <p className={styles.modalDescription}>
                  {selectedArticle.summary}
                </p>
              )}

              <div className={styles.modalMeta}>
                {selectedArticle.author && (
                  <span className={styles.modalAuthor}>By {selectedArticle.author}</span>
                )}
                {selectedArticle.category && (
                  <span className={styles.modalCategory}>{selectedArticle.category}</span>
                )}
                {selectedArticle.sentiment && (
                  <span className={styles.modalSentiment} data-sentiment={selectedArticle.sentiment}>
                    {selectedArticle.sentiment}
                  </span>
                )}
              </div>

              {selectedArticle.sourceUrl && (
                <a
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.readMoreLink}
                >
                  Read Full Article →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
