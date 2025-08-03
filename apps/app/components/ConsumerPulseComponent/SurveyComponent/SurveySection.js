'use client';
import { useState, useEffect } from 'react';
import styles from './SurveySection.module.css';

export default function SurveySection() {
  const [surveys, setSurveys] = useState([]);
  const [activeSurvey, setActiveSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/consumer-pulse/surveys?status=ACTIVE');
      const data = await response.json();
      
      if (data.success) {
        setSurveys(data.surveys);
        if (data.surveys.length > 0) {
          setActiveSurvey(data.surveys[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitSurvey = async () => {
    if (!activeSurvey) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/consumer-pulse/surveys/${activeSurvey.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: responses
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        setResponses({});
      } else {
        alert('Error submitting survey. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    const questionId = `q_${index}`;
    
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div key={questionId} className={styles.questionContainer}>
            <h3 className={styles.questionTitle}>{question.question}</h3>
            <div className={styles.optionsContainer}>
              {question.options.map((option, optionIndex) => (
                <label key={optionIndex} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name={questionId}
                    value={option}
                    onChange={(e) => handleResponseChange(questionId, e.target.value)}
                    className={styles.radioInput}
                  />
                  <span className={styles.optionText}>{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={questionId} className={styles.questionContainer}>
            <h3 className={styles.questionTitle}>{question.question}</h3>
            <textarea
              placeholder="Your answer..."
              value={responses[questionId] || ''}
              onChange={(e) => handleResponseChange(questionId, e.target.value)}
              className={styles.textArea}
              rows={4}
            />
          </div>
        );

      case 'rating':
        return (
          <div key={questionId} className={styles.questionContainer}>
            <h3 className={styles.questionTitle}>{question.question}</h3>
            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(rating => (
                <label key={rating} className={styles.ratingLabel}>
                  <input
                    type="radio"
                    name={questionId}
                    value={rating}
                    onChange={(e) => handleResponseChange(questionId, parseInt(e.target.value))}
                    className={styles.ratingInput}
                  />
                  <span className={styles.ratingNumber}>{rating}</span>
                </label>
              ))}
            </div>
            <div className={styles.ratingLabels}>
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className={styles.surveySection}>
        <div className={styles.container}>
          <div className={styles.loadingSpinner}>Loading surveys...</div>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className={styles.surveySection}>
        <div className={styles.container}>
          <div className={styles.successMessage}>
            <h2>Thank you for your participation!</h2>
            <p>Your responses have been recorded and will help us provide better insights.</p>
            <button 
              onClick={() => {
                setSubmitted(false);
                setActiveSurvey(surveys.find(s => s.id !== activeSurvey?.id) || surveys[0]);
              }}
              className={styles.newSurveyBtn}
            >
              Take Another Survey
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!activeSurvey) {
    return (
      <section className={styles.surveySection}>
        <div className={styles.container}>
          <div className={styles.noSurveys}>
            <h2>No Active Surveys</h2>
            <p>Check back later for new market research surveys.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.surveySection}>
      <div className={styles.container}>
        <div className={styles.surveyHeader}>
          <h1 className={styles.title}>Market Research Survey</h1>
          <p className={styles.subtitle}>Help us understand consumer behavior and market trends</p>
        </div>

        <div className={styles.surveyCard}>
          <div className={styles.surveyInfo}>
            <h2 className={styles.surveyTitle}>{activeSurvey.title}</h2>
            {activeSurvey.description && (
              <p className={styles.surveyDescription}>{activeSurvey.description}</p>
            )}
            <div className={styles.surveyMeta}>
              <span className={styles.responseCount}>
                {activeSurvey.responseCount || 0} responses collected
              </span>
            </div>
          </div>

          <div className={styles.questionsContainer}>
            {activeSurvey.questions.map((question, index) => 
              renderQuestion(question, index)
            )}
          </div>

          <div className={styles.submitContainer}>
            <button
              onClick={handleSubmitSurvey}
              disabled={submitting || Object.keys(responses).length === 0}
              className={styles.submitBtn}
            >
              {submitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
        </div>

        {surveys.length > 1 && (
          <div className={styles.surveySelector}>
            <h3>Other Available Surveys:</h3>
            <div className={styles.surveyList}>
              {surveys.filter(s => s.id !== activeSurvey.id).map(survey => (
                <button
                  key={survey.id}
                  onClick={() => {
                    setActiveSurvey(survey);
                    setResponses({});
                    setSubmitted(false);
                  }}
                  className={styles.surveyOption}
                >
                  {survey.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
