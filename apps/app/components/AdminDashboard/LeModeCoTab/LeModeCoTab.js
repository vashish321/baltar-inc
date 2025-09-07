'use client';
import { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import ProductManagement from './ProductManagement';
import EnhancedOrderManagement from './EnhancedOrderManagement';
import TemplateManagement from './TemplateManagement';
import styles from './LeModeCoTab.module.css';

export default function LeModeCoTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    packages: [],
    subscriptions: [],
    selectedSubscription: null
  });

  const handleViewOrders = () => {
    setActiveSubTab('orders');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const [statsRes, packagesRes, subscriptionsRes] = await Promise.all([
        fetch(getApiEndpoint('/api/le-mode-co/admin/dashboard-stats'), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(getApiEndpoint('/api/le-mode-co/admin/packages'), {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(getApiEndpoint('/api/le-mode-co/admin/subscriptions'), {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [stats, packages, subscriptions] = await Promise.all([
        statsRes.json(),
        packagesRes.json(),
        subscriptionsRes.json()
      ]);

      setData({
        stats: stats.success ? stats.stats : {},
        packages: packages.success ? packages.packages : [],
        subscriptions: subscriptions.success ? subscriptions.subscriptions : [],
        selectedSubscription: null
      });
    } catch (error) {
      console.error('Error fetching Le-Mode-Co data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading Le-Mode-Co data...</p>
      </div>
    );
  }

  return (
    <div className={styles.leModeCoContainer}>
      <div className={styles.tabHeader}>
        <h2>Le-Mode-Co Management</h2>
        <div className={styles.subTabs}>
          <button
            className={`${styles.subTab} ${activeSubTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.subTab} ${activeSubTab === 'packages' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('packages')}
          >
            Packages
          </button>
          <button
            className={`${styles.subTab} ${activeSubTab === 'subscriptions' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('subscriptions')}
          >
            Subscriptions
          </button>
          <button
            className={`${styles.subTab} ${activeSubTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('orders')}
          >
            Orders
          </button>
          <button
            className={`${styles.subTab} ${activeSubTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('products')}
          >
            Products
          </button>
          <button
            className={`${styles.subTab} ${activeSubTab === 'templates' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('templates')}
          >
            Templates
          </button>
          <button
            className={`${styles.subTab} ${activeSubTab === 'categories' ? styles.active : ''}`}
            onClick={() => setActiveSubTab('categories')}
          >
            Categories
          </button>
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeSubTab === 'overview' && (
          <OverviewSection stats={data.stats} onRefresh={fetchData} />
        )}
        {activeSubTab === 'packages' && (
          <PackagesSection packages={data.packages} onRefresh={fetchData} />
        )}
        {activeSubTab === 'subscriptions' && (
          <SubscriptionsSection
            subscriptions={data.subscriptions}
            onRefresh={fetchData}
            onSelectSubscription={(sub) => setData(prev => ({ ...prev, selectedSubscription: sub }))}
            onViewOrders={handleViewOrders}
          />
        )}
        {activeSubTab === 'orders' && (
          <EnhancedOrderManagement
            selectedSubscription={data.selectedSubscription}
            onRefresh={fetchData}
          />
        )}
        {activeSubTab === 'products' && (
          <ProductManagement />
        )}
        {activeSubTab === 'templates' && (
          <TemplateManagement />
        )}
        {activeSubTab === 'categories' && (
          <CategoryManagement />
        )}
      </div>
    </div>
  );
}

// Overview Section Component
function OverviewSection({ stats, onRefresh }) {
  return (
    <div className={styles.overviewSection}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Total Subscriptions</h3>
            <p className={styles.statNumber}>{stats.totalSubscriptions || 0}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Active Subscriptions</h3>
            <p className={styles.statNumber}>{stats.activeSubscriptions || 0}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8C20.9996 7.64928 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64928 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Pending Orders</h3>
            <p className={styles.statNumber}>{stats.pendingOrders || 0}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Total Revenue</h3>
            <p className={styles.statNumber}>${(stats.monthlyRevenue || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <button className={styles.actionBtn} onClick={onRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
            <path d="M1 4V10H7M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9C19.9828 7.56678 19.1209 6.28825 17.9845 5.27455C16.8482 4.26085 15.4745 3.54933 13.9917 3.20137C12.5089 2.8534 10.9652 2.87945 9.49337 3.27684C8.02157 3.67423 6.67253 4.43346 5.57 5.48L1 10M23 14L18.43 18.52C17.3275 19.5665 15.9784 20.3258 14.5066 20.7232C13.0348 21.1205 11.4911 21.1466 10.0083 20.7986C8.52547 20.4507 7.1518 19.7391 6.01547 18.7254C4.87913 17.7118 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh Data
        </button>
      </div>
    </div>
  );
}

// Packages Section Component
function PackagesSection({ packages, onRefresh }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  return (
    <div className={styles.packagesSection}>
      <div className={styles.sectionHeader}>
        <h3>Subscription Packages</h3>
        <button 
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          + Create Package
        </button>
      </div>

      <div className={styles.packagesGrid}>
        {packages.map(subscriptionPackage => (
          <PackageCard
            key={subscriptionPackage.id}
            package={subscriptionPackage}
            onEdit={setEditingPackage}
            onRefresh={onRefresh}
          />
        ))}
      </div>

      {showCreateModal && (
        <PackageModal
          onClose={() => setShowCreateModal(false)}
          onRefresh={onRefresh}
        />
      )}

      {editingPackage && (
        <PackageModal
          package={editingPackage}
          onClose={() => setEditingPackage(null)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}

// Package Card Component
function PackageCard({ package: subscriptionPackage, onEdit, onRefresh }) {
  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/packages/${subscriptionPackage.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !subscriptionPackage.isActive })
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating package status:', error);
    }
  };

  return (
    <div className={`${styles.packageCard} ${!subscriptionPackage.isActive ? styles.inactive : ''}`}>
      <div className={styles.packageHeader}>
        <h4>{subscriptionPackage.name}</h4>
        {subscriptionPackage.isPopular && <span className={styles.popularBadge}>Popular</span>}
      </div>

      <div className={styles.packagePrice}>${subscriptionPackage.price}/month</div>

      <div className={styles.packageFeatures}>
        {subscriptionPackage.features.slice(0, 3).map((feature, idx) => (
          <div key={idx} className={styles.feature}>✓ {feature}</div>
        ))}
        {subscriptionPackage.features.length > 3 && (
          <div className={styles.moreFeatures}>+{subscriptionPackage.features.length - 3} more</div>
        )}
      </div>

      <div className={styles.packageActions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(subscriptionPackage)}
        >
          Edit
        </button>
        <button
          className={`${styles.toggleBtn} ${subscriptionPackage.isActive ? styles.active : styles.inactive}`}
          onClick={handleToggleStatus}
        >
          {subscriptionPackage.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}

// Subscriptions Section Component
function SubscriptionsSection({ subscriptions, onRefresh, onSelectSubscription, onViewOrders }) {
  return (
    <div className={styles.subscriptionsSection}>
      <div className={styles.sectionHeader}>
        <h3>Customer Subscriptions</h3>
      </div>

      <div className={styles.subscriptionsTable}>
        <div className={styles.tableHeader}>
          <div>Customer</div>
          <div>Package</div>
          <div>Payment Status</div>
          <div>Subscription Status</div>
          <div>Monthly Amount</div>
          <div>Created</div>
          <div>Actions</div>
        </div>

        {subscriptions.map(subscription => (
          <SubscriptionRow
            key={subscription.id}
            subscription={subscription}
            onSelect={onSelectSubscription}
            onRefresh={onRefresh}
            onViewOrders={onViewOrders}
          />
        ))}
      </div>
    </div>
  );
}

// Subscription Row Component
function SubscriptionRow({ subscription, onSelect, onRefresh, onViewOrders }) {
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 'PAID': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'FAILED': return '#dc3545';
      case 'OVERDUE': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  const handleUpdatePaymentStatus = async (newStatus) => {
    try {
      setUpdatingPayment(true);
      const token = localStorage.getItem('adminToken');

      await fetch(getApiEndpoint(`/api/le-mode-co/admin/subscriptions/${subscription.id}/payment-status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newStatus })
      });

      onRefresh();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    } finally {
      setUpdatingPayment(false);
    }
  };

  const handleViewOrders = () => {
    onSelect(subscription);
    onViewOrders();
  };

  return (
    <div className={styles.tableRow}>
      <div className={styles.customerInfo}>
        <div className={styles.customerName}>{subscription.fullName}</div>
        <div className={styles.customerEmail}>{subscription.email}</div>
      </div>
      <div>{subscription.package.name}</div>
      <div className={styles.paymentStatusCell}>
        <select
          value={subscription.paymentStatus || 'PENDING'}
          onChange={(e) => handleUpdatePaymentStatus(e.target.value)}
          disabled={updatingPayment}
          className={styles.paymentStatusSelect}
          style={{
            backgroundColor: getPaymentStatusColor(subscription.paymentStatus || 'PENDING'),
            color: 'white'
          }}
        >
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
      <div>
        <span
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor(subscription.status) }}
        >
          {subscription.status}
        </span>
      </div>
      <div>${subscription.monthlyAmount}</div>
      <div>{new Date(subscription.createdAt).toLocaleDateString()}</div>
      <div className={styles.rowActions}>
        <button
          className={styles.viewBtn}
          onClick={handleViewOrders}
        >
          View Orders
        </button>
      </div>
    </div>
  );
}

// Orders Section Component
function OrdersSection({ selectedSubscription, onRefresh }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSubscription) {
      fetchOrders();
    }
  }, [selectedSubscription]);

  const fetchOrders = async () => {
    if (!selectedSubscription) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        getApiEndpoint(`/api/le-mode-co/admin/subscriptions/${selectedSubscription.id}/orders`),
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const result = await response.json();
      if (result.success) {
        setOrders(result.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSubscription) {
    return (
      <div className={styles.ordersSection}>
        <div className={styles.emptyState}>
          <p>Select a subscription from the Subscriptions tab to view orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersSection}>
      <div className={styles.sectionHeader}>
        <h3>Order for {selectedSubscription.fullName}</h3>
        <div className={styles.customerDetails}>
          <span>{selectedSubscription.package.name}</span>
          <span>${selectedSubscription.monthlyAmount}</span>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading orders...</div>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onRefresh={fetchOrders}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Order Card Component
function OrderCard({ order, onRefresh }) {
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: '', description: '', category: '' });

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${order.id}/items`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newItem)
      });

      setNewItem({ itemName: '', description: '', category: '' });
      setShowAddItem(false);
      onRefresh();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${order.id}/complete`), {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onRefresh();
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handleNotifyCustomer = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${order.id}/notify`), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onRefresh();
      alert('Customer notified successfully!');
    } catch (error) {
      console.error('Error notifying customer:', error);
      alert('Failed to notify customer');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return '#28a745';
      case 'ITEMS_ADDED': return '#17a2b8';
      case 'PENDING': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <h4>Subscription Order</h4>
        <span
          className={styles.statusBadge}
          style={{ backgroundColor: getStatusColor(order.status) }}
        >
          {order.status}
        </span>
      </div>

      <div className={styles.orderItems}>
        <h5>Items ({order.items.length})</h5>
        {order.items.map(item => (
          <div key={item.id} className={styles.orderItem}>
            <div className={styles.itemInfo}>
              <strong>{item.itemName}</strong>
              {item.description && <p>{item.description}</p>}
              {item.category && <span className={styles.categoryTag}>{item.category}</span>}
            </div>
          </div>
        ))}

        {showAddItem && (
          <div className={styles.addItemForm}>
            <input
              type="text"
              placeholder="Item name"
              value={newItem.itemName}
              onChange={(e) => setNewItem(prev => ({ ...prev, itemName: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Category"
              value={newItem.category}
              onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
            />
            <div className={styles.formActions}>
              <button onClick={handleAddItem} className={styles.saveBtn}>Save</button>
              <button onClick={() => setShowAddItem(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.orderActions}>
        {order.status !== 'COMPLETED' && (
          <>
            <button
              className={styles.addItemBtn}
              onClick={() => setShowAddItem(true)}
            >
              + Add Item
            </button>
            {order.items.length > 0 && (
              <button
                className={styles.completeBtn}
                onClick={handleCompleteOrder}
              >
                Complete Order
              </button>
            )}
          </>
        )}

        {order.status === 'COMPLETED' && !order.isNotified && (
          <button
            className={styles.notifyBtn}
            onClick={handleNotifyCustomer}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Notify Customer
          </button>
        )}

        {order.isNotified && (
          <span className={styles.notifiedBadge}>
            ✅ Customer Notified
          </span>
        )}
      </div>
    </div>
  );
}

// Package Modal Component
function PackageModal({ package: subscriptionPackage, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: subscriptionPackage?.name || '',
    price: subscriptionPackage?.price || '',
    description: subscriptionPackage?.description || '',
    features: subscriptionPackage?.features || [''],
    bestFor: subscriptionPackage?.bestFor || '',
    isPopular: subscriptionPackage?.isPopular || false
  });

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = subscriptionPackage
        ? getApiEndpoint(`/api/le-mode-co/admin/packages/${subscriptionPackage.id}`)
        : getApiEndpoint('/api/le-mode-co/admin/packages');

      const method = subscriptionPackage ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          features: formData.features.filter(f => f.trim() !== '')
        })
      });

      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{subscriptionPackage ? 'Edit Package' : 'Create Package'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Package Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Monthly Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Features</label>
            {formData.features.map((feature, index) => (
              <div key={index} className={styles.featureInput}>
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Feature ${index + 1}`}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className={styles.removeFeatureBtn}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addFeature} className={styles.addFeatureBtn}>
              + Add Feature
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Best For</label>
            <input
              type="text"
              value={formData.bestFor}
              onChange={(e) => setFormData(prev => ({ ...prev, bestFor: e.target.value }))}
              placeholder="e.g., Fashion enthusiasts"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
              />
              Mark as Popular
            </label>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              {subscriptionPackage ? 'Update' : 'Create'} Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Category Management Component
