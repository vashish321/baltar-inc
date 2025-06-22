'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [authenticated, setAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    savourSipQuotes: [],
    frontendQuotes: [],
    stats: {
      totalQuotes: 0,
      pendingQuotes: 0,
      quotedAmount: 0,
      convertedProjects: 0
    }
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('adminUser');

      if (!token || !user) {
        router.push('/admin');
        return;
      }

      // Verify token with backend
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAuthenticated(true);
        setAdminUser(JSON.parse(user));
        fetchDashboardData();
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      router.push('/admin');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      // Fetch quotes data
      const quotesResponse = await fetch('http://localhost:5000/api/quotes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (quotesResponse.ok) {
        const quotesData = await quotesResponse.json();
        
        const savourSipQuotes = quotesData.quotes.filter(q => q.serviceType === 'SAVOUR_AND_SIP');
        const frontendQuotes = quotesData.quotes.filter(q => q.serviceType === 'FRONTEND_WEB_DESIGN');
        
        setData({
          savourSipQuotes,
          frontendQuotes,
          stats: {
            totalQuotes: quotesData.quotes.length,
            pendingQuotes: quotesData.quotes.filter(q => q.status === 'PENDING').length,
            quotedAmount: quotesData.quotes.reduce((sum, q) => sum + (q.quotedAmount || 0), 0),
            convertedProjects: quotesData.quotes.filter(q => q.status === 'CONVERTED_TO_PROJECT').length
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin');
  };

  if (!authenticated) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Authenticating...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>Baltar Inc</span>
          </div>
          <p className={styles.adminInfo}>
            Welcome, {adminUser?.firstName}
          </p>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className={styles.navIcon}>📊</span>
            Overview
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'savour-sip' ? styles.active : ''}`}
            onClick={() => setActiveTab('savour-sip')}
          >
            <span className={styles.navIcon}>🥂</span>
            Savour & Sip
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'frontend-design' ? styles.active : ''}`}
            onClick={() => setActiveTab('frontend-design')}
          >
            <span className={styles.navIcon}>💻</span>
            Frontend Web Design
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <span className={styles.navIcon}>🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <h1 className={styles.pageTitle}>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'savour-sip' && 'Savour & Sip Management'}
            {activeTab === 'frontend-design' && 'Frontend Web Design Management'}
          </h1>
        </div>

        <div className={styles.contentBody}>
          {activeTab === 'overview' && (
            <OverviewTab data={data} loading={loading} />
          )}
          {activeTab === 'savour-sip' && (
            <SavourSipTab quotes={data.savourSipQuotes} loading={loading} onRefresh={fetchDashboardData} />
          )}
          {activeTab === 'frontend-design' && (
            <FrontendDesignTab quotes={data.frontendQuotes} loading={loading} onRefresh={fetchDashboardData} />
          )}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ data, loading }) {
  if (loading) {
    return <div className={styles.loading}>Loading dashboard data...</div>;
  }

  return (
    <div className={styles.overviewGrid}>
      <div className={styles.statCard}>
        <div className={styles.statIcon}>📋</div>
        <div className={styles.statContent}>
          <h3>Total Quotes</h3>
          <p className={styles.statNumber}>{data.stats.totalQuotes}</p>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>⏳</div>
        <div className={styles.statContent}>
          <h3>Pending Quotes</h3>
          <p className={styles.statNumber}>{data.stats.pendingQuotes}</p>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>💰</div>
        <div className={styles.statContent}>
          <h3>Total Quoted</h3>
          <p className={styles.statNumber}>${data.stats.quotedAmount.toLocaleString()}</p>
        </div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statIcon}>✅</div>
        <div className={styles.statContent}>
          <h3>Converted Projects</h3>
          <p className={styles.statNumber}>{data.stats.convertedProjects}</p>
        </div>
      </div>
    </div>
  );
}

