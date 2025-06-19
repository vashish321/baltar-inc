'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    bookings: [],
    projects: [],
    invoices: [],
    clients: []
  });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalProjects: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0
  });
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // COMMENTED OUT FOR UI/UX DEMO - Backend authentication disabled
      /*
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('adminUser');

      if (!token || !user) {
        router.push('/admin-login');
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
        router.push('/admin-login');
      }
      */

      // Mock authentication for UI demo
      setAuthenticated(true);
      setAdminUser({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@baltar.com'
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Authentication error:', error);
      // router.push('/admin-login'); // Commented out for demo
    }
  };

  const handleLogout = () => {
    // COMMENTED OUT FOR UI/UX DEMO - Backend authentication disabled
    /*
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin-login');
    */

    // Mock logout for demo
    alert('Logout functionality disabled in demo mode');
  };

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      // COMMENTED OUT FOR UI/UX DEMO - Backend calls disabled
      /*
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh data to show updated status
        fetchDashboardData();
        alert('Invoice status updated successfully!');
      } else {
        alert('Failed to update invoice status');
      }
      */

      // Mock update for UI demo
      alert('Invoice status updated successfully! (Demo mode - no backend)');
      // Update local state for demo
      setData(prevData => ({
        ...prevData,
        invoices: prevData.invoices.map(inv =>
          inv.id === invoiceId ? { ...inv, status: newStatus } : inv
        )
      }));
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Error updating invoice status');
    }
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      // COMMENTED OUT FOR UI/UX DEMO - Backend calls disabled
      /*
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchDashboardData();
        alert('Project status updated successfully!');
      } else {
        alert('Failed to update project status');
      }
      */

      // Mock update for UI demo
      alert('Project status updated successfully! (Demo mode - no backend)');
      // Update local state for demo
      setData(prevData => ({
        ...prevData,
        projects: prevData.projects.map(project =>
          project.id === projectId ? { ...project, status: newStatus } : project
        )
      }));
    } catch (error) {
      console.error('Error updating project status:', error);
      alert('Error updating project status');
    }
  };

  const openProjectEditor = (project) => {
    setEditingProject({
      id: project.id,
      title: project.title,
      description: project.description || '',
      estimatedCost: project.estimatedCost || '',
      finalCost: project.finalCost || '',
      startDate: project.startDate ? project.startDate.split('T')[0] : '',
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      // Service-specific fields
      websiteUrl: project.websiteUrl || '',
      domainName: project.domainName || '',
      hostingPlan: project.hostingPlan || '',
      eventDate: project.eventDate ? project.eventDate.split('T')[0] : '',
      eventLocation: project.eventLocation || '',
      guestCount: project.guestCount || '',
      eventType: project.eventType || ''
    });
    setShowProjectModal(true);
  };

  const saveProjectChanges = async () => {
    try {
      // COMMENTED OUT FOR UI/UX DEMO - Backend calls disabled
      /*
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/projects/${editingProject.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingProject.title,
          description: editingProject.description,
          estimatedCost: editingProject.estimatedCost ? parseFloat(editingProject.estimatedCost) : null,
          finalCost: editingProject.finalCost ? parseFloat(editingProject.finalCost) : null,
          startDate: editingProject.startDate || null,
          endDate: editingProject.endDate || null,
          websiteUrl: editingProject.websiteUrl || null,
          domainName: editingProject.domainName || null,
          hostingPlan: editingProject.hostingPlan || null,
          eventDate: editingProject.eventDate || null,
          eventLocation: editingProject.eventLocation || null,
          guestCount: editingProject.guestCount ? parseInt(editingProject.guestCount) : null,
          eventType: editingProject.eventType || null
        })
      });

      if (response.ok) {
        setShowProjectModal(false);
        setEditingProject(null);
        fetchDashboardData();
        alert('Project updated successfully!');
      } else {
        alert('Failed to update project');
      }
      */

      // Mock update for UI demo
      setData(prevData => ({
        ...prevData,
        projects: prevData.projects.map(project =>
          project.id === editingProject.id ? editingProject : project
        )
      }));

      setShowProjectModal(false);
      setEditingProject(null);
      alert('Project updated successfully! (Demo mode - no backend)');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // COMMENTED OUT FOR UI/UX DEMO - Backend calls disabled
      /*
      const token = localStorage.getItem('adminToken');

      // Fetch all data in parallel with auth headers
      const [bookingsRes, projectsRes, invoicesRes, clientsRes] = await Promise.all([
        fetch('http://localhost:5000/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/invoices', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/clients', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [bookings, projects, invoices, clients] = await Promise.all([
        bookingsRes.json(),
        projectsRes.json(),
        invoicesRes.json(),
        clientsRes.json()
      ]);

      setData({
        bookings: bookings.bookings || [],
        projects: projects.projects || [],
        invoices: invoices.invoices || [],
        clients: clients.clients || []
      });

      // Calculate stats
      const totalRevenue = (invoices.invoices || [])
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + inv.total, 0);

      const pendingInvoices = (invoices.invoices || [])
        .filter(inv => ['DRAFT', 'SENT'].includes(inv.status)).length;

      setStats({
        totalBookings: (bookings.bookings || []).length,
        totalProjects: (projects.projects || []).length,
        totalInvoices: (invoices.invoices || []).length,
        totalRevenue,
        pendingInvoices
      });
      */

      // Mock data for UI demo
      const mockData = {
        bookings: [
          {
            id: '1',
            client: { firstName: 'John', lastName: 'Doe' },
            serviceType: 'FRONTEND_WEB_DESIGN',
            status: 'INQUIRY',
            createdAt: new Date().toISOString(),
            eventDate: null,
            guestCount: null
          },
          {
            id: '2',
            client: { firstName: 'Jane', lastName: 'Smith' },
            serviceType: 'SAVOUR_AND_SIP',
            status: 'APPROVED',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            eventDate: new Date(Date.now() + 2592000000).toISOString(),
            guestCount: 50
          }
        ],
        projects: [
          {
            id: '1',
            title: 'E-commerce Website',
            client: { firstName: 'John', lastName: 'Doe' },
            serviceType: 'FRONTEND_WEB_DESIGN',
            status: 'IN_PROGRESS',
            estimatedCost: 3500,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Wedding Catering',
            client: { firstName: 'Jane', lastName: 'Smith' },
            serviceType: 'SAVOUR_AND_SIP',
            status: 'APPROVED',
            estimatedCost: 2500,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        invoices: [
          {
            id: '1',
            invoiceNumber: 'INV-202501-001',
            client: { firstName: 'John', lastName: 'Doe' },
            total: 3500,
            status: 'SENT',
            dueDate: new Date(Date.now() + 2592000000).toISOString(),
            createdAt: new Date().toISOString()
          }
        ],
        clients: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            company: 'Doe Enterprises',
            _count: { projects: 1 },
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            company: 'Smith Corp',
            _count: { projects: 1 },
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ]
      };

      setData(mockData);

      // Calculate stats from mock data
      const totalRevenue = mockData.invoices
        .filter(inv => inv.status === 'PAID')
        .reduce((sum, inv) => sum + inv.total, 0);

      const pendingInvoices = mockData.invoices
        .filter(inv => ['DRAFT', 'SENT'].includes(inv.status)).length;

      setStats({
        totalBookings: mockData.bookings.length,
        totalProjects: mockData.projects.length,
        totalInvoices: mockData.invoices.length,
        totalRevenue,
        pendingInvoices
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  if (!authenticated || loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>{!authenticated ? 'Checking authentication...' : 'Loading dashboard...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {adminUser?.firstName} {adminUser?.lastName}</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.refreshButton}
            onClick={fetchDashboardData}
          >
            Refresh Data
          </button>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Bookings</h3>
          <div className={styles.statNumber}>{stats.totalBookings}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Active Projects</h3>
          <div className={styles.statNumber}>{stats.totalProjects}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Total Revenue</h3>
          <div className={styles.statNumber}>{formatCurrency(stats.totalRevenue)}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Invoices</h3>
          <div className={styles.statNumber}>{stats.pendingInvoices}</div>
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
          className={`${styles.tab} ${activeTab === 'bookings' ? styles.active : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
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
          className={`${styles.tab} ${activeTab === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          Clients
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
            <div className={styles.overviewGrid}>
              <div className={styles.overviewSection}>
                <h3>Recent Bookings</h3>
                <div className={styles.itemList}>
                  {data.bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className={styles.listItem}>
                      <div className={styles.itemInfo}>
                        <h4>{booking.client?.firstName} {booking.client?.lastName}</h4>
                        <p>{booking.serviceType === 'FRONTEND_WEB_DESIGN' ? 'Web Design' : 'Catering'}</p>
                        <span className={styles.itemDate}>
                          {formatDate(booking.createdAt)}
                        </span>
                      </div>
                      <div 
                        className={styles.itemStatus}
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                      >
                        {booking.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.overviewSection}>
                <h3>Recent Projects</h3>
                <div className={styles.itemList}>
                  {data.projects.slice(0, 5).map((project) => (
                    <div key={project.id} className={styles.listItem}>
                      <div className={styles.itemInfo}>
                        <h4>{project.title}</h4>
                        <p>{project.client?.firstName} {project.client?.lastName}</p>
                        <span className={styles.itemDate}>
                          {formatDate(project.createdAt)}
                        </span>
                      </div>
                      <div 
                        className={styles.itemStatus}
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      >
                        {project.status.replace('_', ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>All Bookings</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Event Date</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.client?.firstName} {booking.client?.lastName}</td>
                      <td>{booking.serviceType === 'FRONTEND_WEB_DESIGN' ? 'Web Design' : 'Catering'}</td>
                      <td>{booking.eventDate ? formatDate(booking.eventDate) : 'TBD'}</td>
                      <td>{booking.guestCount || 'N/A'}</td>
                      <td>
                        <span 
                          className={styles.statusBadge}
                          style={{ backgroundColor: getStatusColor(booking.status) }}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>{formatDate(booking.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Estimated Cost</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.client?.firstName} {project.client?.lastName}</td>
                      <td>{project.serviceType === 'FRONTEND_WEB_DESIGN' ? 'Web Design' : 'Catering'}</td>
                      <td>
                        <span 
                          className={styles.statusBadge}
                          style={{ backgroundColor: getStatusColor(project.status) }}
                        >
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{project.estimatedCost ? formatCurrency(project.estimatedCost) : 'TBD'}</td>
                      <td>{formatDate(project.createdAt)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editButton}
                            onClick={() => openProjectEditor(project)}
                          >
                            Edit
                          </button>
                          {project.status === 'INQUIRY' && (
                            <button
                              className={styles.actionButton}
                              onClick={() => updateProjectStatus(project.id, 'APPROVED')}
                            >
                              Approve
                            </button>
                          )}
                          {project.status === 'APPROVED' && (
                            <button
                              className={styles.actionButton}
                              onClick={() => updateProjectStatus(project.id, 'IN_PROGRESS')}
                            >
                              Start
                            </button>
                          )}
                          {project.status === 'IN_PROGRESS' && (
                            <button
                              className={styles.actionButton}
                              onClick={() => updateProjectStatus(project.id, 'COMPLETED')}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'invoices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>All Invoices</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.client?.firstName} {invoice.client?.lastName}</td>
                      <td>{formatCurrency(invoice.total)}</td>
                      <td>
                        <span 
                          className={styles.statusBadge}
                          style={{ backgroundColor: getStatusColor(invoice.status) }}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td>{formatDate(invoice.dueDate)}</td>
                      <td>{formatDate(invoice.createdAt)}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          {invoice.status === 'DRAFT' && (
                            <button
                              className={styles.actionButton}
                              onClick={() => updateInvoiceStatus(invoice.id, 'SENT')}
                            >
                              Send
                            </button>
                          )}
                          {invoice.status === 'SENT' && (
                            <button
                              className={styles.actionButton}
                              onClick={() => updateInvoiceStatus(invoice.id, 'PAID')}
                            >
                              Mark Paid
                            </button>
                          )}
                          {invoice.status === 'DRAFT' && (
                            <button
                              className={styles.deleteButton}
                              onClick={() => updateInvoiceStatus(invoice.id, 'CANCELLED')}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'clients' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>All Clients</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Projects</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.clients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.firstName} {client.lastName}</td>
                      <td>{client.email}</td>
                      <td>{client.company || 'N/A'}</td>
                      <td>{client._count?.projects || 0}</td>
                      <td>{formatDate(client.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Project Editing Modal */}
      {showProjectModal && editingProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.projectModal}>
            <h3>Edit Project Details</h3>

            <div className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Estimated Cost ($)</label>
                  <input
                    type="number"
                    value={editingProject.estimatedCost}
                    onChange={(e) => setEditingProject({...editingProject, estimatedCost: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Final Cost ($)</label>
                  <input
                    type="number"
                    value={editingProject.finalCost}
                    onChange={(e) => setEditingProject({...editingProject, finalCost: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={editingProject.startDate}
                    onChange={(e) => setEditingProject({...editingProject, startDate: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <input
                    type="date"
                    value={editingProject.endDate}
                    onChange={(e) => setEditingProject({...editingProject, endDate: e.target.value})}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  className={styles.formTextarea}
                  rows="3"
                />
              </div>

              {/* Service-specific fields */}
              {data.projects.find(p => p.id === editingProject.id)?.serviceType === 'FRONTEND_WEB_DESIGN' && (
                <>
                  <h4>Web Design Details</h4>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Website URL</label>
                      <input
                        type="url"
                        value={editingProject.websiteUrl}
                        onChange={(e) => setEditingProject({...editingProject, websiteUrl: e.target.value})}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Domain Name</label>
                      <input
                        type="text"
                        value={editingProject.domainName}
                        onChange={(e) => setEditingProject({...editingProject, domainName: e.target.value})}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Hosting Plan</label>
                    <input
                      type="text"
                      value={editingProject.hostingPlan}
                      onChange={(e) => setEditingProject({...editingProject, hostingPlan: e.target.value})}
                      className={styles.formInput}
                    />
                  </div>
                </>
              )}

              {data.projects.find(p => p.id === editingProject.id)?.serviceType === 'SAVOUR_AND_SIP' && (
                <>
                  <h4>Event Details</h4>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Event Date</label>
                      <input
                        type="date"
                        value={editingProject.eventDate}
                        onChange={(e) => setEditingProject({...editingProject, eventDate: e.target.value})}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Guest Count</label>
                      <input
                        type="number"
                        value={editingProject.guestCount}
                        onChange={(e) => setEditingProject({...editingProject, guestCount: e.target.value})}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Event Location</label>
                      <input
                        type="text"
                        value={editingProject.eventLocation}
                        onChange={(e) => setEditingProject({...editingProject, eventLocation: e.target.value})}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Event Type</label>
                      <input
                        type="text"
                        value={editingProject.eventType}
                        onChange={(e) => setEditingProject({...editingProject, eventType: e.target.value})}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.saveButton}
                onClick={saveProjectChanges}
              >
                Save Changes
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowProjectModal(false);
                  setEditingProject(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