function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(getApiEndpoint('/api/le-mode-co/admin/categories'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(getApiEndpoint(`/api/le-mode-co/admin/categories/${categoryId}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading categories...</div>;
  }

  return (
    <div className={styles.categoryManagement}>
      <div className={styles.sectionHeader}>
        <h3>Category Management</h3>
        <button onClick={handleCreateCategory} className={styles.createBtn}>
          Add New Category
        </button>
      </div>

      <div className={styles.categoriesGrid}>
        {categories.map(category => (
          <div key={category.id} className={styles.categoryCard}>
            <div className={styles.categoryHeader}>
              <h4>{category.name}</h4>
              <div className={styles.categoryActions}>
                <button
                  onClick={() => handleEditCategory(category)}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className={styles.categoryDescription}>
              {category.description || 'No description'}
            </p>
            <div className={styles.categoryMeta}>
              <span className={`${styles.status} ${category.isActive ? styles.active : styles.inactive}`}>
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
              <span className={styles.order}>Order: {category.displayOrder}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}

// Category Modal Component
function CategoryModal({ category, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    displayOrder: category?.displayOrder || 0,
    isActive: category?.isActive ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = category
        ? getApiEndpoint(`/api/le-mode-co/admin/categories/${category.id}`)
        : getApiEndpoint('/api/le-mode-co/admin/categories');

      const response = await fetch(url, {
        method: category ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        onSave();
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>{category ? 'Edit Category' : 'Create New Category'}</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Display Order</label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
              min={0}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
              Active
            </label>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className={styles.saveBtn}>
              {saving ? 'Saving...' : (category ? 'Update' : 'Create')} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