// Savour & Sip Tab Component
function SavourSipTab({ quotes, loading, onRefresh }) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (loading) {
    return <div className={styles.loading}>Loading Savour & Sip quotes...</div>;
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2>Quote Requests</h2>
        <button
          className={styles.generateInvoiceBtn}
          onClick={() => setShowInvoiceModal(true)}
        >
          Generate Invoice
        </button>
      </div>

      <div className={styles.quotesGrid}>
        {quotes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No quote requests yet</p>
          </div>
        ) : (
          quotes.map(quote => (
            <QuoteCard key={quote.id} quote={quote} serviceType="savour-sip" onRefresh={onRefresh} />
          ))
        )}
      </div>

      {showInvoiceModal && (
        <InvoiceModal
          serviceType="SAVOUR_AND_SIP"
          onClose={() => setShowInvoiceModal(false)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}

// Frontend Design Tab Component
function FrontendDesignTab({ quotes, loading, onRefresh }) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (loading) {
    return <div className={styles.loading}>Loading Frontend Web Design quotes...</div>;
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeader}>
        <h2>Quote Requests</h2>
        <button
          className={styles.generateInvoiceBtn}
          onClick={() => setShowInvoiceModal(true)}
        >
          Generate Invoice
        </button>
      </div>

      <div className={styles.quotesGrid}>
        {quotes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No quote requests yet</p>
          </div>
        ) : (
          quotes.map(quote => (
            <QuoteCard key={quote.id} quote={quote} serviceType="frontend-design" onRefresh={onRefresh} />
          ))
        )}
      </div>

      {showInvoiceModal && (
        <InvoiceModal
          serviceType="FRONTEND_WEB_DESIGN"
          onClose={() => setShowInvoiceModal(false)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}

// Quote Card Component
function QuoteCard({ quote, serviceType, onRefresh }) {
  const router = useRouter();

  const handleQuoteClick = () => {
    router.push(`/admin/quote/${quote.id}`);
  };

  return (
    <div className={styles.quoteCard}>
      <div className={styles.quoteHeader}>
        <div className={styles.quoteStatus}>
          <span className={`${styles.statusBadge} ${styles[quote.status.toLowerCase()]}`}>
            {quote.status === 'PENDING' ? 'Quote' : quote.status}
          </span>
        </div>
        <div className={styles.quoteDate}>
          {new Date(quote.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className={styles.quoteContent}>
        <h3>{quote.name}</h3>
        <p className={styles.quoteEmail}>{quote.email}</p>

        {serviceType === 'savour-sip' && (
          <div className={styles.quoteDetails}>
            <p><strong>Event:</strong> {quote.eventType}</p>
            <p><strong>Guests:</strong> {quote.guestCount}</p>
            <p><strong>Date:</strong> {new Date(quote.eventDate).toLocaleDateString()}</p>
          </div>
        )}

        {serviceType === 'frontend-design' && (
          <div className={styles.quoteDetails}>
            <p><strong>Company:</strong> {quote.company || 'N/A'}</p>
            <p><strong>Website Type:</strong> {quote.websiteType}</p>
            <p><strong>Budget:</strong> {quote.budget}</p>
          </div>
        )}

        {quote.message && (
          <p className={styles.quoteMessage}>{quote.message}</p>
        )}
      </div>

      <div className={styles.quoteActions}>
        {quote.status === 'PENDING' ? (
          <button
            className={styles.quoteButton}
            onClick={handleQuoteClick}
          >
            Add Quote & Send
          </button>
        ) : (
          <div className={styles.quotedInfo}>
            <p><strong>Quoted:</strong> ${quote.quotedAmount}</p>
            <button className={styles.resendButton} onClick={handleQuoteClick}>
              View/Edit Quote
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



// Invoice Modal Component
function InvoiceModal({ serviceType, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    eventType: '',
    guestCount: '',
    cost: '',
    // Frontend Web Design specific fields
    websiteType: '',
    projectDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');

      const invoiceData = {
        serviceType,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        cost: parseFloat(formData.cost),
        eventType: formData.eventType,
        guestCount: formData.guestCount ? parseInt(formData.guestCount) : null,
        websiteType: formData.websiteType,
        projectDescription: formData.projectDescription
      };

      const response = await fetch('http://localhost:5000/api/invoices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(invoiceData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Invoice generated and sent successfully!');
        onRefresh();
        onClose();
      } else {
        setError(result.error || 'Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Generate Invoice - {serviceType === 'SAVOUR_AND_SIP' ? 'Savour & Sip' : 'Frontend Web Design'}</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.quoteForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              className={styles.input}
              placeholder="customer@email.com"
              required
            />
          </div>

          {serviceType === 'SAVOUR_AND_SIP' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={styles.input}
                  required
                >
                  <option value="">Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="private">Private Party</option>
                  <option value="restaurant">Restaurant Staffing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Total Number of Guests</label>
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Number of guests"
                  min="1"
                />
              </div>
            </>
          )}

          {serviceType === 'FRONTEND_WEB_DESIGN' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Website Type</label>
                <select
                  name="websiteType"
                  value={formData.websiteType}
                  onChange={handleChange}
                  className={styles.input}
                  required
                >
                  <option value="">Select website type</option>
                  <option value="business">Business Website</option>
                  <option value="ecommerce">E-commerce Store</option>
                  <option value="portfolio">Portfolio/Personal</option>
                  <option value="blog">Blog/Content Site</option>
                  <option value="nonprofit">Non-profit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Project Description</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Brief description of the project..."
                  rows="3"
                />
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Cost ($)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter total cost"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate & Send Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
