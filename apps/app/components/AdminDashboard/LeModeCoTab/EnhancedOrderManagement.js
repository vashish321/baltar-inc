'use client';
import { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import TemplateApplyModal from './TemplateApplyModal';
import ProductSearchModal from './ProductSearchModal';
import styles from './EnhancedOrderManagement.module.css';

export default function EnhancedOrderManagement({ selectedSubscription }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);

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
      } else {
        console.error('Error fetching orders:', result);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    if (!selectedSubscription) return;

    try {
      setCreatingOrder(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(
        getApiEndpoint('/api/le-mode-co/admin/orders/create'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            subscriptionId: selectedSubscription.id
          })
        }
      );

      const result = await response.json();
      if (result.success) {
        await fetchOrders(); // Refresh orders list
        alert('Order created successfully!');
      } else {
        alert('Failed to create order: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (!selectedSubscription) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <h3>No Subscription Selected</h3>
          <p>Select a subscription from the Subscriptions tab to manage orders</p>
          <div className={styles.emptyStateHint}>
            <p>💡 <strong>Tip:</strong> Go to the Subscriptions tab and click "View Orders" next to any customer</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.orderManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3>Orders for {selectedSubscription.fullName}</h3>
          <div className={styles.customerDetails}>
            <span>{selectedSubscription.package.name}</span>
            <span>${selectedSubscription.monthlyAmount}/month</span>
            <span className={`${styles.statusBadge} ${styles[selectedSubscription.status?.toLowerCase()]}`}>
              {selectedSubscription.status}
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.createOrderBtn}
            onClick={createOrder}
            disabled={creatingOrder}
          >
            {creatingOrder ? 'Creating...' : '+ Create Order'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyOrders}>
          <div className={styles.emptyOrdersContent}>
            <h4>No Orders Found</h4>
            <p>This subscription doesn't have any orders yet.</p>
            <button
              className={styles.createFirstOrderBtn}
              onClick={createOrder}
              disabled={creatingOrder}
            >
              {creatingOrder ? 'Creating...' : 'Create First Order'}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map(order => (
            <EnhancedOrderCard
              key={order.id}
              order={order}
              subscription={selectedSubscription}
              onRefresh={fetchOrders}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced Order Card Component
function EnhancedOrderCard({ order, subscription, onRefresh }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'PROCESSING': return '#17a2b8';
      case 'ITEMS_ADDED': return '#6f42c1';
      case 'COMPLETED': return '#28a745';
      case 'SHIPPED': return '#fd7e14';
      case 'DELIVERED': return '#20c997';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const canShip = ['PAID', 'COMPLIMENTARY'].includes(subscription?.status);

  const updateOrderStatus = async (newStatus) => {
    if (!canShip && ['SHIPPED', 'DELIVERED'].includes(newStatus)) {
      alert(`Cannot ship order - subscription status is ${subscription.status}. Only PAID or COMPLIMENTARY subscriptions can be shipped.`);
      return;
    }

    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(
        getApiEndpoint(`/api/le-mode-co/admin/orders/${order.id}/status`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: newStatus,
            notes: `Status updated to ${newStatus}`,
            trackingNumber: newStatus === 'SHIPPED' ? prompt('Enter tracking number (optional):') : null
          })
        }
      );

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert('Failed to update status: ' + (error.details || error.error));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm('Are you sure you want to remove this item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        getApiEndpoint(`/api/le-mode-co/admin/orders/${order.id}/items/${itemId}`),
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        onRefresh();
      } else {
        alert('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const handleNotifyCustomer = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${order.id}/notify-enhanced`), {
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

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div className={styles.orderHeaderLeft}>
          <h4>Order #{order.id.slice(-8)}</h4>
          <div className={styles.orderDate}>
            Created: {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className={styles.orderHeaderRight}>
          <div className={styles.statusContainer}>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={updatingStatus}
              className={styles.statusSelect}
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="ITEMS_ADDED">Items Added</option>
              <option value="SHIPPED" disabled={!canShip}>
                {!canShip ? 'Shipped (Requires Payment)' : 'Shipped'}
              </option>
              <option value="DELIVERED" disabled={!canShip}>
                {!canShip ? 'Delivered (Requires Payment)' : 'Delivered'}
              </option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <button
            className={styles.expandBtn}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼' : '▶'} Details
          </button>
        </div>
      </div>

      {/* Quick Summary */}
      <div className={styles.orderSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Items:</span>
          <span className={styles.summaryValue}>{order.items?.length || 0}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Value:</span>
          <span className={styles.summaryValue}>
            ${order.totalValue ? order.totalValue.toFixed(2) : '0.00'}
          </span>
        </div>
        {order.trackingNumber && (
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Tracking:</span>
            <span className={styles.summaryValue}>{order.trackingNumber}</span>
          </div>
        )}
        {!canShip && (
          <div className={styles.shippingWarning}>
            ⚠️ Subscription must be PAID or COMPLIMENTARY to ship
          </div>
        )}
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className={styles.orderDetails}>
          <div className={styles.detailsSection}>
            <h5>Order Information</h5>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Order ID:</span>
                <span className={styles.detailValue}>{order.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Created:</span>
                <span className={styles.detailValue}>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              {order.shippedAt && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Shipped:</span>
                  <span className={styles.detailValue}>
                    {new Date(order.shippedAt).toLocaleString()}
                  </span>
                </div>
              )}
              {order.deliveredAt && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Delivered:</span>
                  <span className={styles.detailValue}>
                    {new Date(order.deliveredAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items Section */}
          <div className={styles.itemsSection}>
            <div className={styles.itemsHeader}>
              <h5>Order Items ({order.items?.length || 0})</h5>
              <div className={styles.itemActions}>
                <button
                  className={styles.addProductBtn}
                  onClick={() => setShowAddProduct(true)}
                  title="Add products from catalog"
                >
                  + Add Products
                </button>
                <button
                  className={styles.addTemplateBtn}
                  onClick={() => setShowAddTemplate(true)}
                  title="Apply a pre-created template"
                >
                  📋 Apply Template
                </button>
              </div>
            </div>

            <div className={styles.itemsList}>
              {order.items?.length === 0 ? (
                <div className={styles.emptyItems}>
                  <p>No items in this order yet</p>
                  <p>Use the buttons above to add products or apply a template</p>
                </div>
              ) : (
                order.items.map(item => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.itemName}</div>
                      {item.description && (
                        <div className={styles.itemDescription}>{item.description}</div>
                      )}
                      <div className={styles.itemMeta}>
                        {item.category && <span className={styles.itemCategory}>{item.category}</span>}
                        {item.quantity && <span className={styles.itemQuantity}>Qty: {item.quantity}</span>}
                        {item.unitValue && <span className={styles.itemValue}>${item.unitValue}</span>}
                      </div>
                    </div>
                    <button
                      className={styles.removeItemBtn}
                      onClick={() => removeItem(item.id)}
                      title="Remove this item"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Actions */}
      <div className={styles.orderActions}>
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

      {/* Add Product Modal */}
      {showAddProduct && (
        <ProductSearchModal
          orderId={order.id}
          onClose={() => setShowAddProduct(false)}
          onRefresh={onRefresh}
        />
      )}

      {/* Add Template Modal */}
      {showAddTemplate && (
        <TemplateApplyModal
          orderId={order.id}
          onClose={() => setShowAddTemplate(false)}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}
