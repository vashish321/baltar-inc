'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ClientDashboard.module.css';

export default function ClientDashboard() {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [clientEmail, setClientEmail] = useState('');

  useEffect(() => {
    // For demo purposes, we'll use a test client email
    // In production, this would come from authentication
    const testClientEmail = 'test@example.com';
    fetchClientData(testClientEmail);
  }, []);

  const fetchClientData = async (email) => {
    try {
      setLoading(true);

      // COMMENTED OUT FOR UI/UX DEMO - Backend calls disabled
      /*
      // First, get client by email
      const clientResponse = await fetch(`http://localhost:5000/api/clients/email/${email}`);

      if (clientResponse.ok) {
        const clientResult = await clientResponse.json();
        const client = clientResult.client;

        // Get client dashboard data
        const dashboardResponse = await fetch(`http://localhost:5000/api/clients/${client.id}/dashboard`);

        if (dashboardResponse.ok) {
          const dashboardResult = await dashboardResponse.json();
          setClientData(dashboardResult.dashboard);
        } else {
          // Fallback to mock data if no dashboard data
          setClientData({
      */

      // Mock data for UI demo
      setClientData({
        client: {
          id: 'client-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          company: 'Doe Enterprises'
        },
        summary: {
          projects: {
            total: 3,
            active: 1,
            completed: 2
          },
          invoices: {
            total: 4,
            paid: 3,
            pending: 1
          },
          financial: {
            totalAmount: 8500,
            paidAmount: 6000,
            pendingAmount: 2500
          }
        },
        recentProjects: [
          {
            id: 'proj-1',
            title: 'Company Website Redesign',
            status: 'IN_PROGRESS',
            serviceType: 'FRONTEND_WEB_DESIGN',
            createdAt: '2024-06-01T00:00:00Z'
          },
          {
            id: 'proj-2',
            title: 'Corporate Event Catering',
            status: 'COMPLETED',
            serviceType: 'SAVOUR_AND_SIP',
            createdAt: '2024-05-15T00:00:00Z'
          }
        ],
        recentInvoices: [
          {
            id: 'inv-1',
            invoiceNumber: 'INV-202406-001',
            title: 'Website Development - Phase 1',
            total: 2500,
            status: 'SENT',
            dueDate: '2024-07-01T00:00:00Z'
          },
          {
            id: 'inv-2',
            invoiceNumber: 'INV-202405-002',
            title: 'Event Catering Services',
            total: 3500,
            status: 'PAID',
            paidDate: '2024-05-20T00:00:00Z'
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching client data:', error);
      setClientData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return '#10B981';
      case 'IN_PROGRESS':
      case 'SENT':
        return '#F59E0B';
      case 'CANCELLED':
      case 'OVERDUE':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const downloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
      // COMMENTED OUT FOR UI/UX DEMO - Backend calls disabled
      /*
      // For now, we'll create a simple PDF-like content
      // In production, you'd generate a proper PDF
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}`);
      const result = await response.json();

      if (result.success) {
        const invoice = result.invoice;

        // Create a simple text representation
        const invoiceContent = `
BALTAR TECHNOLOGIES
Invoice: ${invoice.invoiceNumber}
Date: ${formatDate(invoice.createdAt)}
Due Date: ${formatDate(invoice.dueDate)}

Bill To:
${invoice.client.firstName} ${invoice.client.lastName}
${invoice.client.email}
${invoice.client.company || ''}

Items:
${invoice.invoiceItems.map(item =>
  `${item.description} - Qty: ${item.quantity} - $${item.unitPrice} = $${item.total}`
).join('\n')}

Subtotal: $${invoice.subtotal}
Tax: $${invoice.tax}
Total: $${invoice.total}

Status: ${invoice.status}
        `;

        // Create and download file
        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${invoiceNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      */

      // Mock download for UI demo
      alert(`Invoice ${invoiceNumber} download functionality disabled in demo mode`);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Welcome back, {clientData.client.firstName}!</h1>
          <p>Manage your projects and view invoices</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.supportButton}>
            Contact Support
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'projects' ? styles.active : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'invoices' ? styles.active : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Summary Cards */}
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <h3>Projects</h3>
                <div className={styles.summaryStats}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{clientData.summary.projects.total}</span>
                    <span className={styles.statLabel}>Total</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{clientData.summary.projects.active}</span>
                    <span className={styles.statLabel}>Active</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{clientData.summary.projects.completed}</span>
                    <span className={styles.statLabel}>Completed</span>
                  </div>
                </div>
              </div>

              <div className={styles.summaryCard}>
                <h3>Invoices</h3>
                <div className={styles.summaryStats}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{clientData.summary.invoices.total}</span>
                    <span className={styles.statLabel}>Total</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{clientData.summary.invoices.paid}</span>
                    <span className={styles.statLabel}>Paid</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>{clientData.summary.invoices.pending}</span>
                    <span className={styles.statLabel}>Pending</span>
                  </div>
                </div>
              </div>

              <div className={styles.summaryCard}>
                <h3>Financial Summary</h3>
                <div className={styles.financialStats}>
                  <div className={styles.financialItem}>
                    <span className={styles.financialLabel}>Total Amount</span>
                    <span className={styles.financialAmount}>
                      {formatCurrency(clientData.summary.financial.totalAmount)}
                    </span>
                  </div>
                  <div className={styles.financialItem}>
                    <span className={styles.financialLabel}>Paid</span>
                    <span className={styles.financialAmount} style={{ color: '#10B981' }}>
                      {formatCurrency(clientData.summary.financial.paidAmount)}
                    </span>
                  </div>
                  <div className={styles.financialItem}>
                    <span className={styles.financialLabel}>Pending</span>
                    <span className={styles.financialAmount} style={{ color: '#F59E0B' }}>
                      {formatCurrency(clientData.summary.financial.pendingAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.recentActivity}>
              <div className={styles.activitySection}>
                <h3>Recent Projects</h3>
                <div className={styles.projectList}>
                  {clientData.recentProjects.map((project) => (
                    <div key={project.id} className={styles.projectItem}>
                      <div className={styles.projectInfo}>
                        <h4>{project.title}</h4>
                        <p>{project.serviceType === 'FRONTEND_WEB_DESIGN' ? 'Web Design' : 'Catering'}</p>
                        <span className={styles.projectDate}>
                          Started: {formatDate(project.createdAt)}
                        </span>
                      </div>
                      <div 
                        className={styles.projectStatus}
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      >
                        {project.status.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.activitySection}>
                <h3>Recent Invoices</h3>
                <div className={styles.invoiceList}>
                  {clientData.recentInvoices.map((invoice) => (
                    <div key={invoice.id} className={styles.invoiceItem}>
                      <div className={styles.invoiceInfo}>
                        <h4>{invoice.invoiceNumber}</h4>
                        <p>{invoice.title}</p>
                        <span className={styles.invoiceAmount}>
                          {formatCurrency(invoice.total)}
                        </span>
                      </div>
                      <div className={styles.invoiceActions}>
                        <div
                          className={styles.invoiceStatus}
                          style={{ backgroundColor: getStatusColor(invoice.status) }}
                        >
                          {invoice.status}
                        </div>
                        {(invoice.status === 'SENT' || invoice.status === 'PAID') && (
                          <button
                            className={styles.downloadButton}
                            onClick={() => downloadInvoice(invoice.id, invoice.invoiceNumber)}
                          >
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>All Projects</h2>
            <p>Detailed project management coming soon...</p>
          </motion.div>
        )}

        {activeTab === 'invoices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>All Invoices</h2>
            <p>Detailed invoice management coming soon...</p>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Profile Settings</h2>
            <p>Profile management coming soon...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
