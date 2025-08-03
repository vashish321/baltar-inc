'use client';
import { useState, useEffect } from 'react';
import styles from './ConsumerPulseTab.module.css';

export default function ConsumerPulseTab() {
  const [articles, setArticles] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsDataFetching, setNewsDataFetching] = useState(false);
  const [schedulerStatus, setSchedulerStatus] = useState({
    isRunning: false,
    dailyCallCount: 0,
    remainingCalls: 24
  });

  useEffect(() => {
    fetchConsumerPulseData();
    fetchSchedulerStatus();
  }, []);

  const fetchConsumerPulseData = async () => {
    try {
      setLoading(true);
      
      const [articlesRes, surveysRes, pollsRes] = await Promise.all([
        fetch('/api/consumer-pulse/articles?limit=20'),
        fetch('/api/consumer-pulse/surveys'),
        fetch('/api/consumer-pulse/polls')
      ]);

      const [articlesData, surveysData, pollsData] = await Promise.all([
        articlesRes.json(),
        surveysRes.json(),
        pollsRes.json()
      ]);

      if (articlesData.success) setArticles(articlesData.articles);
      if (surveysData.success) setSurveys(surveysData.surveys);
      if (pollsData.success) setPolls(pollsData.polls);
      
    } catch (error) {
      console.error('Error fetching Consumer Pulse data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedulerStatus = async () => {
    try {
      const response = await fetch('/api/consumer-pulse/newsdata-status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSchedulerStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching scheduler status:', error);
    }
  };

  const handlePublishArticle = async (articleId) => {
    try {
      const response = await fetch(`/api/consumer-pulse/articles/${articleId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'PUBLISHED' })
      });

      const data = await response.json();

      if (data.success) {
        fetchConsumerPulseData(); // Refresh data
      } else {
        alert('Error publishing article: ' + data.details);
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Error publishing article');
    }
  };

  // NewsData.io Integration Functions
  const handleNewsDataFetch = async () => {
    try {
      setNewsDataFetching(true);
      const response = await fetch('/api/consumer-pulse/fetch-newsdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          country: 'us',
          language: 'en',
          category: 'top',
          size: 15
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Manual NewsData.io fetch completed! Fetched: ${data.fetched}, Processed: ${data.processed}, Saved: ${data.saved}`);
        fetchConsumerPulseData(); // Refresh data
        fetchSchedulerStatus(); // Update scheduler status
      } else {
        alert('Error during NewsData.io fetch: ' + data.details);
      }
    } catch (error) {
      console.error('Error triggering NewsData.io fetch:', error);
      alert('Error triggering NewsData.io fetch');
    } finally {
      setNewsDataFetching(false);
    }
  };

  const handleStartScheduler = async () => {
    try {
      const response = await fetch('/api/consumer-pulse/start-auto-newsdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('NewsData.io scheduler started! 24 hits per day (every hour)');
        fetchSchedulerStatus(); // Update status
      } else {
        alert('Error starting scheduler: ' + data.details);
      }
    } catch (error) {
      console.error('Error starting scheduler:', error);
      alert('Error starting scheduler');
    }
  };

  const handleStopScheduler = async () => {
    try {
      const response = await fetch('/api/consumer-pulse/stop-auto-newsdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('NewsData.io scheduler stopped');
        fetchSchedulerStatus(); // Update status
      } else {
        alert('Error stopping scheduler: ' + data.details);
      }
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      alert('Error stopping scheduler');
    }
  };

  const handleTestNewsDataAPI = async () => {
    try {
      const response = await fetch('/api/consumer-pulse/test-newsdata', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert(`NewsData.io API test successful!`);
      } else {
        alert('NewsData.io API test failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error testing NewsData.io API:', error);
      alert('Error testing NewsData.io API');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading Consumer Pulse data...</p>
      </div>
    );
  }

  return (
    <div className={styles.consumerPulseTab}>
      <div className={styles.header}>
        <h2>Consumer Pulse Management</h2>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <h4>NewsData.io Real-Time News</h4>
            <div className={styles.schedulerStatus}>
              <p>Status: <span className={schedulerStatus.isRunning ? styles.running : styles.stopped}>
                {schedulerStatus.isRunning ? 'Running' : 'Stopped'}
              </span></p>
              <p>Daily API Calls: {schedulerStatus.dailyCallCount}/24</p>
              <p>Remaining: {schedulerStatus.remainingCalls}</p>
            </div>
            <button
              onClick={handleTestNewsDataAPI}
              className={styles.testButton}
            >
              Test API Connection
            </button>
            <button
              onClick={handleNewsDataFetch}
              disabled={newsDataFetching}
              className={styles.newsDataButton}
            >
              {newsDataFetching ? 'Fetching...' : 'Manual Fetch'}
            </button>
            {!schedulerStatus.isRunning ? (
              <button
                onClick={handleStartScheduler}
                className={styles.startButton}
              >
                Start Auto Scheduler (24/day)
              </button>
            ) : (
              <button
                onClick={handleStopScheduler}
                className={styles.stopButton}
              >
                Stop Auto Scheduler
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Articles</h3>
          <div className={styles.statNumber}>{articles.length}</div>
          <div className={styles.statLabel}>Total Generated</div>
        </div>
        <div className={styles.statCard}>
          <h3>Surveys</h3>
          <div className={styles.statNumber}>{surveys.length}</div>
          <div className={styles.statLabel}>Active Surveys</div>
        </div>
        <div className={styles.statCard}>
          <h3>Polls</h3>
          <div className={styles.statNumber}>{polls.length}</div>
          <div className={styles.statLabel}>Live Polls</div>
        </div>
        <div className={styles.statCard}>
          <h3>Published</h3>
          <div className={styles.statNumber}>
            {articles.filter(a => a.status === 'PUBLISHED').length}
          </div>
          <div className={styles.statLabel}>Published Articles</div>
        </div>
      </div>

      <div className={styles.articlesSection}>
        <h3>Recent Articles</h3>
        <div className={styles.articlesList}>
          {articles.slice(0, 10).map(article => (
            <div key={article.id} className={styles.articleCard}>
              <div className={styles.articleInfo}>
                <h4 className={styles.articleTitle}>{article.title}</h4>
                <p className={styles.articleSummary}>
                  {article.summary || article.content?.substring(0, 100) + '...'}
                </p>
                <div className={styles.articleMeta}>
                  <span className={`${styles.status} ${styles[article.status?.toLowerCase()]}`}>
                    {article.status}
                  </span>
                  {article.sentiment && (
                    <span className={`${styles.sentiment} ${styles[article.sentiment?.toLowerCase()]}`}>
                      {article.sentiment}
                    </span>
                  )}
                  <span className={styles.date}>
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className={styles.articleActions}>
                {article.status === 'DRAFT' && (
                  <button
                    onClick={() => handlePublishArticle(article.id)}
                    className={styles.publishButton}
                  >
                    Publish
                  </button>
                )}
                <button className={styles.viewButton}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
