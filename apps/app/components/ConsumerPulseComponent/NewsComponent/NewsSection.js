'use client';
import { useState, useEffect, useCallback } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import styles from './NewsSection.module.css';

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [liveUpdateCount, setLiveUpdateCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Initialize WebSocket connection
  const { isConnected, lastUpdate, connectionError, requestStatus } = useWebSocket();

  // Handle WebSocket updates
  useEffect(() => {
    if (lastUpdate) {
      handleWebSocketUpdate(lastUpdate);
    }
  }, [lastUpdate]);

  // Handle connection status
  useEffect(() => {
    setConnectionStatus(isConnected ? 'connected' : connectionError ? 'error' : 'connecting');
  }, [isConnected, connectionError]);

  // Simplified fetch function - just get all published articles
  const fetchArticles = useCallback(async () => {
    try {
      setRefreshing(true);

      const requestUrl = '/api/consumer-pulse/articles?status=PUBLISHED&limit=50';

      console.log('🔍 Fetching all articles from:', requestUrl);

      const response = await fetch(requestUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('📊 API Response:', {
        success: data.success,
        articleCount: data.articles?.length || 0,
        total: data.total
      });

      if (data.success && Array.isArray(data.articles)) {
        if (data.articles.length > 0) {
          setArticles(data.articles);
          setLastUpdated(new Date());
          console.log('✅ Articles updated successfully');
        } else {
          console.warn('⚠️ No articles found');
          setArticles([]);
        }
      } else {
        console.error('❌ API returned invalid response:', data);
        setArticles([]);
      }
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // No dependencies needed since we're fetching all articles

  // Handle WebSocket updates
  const handleWebSocketUpdate = useCallback((update) => {
    switch (update.type) {
      case 'new-article':
        setArticles(prev => [update.data, ...prev.slice(0, 49)]); // Keep latest 50
        setLiveUpdateCount(prev => prev + 1);
        setLastUpdated(new Date());
        break;

      case 'live-update':
        // Accept all articles since we're showing global news
        setArticles(prev => {
          const newArticles = update.data.articles.filter(newArticle =>
            !prev.some(existing => existing.id === newArticle.id)
          );
          return [...newArticles, ...prev].slice(0, 50);
        });
        setLiveUpdateCount(prev => prev + update.data.articles.length);
        setLastUpdated(new Date());
        break;

      case 'bulk-update':
        fetchArticles(); // Refresh all articles
        setLiveUpdateCount(prev => prev + update.data.count);
        break;

      case 'breaking-news':
        setArticles(prev => [{ ...update.data, isBreaking: true }, ...prev.slice(0, 49)]);
        setLiveUpdateCount(prev => prev + 1);
        setLastUpdated(new Date());
        break;

      default:
        break;
    }
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles();

    // Request initial status from WebSocket
    if (isConnected) {
      requestStatus();
    }

    // Set up auto-refresh every 5 minutes as backup
    const interval = setInterval(() => {
      if (!isConnected) {
        fetchArticles(); // Only refresh if WebSocket is not connected
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isConnected, requestStatus, fetchArticles]);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showModal]);

  return (
    <div className={styles.newsSection}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>
            <span className={styles.liveIndicator}>●</span>
            Global News
          </h2>
          <div className={styles.connectionStatus}>
            <span className={`${styles.statusDot} ${styles[connectionStatus]}`}></span>
            {connectionStatus === 'connected' ? 'Live' : 
             connectionStatus === 'error' ? 'Offline' : 'Connecting...'}
          </div>
        </div>

        <div className={styles.controls}>
          {liveUpdateCount > 0 && (
            <span className={styles.updateBadge}>
              {liveUpdateCount} new
            </span>
          )}
          <button 
            onClick={() => fetchArticles()} 
            className={styles.refreshButton}
            disabled={refreshing}
          >
            {refreshing ? '↻' : '⟳'} Refresh
          </button>
        </div>
      </div>

      {lastUpdated && (
        <div className={styles.lastUpdated}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div className={styles.loading}>Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className={styles.noArticles}>
          <p>No articles found.</p>
          <p>Try refreshing the page or check back later.</p>
        </div>
      ) : (
        <div className={styles.articlesGrid}>
          {articles.map((item, index) => (
            <div 
              key={item.id || index} 
              className={`${styles.articleCard} ${item.isBreaking ? styles.breaking : ''}`}
              onClick={() => handleArticleClick(item)}
            >
              <div className={styles.imageContainer}>
                <img
                  src={item.imageUrl?.trim() || item.image || "/consumer-pulse-banner.svg"}
                  alt={item.title}
                  className={styles.articleImage}
                  onError={(e) => {
                    e.target.src = "/consumer-pulse-banner.svg";
                  }}
                />
                {item.isBreaking && (
                  <div className={styles.breakingBadge}>BREAKING</div>
                )}
              </div>
              <div className={styles.articleContent}>
                <h3 className={styles.articleTitle}>{item.title}</h3>
                <p className={styles.articleDescription}>
                  {item.summary || item.description || item.content?.substring(0, 150) + '...'}
                </p>
                <div className={styles.articleMeta}>
                  <span className={styles.category}>{item.category || 'General'}</span>
                  <span className={styles.publishedAt}>
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for article details */}
      {showModal && selectedArticle && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <img
              src={selectedArticle.imageUrl?.trim() || selectedArticle.image || "/consumer-pulse-banner.svg"}
              alt={selectedArticle.title}
              className={styles.modalImage}
              onError={(e) => {
                e.target.src = "/consumer-pulse-banner.svg";
              }}
            />
            <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>
            <div className={styles.modalMeta}>
              <span className={styles.modalCategory}>{selectedArticle.category || 'General'}</span>
              <span className={styles.modalDate}>
                {selectedArticle.publishedAt ? new Date(selectedArticle.publishedAt).toLocaleDateString() : 'Recent'}
              </span>
            </div>
            <p className={styles.modalDescription}>
              {selectedArticle.summary || selectedArticle.description || selectedArticle.content}
            </p>
            {selectedArticle.sourceUrl && (
              <a 
                href={selectedArticle.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                Read Full Article →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
