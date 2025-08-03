'use client';
import { useState, useEffect } from 'react';
import styles from './PollingSection.module.css';

export default function PollingSection() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedPolls, setVotedPolls] = useState(new Set());

  useEffect(() => {
    fetchPolls();
    // Load voted polls from localStorage
    const voted = JSON.parse(localStorage.getItem('votedPolls') || '[]');
    setVotedPolls(new Set(voted));
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/consumer-pulse/polls?status=ACTIVE');
      const data = await response.json();
      
      if (data.success) {
        setPolls(data.polls);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      const response = await fetch(`/api/consumer-pulse/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          optionIndex: optionIndex
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Mark poll as voted
        const newVotedPolls = new Set([...votedPolls, pollId]);
        setVotedPolls(newVotedPolls);
        localStorage.setItem('votedPolls', JSON.stringify([...newVotedPolls]));
        
        // Refresh polls to get updated vote counts
        fetchPolls();
      } else {
        alert(data.details || 'Error submitting vote. You may have already voted.');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote. Please try again.');
    }
  };

  const calculatePercentage = (votes, total) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const renderPoll = (poll) => {
    const hasVoted = votedPolls.has(poll.id);
    const totalVotes = poll.totalVotes || 0;

    return (
      <div key={poll.id} className={styles.pollCard}>
        <div className={styles.pollHeader}>
          <h3 className={styles.pollTitle}>{poll.title}</h3>
          <div className={styles.pollMeta}>
            <span className={styles.voteCount}>{totalVotes} votes</span>
            {poll.endDate && (
              <span className={styles.endDate}>
                Ends: {new Date(poll.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div className={styles.pollQuestion}>
          <p>{poll.question}</p>
        </div>

        <div className={styles.optionsContainer}>
          {poll.options.map((option, index) => {
            const votes = poll.voteCounts[index] || 0;
            const percentage = calculatePercentage(votes, totalVotes);
            
            return (
              <div key={index} className={styles.optionContainer}>
                {hasVoted ? (
                  <div className={styles.resultOption}>
                    <div className={styles.optionText}>
                      <span>{option}</span>
                      <span className={styles.percentage}>{percentage}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className={styles.voteCount}>{votes} votes</div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVote(poll.id, index)}
                    className={styles.voteOption}
                  >
                    {option}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {hasVoted && (
          <div className={styles.thankYou}>
            <p>Thank you for voting! Results are updated in real-time.</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section className={styles.pollingSection}>
        <div className={styles.container}>
          <div className={styles.loadingSpinner}>Loading live polls...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.pollingSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Live Consumer Polling</h1>
          <p className={styles.subtitle}>
            Participate in real-time polls and see instant results from consumers worldwide
          </p>
        </div>

        {polls.length === 0 ? (
          <div className={styles.noPolls}>
            <h2>No Active Polls</h2>
            <p>Check back later for new consumer polls and market research questions.</p>
          </div>
        ) : (
          <div className={styles.pollsGrid}>
            {polls.map(poll => renderPoll(poll))}
          </div>
        )}

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Your Voice Matters</h3>
            <p>
              Your participation helps businesses understand consumer preferences and market trends. 
              All responses are anonymous and contribute to valuable market research insights.
            </p>
          </div>
          
          <div className={styles.infoCard}>
            <h3>Real-Time Results</h3>
            <p>
              See how your opinions compare with other consumers instantly. 
              Our live polling system updates results in real-time as votes are submitted.
            </p>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2>Want More Detailed Insights?</h2>
          <p>
            Businesses can access comprehensive analytics, demographic breakdowns, 
            and detailed consumer sentiment analysis through our API platform.
          </p>
          <button className={styles.ctaButton}>
            Learn About Business Analytics
          </button>
        </div>
      </div>
    </section>
  );
}
