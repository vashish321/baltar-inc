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
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Total Subscriptions</h3>
            <p className={styles.statNumber}>{stats.totalSubscriptions || 0}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Active Subscriptions</h3>
            <p className={styles.statNumber}>{stats.activeSubscriptions || 0}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statContent}>
            <h3>Pending Orders</h3>
            <p className={styles.statNumber}>{stats.pendingOrders || 0}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <h3>Monthly Revenue</h3>
            <p className={styles.statNumber}>${(stats.monthlyRevenue || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <button className={styles.actionBtn} onClick={onRefresh}>
          🔄 Refresh Data
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
        <h3>Orders for {selectedSubscription.fullName}</h3>
        <div className={styles.customerDetails}>
          <span>{selectedSubscription.package.name}</span>
          <span>${selectedSubscription.monthlyAmount}/month</span>
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
        <h4>{new Date(order.orderMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
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
            📧 Notify Customer
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
