'use client';
import { useState, useEffect } from 'react';
import styles from './AnalyticsDashboard.module.css';

export default function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState({
    surveys: [],
    polls: [],
    articles: [],
    totalResponses: 0,
    totalVotes: 0,
    sentimentOverview: {}
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch surveys, polls, and articles data
      const [surveysRes, pollsRes, articlesRes] = await Promise.all([
        fetch('/api/consumer-pulse/surveys'),
        fetch('/api/consumer-pulse/polls'),
        fetch('/api/consumer-pulse/articles?status=PUBLISHED')
      ]);

      const [surveysData, pollsData, articlesData] = await Promise.all([
        surveysRes.json(),
        pollsRes.json(),
        articlesRes.json()
      ]);

      // Calculate analytics
      const totalResponses = surveysData.surveys?.reduce((sum, survey) => 
        sum + (survey.responseCount || 0), 0) || 0;
      
      const totalVotes = pollsData.polls?.reduce((sum, poll) => 
        sum + (poll.totalVotes || 0), 0) || 0;

      // Calculate sentiment overview
      const sentimentCounts = articlesData.articles?.reduce((acc, article) => {
        const sentiment = article.sentiment || 'NEUTRAL';
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      }, {}) || {};

      setDashboardData({
        surveys: surveysData.surveys || [],
        polls: pollsData.polls || [],
        articles: articlesData.articles || [],
        totalResponses,
        totalVotes,
        sentimentOverview: sentimentCounts
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMetricCard = (title, value, subtitle, icon) => (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricContent}>
        <h3 className={styles.metricValue}>{value}</h3>
        <p className={styles.metricTitle}>{title}</p>
        {subtitle && <span className={styles.metricSubtitle}>{subtitle}</span>}
      </div>
    </div>
  );

  const renderSentimentChart = () => {
    const total = Object.values(dashboardData.sentimentOverview).reduce((sum, count) => sum + count, 0);
    
    return (
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Market Sentiment Overview</h3>
        <div className={styles.sentimentChart}>
          {Object.entries(dashboardData.sentimentOverview).map(([sentiment, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const color = sentiment === 'POSITIVE' ? '#4CAF50' : 
                         sentiment === 'NEGATIVE' ? '#f44336' : '#FFC107';
            
            return (
              <div key={sentiment} className={styles.sentimentItem}>
                <div className={styles.sentimentLabel}>
                  <div 
                    className={styles.sentimentColor}
                    style={{ backgroundColor: color }}
                  />
                  <span>{sentiment}</span>
                </div>
                <div className={styles.sentimentStats}>
                  <span className={styles.sentimentCount}>{count}</span>
                  <span className={styles.sentimentPercentage}>{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTopSurveys = () => (
    <div className={styles.listCard}>
      <h3 className={styles.listTitle}>Top Performing Surveys</h3>
      <div className={styles.listContent}>
        {dashboardData.surveys.slice(0, 5).map(survey => (
          <div key={survey.id} className={styles.listItem}>
            <div className={styles.listItemContent}>
              <h4 className={styles.listItemTitle}>{survey.title}</h4>
              <p className={styles.listItemMeta}>
                {survey.responseCount || 0} responses • {survey.status}
              </p>
            </div>
            <div className={styles.listItemValue}>
              {survey.latestAnalytics?.completionRate || 0}% completion
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTopPolls = () => (
    <div className={styles.listCard}>
      <h3 className={styles.listTitle}>Most Voted Polls</h3>
      <div className={styles.listContent}>
        {dashboardData.polls.slice(0, 5).map(poll => (
          <div key={poll.id} className={styles.listItem}>
            <div className={styles.listItemContent}>
              <h4 className={styles.listItemTitle}>{poll.title}</h4>
              <p className={styles.listItemMeta}>
                {poll.totalVotes || 0} votes • {poll.status}
              </p>
            </div>
            <div className={styles.listItemValue}>
              {poll.totalVotes || 0} votes
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className={styles.analyticsSection}>
        <div className={styles.container}>
          <div className={styles.loadingSpinner}>Loading analytics dashboard...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.analyticsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Consumer Pulse Analytics</h1>
            <p className={styles.subtitle}>
              Real-time insights into consumer behavior and market trends
            </p>
          </div>
          
          <div className={styles.timeframeSelector}>
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className={styles.timeframeSelect}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          {renderMetricCard(
            'Total Survey Responses',
            dashboardData.totalResponses.toLocaleString(),
            'Across all active surveys',
            '📊'
          )}
          {renderMetricCard(
            'Total Poll Votes',
            dashboardData.totalVotes.toLocaleString(),
            'Real-time polling data',
            '🗳️'
          )}
          {renderMetricCard(
            'Active Surveys',
            dashboardData.surveys.filter(s => s.status === 'ACTIVE').length,
            'Currently collecting responses',
            '📋'
          )}
          {renderMetricCard(
            'Published Articles',
            dashboardData.articles.length,
            'Market research content',
            '📰'
          )}
        </div>

        <div className={styles.chartsGrid}>
          {renderSentimentChart()}
          
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Engagement Trends</h3>
            <div className={styles.trendChart}>
              <div className={styles.trendItem}>
                <span className={styles.trendLabel}>Survey Completion Rate</span>
                <div className={styles.trendBar}>
                  <div 
                    className={styles.trendFill}
                    style={{ width: '78%', backgroundColor: '#4CAF50' }}
                  />
                </div>
                <span className={styles.trendValue}>78%</span>
              </div>
              
              <div className={styles.trendItem}>
                <span className={styles.trendLabel}>Poll Participation</span>
                <div className={styles.trendBar}>
                  <div 
                    className={styles.trendFill}
                    style={{ width: '65%', backgroundColor: '#2196F3' }}
                  />
                </div>
                <span className={styles.trendValue}>65%</span>
              </div>
              
              <div className={styles.trendItem}>
                <span className={styles.trendLabel}>Article Engagement</span>
                <div className={styles.trendBar}>
                  <div 
                    className={styles.trendFill}
                    style={{ width: '42%', backgroundColor: '#FF9800' }}
                  />
                </div>
                <span className={styles.trendValue}>42%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.listsGrid}>
          {renderTopSurveys()}
          {renderTopPolls()}
        </div>

        <div className={styles.apiSection}>
          <div className={styles.apiCard}>
            <h2 className={styles.apiTitle}>Access Our Analytics API</h2>
            <p className={styles.apiDescription}>
              Get programmatic access to consumer insights, survey data, and market trends 
              through our comprehensive API platform.
            </p>
            <div className={styles.apiFeatures}>
              <div className={styles.apiFeature}>
                <span className={styles.apiFeatureIcon}>🔑</span>
                <span>Secure API Key Authentication</span>
              </div>
              <div className={styles.apiFeature}>
                <span className={styles.apiFeatureIcon}>📈</span>
                <span>Real-time Data Access</span>
              </div>
              <div className={styles.apiFeature}>
                <span className={styles.apiFeatureIcon}>🎯</span>
                <span>Targeted Demographics</span>
              </div>
              <div className={styles.apiFeature}>
                <span className={styles.apiFeatureIcon}>📊</span>
                <span>Custom Analytics Reports</span>
              </div>
            </div>
            <button className={styles.apiButton}>
              Get API Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
