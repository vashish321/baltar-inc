'use client';
import { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import styles from './EnhancedOrderManagement.module.css';

export default function EnhancedOrderManagement({ selectedSubscription }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(null);
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
      ) : (
        <div className={styles.ordersGrid}>
          {orders.map(order => (
            <EnhancedOrderCard 
              key={order.id}
              order={order}
              onRefresh={fetchOrders}
              onShowProductSearch={setShowProductSearch}
              onShowStatusModal={setShowStatusModal}
              onShowTemplateModal={setShowTemplateModal}
            />
          ))}
        </div>
      )}

      {showProductSearch && (
        <ProductSearchModal
          orderId={showProductSearch}
          onClose={() => setShowProductSearch(null)}
          onRefresh={fetchOrders}
        />
      )}

      {showStatusModal && (
        <StatusUpdateModal
          order={showStatusModal}
          onClose={() => setShowStatusModal(null)}
          onRefresh={fetchOrders}
        />
      )}

      {showTemplateModal && (
        <TemplateSelectionModal
          orderId={showTemplateModal}
          packageTier={selectedSubscription.package.name}
          onClose={() => setShowTemplateModal(null)}
          onRefresh={fetchOrders}
        />
      )}
    </div>
  );
}

// Enhanced Order Card Component
function EnhancedOrderCard({ order, onRefresh, onShowProductSearch, onShowStatusModal, onShowTemplateModal }) {
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
        <h4>{new Date(order.orderMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
        <div className={styles.statusContainer}>
          <span 
            className={styles.statusBadge}
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {order.status}
          </span>
          <button 
            className={styles.statusBtn}
            onClick={() => onShowStatusModal(order)}
          >
            Update Status
          </button>
        </div>
      </div>

      <div className={styles.orderMeta}>
        <div className={styles.orderMetaRow}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Total Value:</span>
            <span className={styles.metaValue}>
              ${order.totalValue ? order.totalValue.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Items:</span>
            <span className={styles.metaValue}>{order.items.length}</span>
          </div>
        </div>

        {order.trackingNumber && (
          <div className={styles.orderMetaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Tracking:</span>
              <span className={styles.metaValue}>{order.trackingNumber}</span>
            </div>
          </div>
        )}

        {order.shippedAt && (
          <div className={styles.orderMetaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Shipped:</span>
              <span className={styles.metaValue}>
                {new Date(order.shippedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {order.deliveredAt && (
          <div className={styles.orderMetaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Delivered:</span>
              <span className={styles.metaValue}>
                {new Date(order.deliveredAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.orderItems}>
        <div className={styles.itemsHeader}>
          <h5>Items ({order.items.length})</h5>
          <div className={styles.itemActions}>
            <div className={styles.actionGroup}>
              <span className={styles.actionLabel}>Quick Fill:</span>
              <button
                className={styles.templateBtn}
                onClick={() => onShowTemplateModal(order.id)}
                title="Apply a pre-created template to populate this order"
              >
                📋 Apply Template
              </button>
            </div>
            <div className={styles.actionGroup}>
              <span className={styles.actionLabel}>Manual:</span>
              <button
                className={styles.addItemBtn}
                onClick={() => onShowProductSearch(order.id)}
                title="Manually add individual products from catalog"
              >
                🛍️ Add Products
              </button>
            </div>
          </div>
        </div>

        {order.items.map(item => (
          <OrderItemCard 
            key={item.id} 
            item={item} 
            onRefresh={onRefresh}
          />
        ))}
      </div>

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
    </div>
  );
}

// Order Item Card Component
function OrderItemCard({ item, onRefresh }) {
  const handleRemoveItem = async () => {
    if (!confirm('Are you sure you want to remove this item?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/items/${item.id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onRefresh();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const primaryImage = item.product?.images?.[0];

  return (
    <div className={styles.orderItem}>
      <div className={styles.itemImage}>
        {primaryImage ? (
          <img src={primaryImage.imageUrl} alt={item.itemName} />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      
      <div className={styles.itemInfo}>
        <strong>{item.itemName}</strong>
        {item.description && <p>{item.description}</p>}
        <div className={styles.itemMeta}>
          {item.category && <span className={styles.categoryTag}>{item.category}</span>}
          {item.quantity > 1 && <span className={styles.quantity}>Qty: {item.quantity}</span>}
          {item.unitValue && <span className={styles.value}>${item.unitValue}</span>}
        </div>
      </div>

      <button 
        className={styles.removeBtn}
        onClick={handleRemoveItem}
        title="Remove item"
      >
        ×
      </button>
    </div>
  );
}

// Product Search Modal Component
function ProductSearchModal({ orderId, onClose, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');

  // Load all products on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      // Use the main products API with search and filter parameters
      const queryParams = new URLSearchParams({
        search: searchTerm,
        category: categoryFilter,
        isActive: 'true',
        limit: '50' // Show more products for browsing
      }).toString();

      const response = await fetch(
        getApiEndpoint(`/api/products/admin/products?${queryParams}`),
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const result = await response.json();
      if (result.success) {
        setProducts(result.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedProduct) return;

    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${orderId}/products`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity
        })
      });
      
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error adding product to order:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Add Product to Order</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalContent}>
          <div className={styles.searchSection}>
            <div className={styles.searchFilters}>
              <input
                type="text"
                placeholder="Search products by name, brand, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={styles.categoryFilter}
              >
                <option value="">All Categories</option>
                <option value="CLOTHING">Clothing</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="SHOES">Shoes</option>
                <option value="JEWELRY">Jewelry</option>
                <option value="BAGS">Bags</option>
                <option value="OUTERWEAR">Outerwear</option>
              </select>
            </div>
            <p className={styles.searchHint}>
              {searchTerm || categoryFilter ?
                `Showing filtered results (${products.length} products)` :
                `Browse all products (${products.length} available)`
              }
            </p>
          </div>

          {loading && <div className={styles.loading}>Loading products...</div>}

          <div className={styles.productsList}>
            {products.length === 0 && !loading ? (
              <div className={styles.noProducts}>
                {searchTerm || categoryFilter ?
                  'No products found matching your criteria.' :
                  'No products available.'
                }
              </div>
            ) : (
              products.map(product => (
                <div
                  key={product.id}
                  className={`${styles.productItem} ${selectedProduct?.id === product.id ? styles.selected : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className={styles.productImage}>
                    {product.images?.[0] ? (
                      <img src={product.images[0].imageUrl} alt={product.name} />
                    ) : (
                      <div className={styles.noImage}>No Image</div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h4>{product.name}</h4>
                    <p>{product.brand} - {product.category}</p>
                    <p className={styles.price}>${product.price}</p>
                    <p className={styles.stock}>Stock: {product.stockQuantity}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedProduct && (
            <div className={styles.selectionSection}>
              <h4>Selected: {selectedProduct.name}</h4>
              <div className={styles.quantitySection}>
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button 
            onClick={handleAddProduct} 
            className={styles.addBtn}
            disabled={!selectedProduct}
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );
}

// Status Update Modal Component
function StatusUpdateModal({ order, onClose, onRefresh }) {
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'ITEMS_ADDED', label: 'Items Added' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('adminToken');

      await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${order.id}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          notes,
          trackingNumber: status === 'SHIPPED' ? trackingNumber : undefined
        })
      });

      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Update Order Status</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label>Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.statusSelect}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {status === 'SHIPPED' && (
            <div className={styles.formGroup}>
              <label>Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this status change..."
              rows={3}
            />
          </div>

          <div className={styles.statusInfo}>
            <h4>Status Change Effects:</h4>
            <ul>
              {status === 'SHIPPED' && <li>Customer will receive shipping notification email</li>}
              {status === 'DELIVERED' && <li>Customer will receive delivery confirmation email</li>}
              {status === 'COMPLETED' && <li>Order will be marked as ready for notification</li>}
              {status === 'CANCELLED' && <li>Order will be cancelled and items returned to stock</li>}
            </ul>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
          <button
            onClick={handleUpdateStatus}
            className={styles.updateBtn}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Template Selection Modal Component
function TemplateSelectionModal({ orderId, packageTier, onClose, onRefresh }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        getApiEndpoint(`/api/le-mode-co/admin/templates/package/${encodeURIComponent(packageTier)}`),
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const result = await response.json();
      if (result.success) {
        setTemplates(result.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = async (templateId) => {
    if (!confirm('This will add all template items to the order. Continue?')) return;

    try {
      setApplying(true);
      const token = localStorage.getItem('adminToken');

      await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${orderId}/apply-template`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ templateId })
      });

      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error applying template:', error);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Apply Template to Order</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalContent}>
          {loading ? (
            <div className={styles.loading}>Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No templates available for {packageTier}</p>
            </div>
          ) : (
            <div className={styles.templatesList}>
              {templates.map(template => (
                <div key={template.id} className={styles.templateCard}>
                  <div className={styles.templateInfo}>
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                    <div className={styles.templateMeta}>
                      <span className={styles.templateType}>{template.templateType}</span>
                      {template.season && <span className={styles.season}>{template.season}</span>}
                      <span className={styles.itemCount}>{template.items.length} items</span>
                      <span className={styles.totalValue}>
                        ${template.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.templatePreview}>
                    <h5>Template Contents:</h5>
                    <div className={styles.templateItems}>
                      {template.items.map(item => (
                        <div key={item.id} className={styles.templateItem}>
                          <div className={styles.itemImage}>
                            {item.product.images?.[0] ? (
                              <img src={item.product.images[0].imageUrl} alt={item.product.name} />
                            ) : (
                              <div className={styles.noImage}>No Image</div>
                            )}
                          </div>
                          <div className={styles.itemDetails}>
                            <span className={styles.itemName}>{item.product.name}</span>
                            <span className={styles.itemBrand}>{item.product.brand}</span>
                            <span className={styles.itemPrice}>${item.product.price}</span>
                            {item.quantity > 1 && (
                              <span className={styles.itemQuantity}>Qty: {item.quantity}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.templateActions}>
                    <div className={styles.templateSummary}>
                      <span>{template.items.length} items</span>
                      <span>Total: ${template.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    <button
                      className={styles.applyBtn}
                      onClick={() => handleApplyTemplate(template.id)}
                      disabled={applying}
                    >
                      {applying ? 'Applying...' : 'Apply Template'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelBtn}>Close</button>
        </div>
      </div>
    </div>
  );
}
