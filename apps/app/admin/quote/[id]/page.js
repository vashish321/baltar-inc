'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getApiEndpoint } from '@/lib/config';
import styles from './QuotePage.module.css';

export default function QuotePage() {
  const router = useRouter();
  const params = useParams();
  const quoteId = params.id;

  const [quote, setQuote] = useState(null);
  const [formData, setFormData] = useState({
    quotedAmount: '',
    adminNotes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQuote();
  }, [quoteId]);

  const fetchQuote = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(getApiEndpoint(`/api/quotes/${quoteId}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setQuote(result.quote);
        
        // Pre-fill form if quote already has pricing
        if (result.quote.quotedAmount) {
          setFormData({
            quotedAmount: result.quote.quotedAmount.toString(),
            adminNotes: result.quote.adminNotes || ''
          });
        }
      } else {
        setError('Failed to fetch quote details');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');

      // Update quote with pricing
      const response = await fetch(getApiEndpoint(`/api/quotes/${quoteId}/price`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Send quote email
        const emailResponse = await fetch(getApiEndpoint(`/api/quotes/${quoteId}/send`), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const emailResult = await emailResponse.json();

        if (emailResult.success) {
          setSuccess('Quote sent successfully!');
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 2000);
        } else {
          setError('Quote saved but failed to send email: ' + emailResult.error);
        }
      } else {
        setError(result.error || 'Failed to save quote');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading quote details...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className={styles.errorContainer}>
        <h2>Quote Not Found</h2>
        <button onClick={handleBack} className={styles.backButton}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.quotePageContainer}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← Back to Dashboard
        </button>
        <h1>Quote for {quote.name}</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.quoteDetails}>
          <h2>Quote Details</h2>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Customer Name:</label>
              <span>{quote.name}</span>
            </div>
            <div className={styles.detailItem}>
              <label>Email:</label>
              <span>{quote.email}</span>
            </div>
            {quote.phone && (
              <div className={styles.detailItem}>
                <label>Phone:</label>
                <span>{quote.phone}</span>
              </div>
            )}
            
            {quote.serviceType === 'SAVOUR_AND_SIP' && (
              <>
                <div className={styles.detailItem}>
                  <label>Event Type:</label>
                  <span>{quote.eventType}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Guest Count:</label>
                  <span>{quote.guestCount}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Event Date:</label>
                  <span>{new Date(quote.eventDate).toLocaleDateString()}</span>
                </div>
                {quote.services && (
                  <div className={styles.detailItem}>
                    <label>Services:</label>
                    <span>{JSON.parse(quote.services).join(', ')}</span>
                  </div>
                )}
              </>
            )}
            
            {quote.serviceType === 'FRONTEND_WEB_DESIGN' && (
              <>
                {quote.company && (
                  <div className={styles.detailItem}>
                    <label>Company:</label>
                    <span>{quote.company}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <label>Website Type:</label>
                  <span>{quote.websiteType}</span>
                </div>
                <div className={styles.detailItem}>
                  <label>Budget Range:</label>
                  <span>{quote.budget}</span>
                </div>
              </>
            )}
            
            {quote.message && (
              <div className={styles.detailItem}>
                <label>Message:</label>
                <span>{quote.message}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.quoteForm}>
          <h2>Add Quote</h2>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          {success && (
            <div className={styles.successMessage}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Quote Amount ($)</label>
              <input
                type="number"
                name="quotedAmount"
                value={formData.quotedAmount}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter quote amount"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Admin Notes (Optional)</label>
              <textarea
                name="adminNotes"
                value={formData.adminNotes}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="Add any notes or special terms..."
                rows="4"
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleBack}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Save & Send Quote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
