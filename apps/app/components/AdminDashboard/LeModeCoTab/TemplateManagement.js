'use client';
import { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import styles from './TemplateManagement.module.css';

export default function TemplateManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [filters, setFilters] = useState({
    templateType: '',
    packageTier: '',
    season: '',
    page: 1
  });

  useEffect(() => {
    fetchTemplates();
  }, [filters]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams(filters).toString();
      
      const response = await fetch(getApiEndpoint(`/api/le-mode-co/admin/templates?${queryParams}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading templates...</p>
      </div>
    );
  }

  return (
    <div className={styles.templateManagement}>
      <div className={styles.header}>
        <h3>Order Templates</h3>
        <button 
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          + Create Template
        </button>
      </div>

      <div className={styles.filters}>
        <select
          value={filters.templateType}
          onChange={(e) => handleFilterChange('templateType', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Types</option>
          <option value="SUBSCRIPTION_TIER">Subscription Tier</option>
          <option value="SEASONAL">Seasonal</option>
          <option value="PREFERENCE_BASED">Preference Based</option>
          <option value="CUSTOM">Custom</option>
        </select>

        <select
          value={filters.packageTier}
          onChange={(e) => handleFilterChange('packageTier', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Packages</option>
          <option value="Essentials Box">Essentials Box</option>
          <option value="Luxury Box">Luxury Box</option>
          <option value="Bespoke Box">Bespoke Box</option>
          <option value="Platinum Box">Platinum Box</option>
        </select>

        <select
          value={filters.season}
          onChange={(e) => handleFilterChange('season', e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Seasons</option>
          <option value="SPRING_SUMMER">Spring/Summer</option>
          <option value="FALL_WINTER">Fall/Winter</option>
          <option value="ALL_SEASON">All Season</option>
        </select>
      </div>

      <div className={styles.templatesGrid}>
        {templates.map(template => (
          <TemplateCard 
            key={template.id}
            template={template}
            onEdit={setEditingTemplate}
            onRefresh={fetchTemplates}
          />
        ))}
      </div>

      {showCreateModal && (
        <TemplateModal
          onClose={() => setShowCreateModal(false)}
          onRefresh={fetchTemplates}
        />
      )}

      {editingTemplate && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => setEditingTemplate(null)}
          onRefresh={fetchTemplates}
        />
      )}
    </div>
  );
}

// Template Card Component
function TemplateCard({ template, onEdit, onRefresh }) {
  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/templates/${template.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !template.isActive })
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating template status:', error);
    }
  };

  const handleDuplicate = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/le-mode-co/admin/templates/${template.id}/duplicate`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newName: `${template.name} (Copy)` })
      });
      onRefresh();
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  return (
    <div className={`${styles.templateCard} ${!template.isActive ? styles.inactive : ''}`}>
      <div className={styles.templateHeader}>
        <h4>{template.name}</h4>
        <div className={styles.templateMeta}>
          <span className={styles.templateType}>{template.templateType}</span>
          {template.packageTier && <span className={styles.packageTier}>{template.packageTier}</span>}
          {template.season && <span className={styles.season}>{template.season}</span>}
        </div>
      </div>
      
      <div className={styles.templateDescription}>
        {template.description}
      </div>

      <div className={styles.templateItems}>
        <h5>Items ({template.items.length})</h5>
        <div className={styles.itemsPreview}>
          {template.items.slice(0, 3).map(item => (
            <div key={item.id} className={styles.itemPreview}>
              {item.product.images?.[0] && (
                <img src={item.product.images[0].imageUrl} alt={item.product.name} />
              )}
              <span>{item.product.name}</span>
            </div>
          ))}
          {template.items.length > 3 && (
            <div className={styles.moreItems}>+{template.items.length - 3} more</div>
          )}
        </div>
      </div>

      <div className={styles.templateActions}>
        <button 
          className={styles.editBtn}
          onClick={() => onEdit(template)}
        >
          Edit
        </button>
        <button 
          className={styles.duplicateBtn}
          onClick={handleDuplicate}
        >
          Duplicate
        </button>
        <button 
          className={`${styles.toggleBtn} ${template.isActive ? styles.active : styles.inactive}`}
          onClick={handleToggleStatus}
        >
          {template.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}

// Enhanced Template Modal Component
function TemplateModal({ template, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    templateType: template?.templateType || 'CUSTOM',
    packageTier: template?.packageTier || '',
    season: template?.season || '',
    preference: template?.preference || ''
  });

  const [selectedProducts, setSelectedProducts] = useState(template?.items || []);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productFilters, setProductFilters] = useState({
    category: '',
    brand: ''
  });
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableProducts();
  }, [productSearch, productFilters]);

  const fetchAvailableProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams({
        search: productSearch,
        category: productFilters.category,
        brand: productFilters.brand,
        isActive: 'true',
        limit: '20'
      }).toString();

      const response = await fetch(getApiEndpoint(`/api/products/admin/products?${queryParams}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      if (result.success) {
        // Filter out products that are already selected
        const selectedProductIds = selectedProducts.map(item =>
          item.product?.id || item.productId
        );
        const filteredProducts = result.products.filter(product =>
          !selectedProductIds.includes(product.id) && product.stockQuantity > 0
        );
        setAvailableProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (product) => {
    const newItem = {
      productId: product.id,
      product: product,
      quantity: 1,
      notes: ''
    };
    setSelectedProducts(prev => [...prev, newItem]);
    setAvailableProducts(prev => prev.filter(p => p.id !== product.id));
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(item =>
      (item.product?.id || item.productId) !== productId
    ));
    fetchAvailableProducts(); // Refresh available products
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(prev => prev.map(item =>
      (item.product?.id || item.productId) === productId
        ? { ...item, quantity: parseInt(quantity) }
        : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const templateData = {
        ...formData,
        items: selectedProducts.map(item => ({
          productId: item.product?.id || item.productId,
          quantity: item.quantity,
          notes: item.notes
        }))
      };

      const url = template
        ? getApiEndpoint(`/api/le-mode-co/admin/templates/${template.id}`)
        : getApiEndpoint('/api/le-mode-co/admin/templates');

      const method = template ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(templateData)
      });

      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{template ? 'Edit Template' : 'Create Template'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Template Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Template Type *</label>
              <select
                name="templateType"
                value={formData.templateType}
                onChange={handleInputChange}
                required
              >
                <option value="SUBSCRIPTION_TIER">Subscription Tier</option>
                <option value="SEASONAL">Seasonal</option>
                <option value="PREFERENCE_BASED">Preference Based</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Package Tier</label>
              <select
                name="packageTier"
                value={formData.packageTier}
                onChange={handleInputChange}
              >
                <option value="">Select Package</option>
                <option value="Essentials Box">Essentials Box</option>
                <option value="Luxury Box">Luxury Box</option>
                <option value="Bespoke Box">Bespoke Box</option>
                <option value="Platinum Box">Platinum Box</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Season</label>
              <select
                name="season"
                value={formData.season}
                onChange={handleInputChange}
              >
                <option value="">Select Season</option>
                <option value="SPRING_SUMMER">Spring/Summer</option>
                <option value="FALL_WINTER">Fall/Winter</option>
                <option value="ALL_SEASON">All Season</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Customer Preference</label>
              <select
                name="preference"
                value={formData.preference}
                onChange={handleInputChange}
              >
                <option value="">Select Preference</option>
                <option value="CASUAL">Casual</option>
                <option value="FORMAL">Formal</option>
                <option value="TRENDY">Trendy</option>
                <option value="CLASSIC">Classic</option>
                <option value="BOHEMIAN">Bohemian</option>
                <option value="MINIMALIST">Minimalist</option>
                <option value="EDGY">Edgy</option>
                <option value="ROMANTIC">Romantic</option>
              </select>
            </div>
          </div>

          {/* Product Selection Section */}
          <div className={styles.productSection}>
            <div className={styles.sectionHeader}>
              <h4>Template Products ({selectedProducts.length})</h4>
              <button
                type="button"
                className={styles.addProductBtn}
                onClick={() => setShowProductSelector(!showProductSelector)}
              >
                {showProductSelector ? 'Hide Products' : '+ Add Products'}
              </button>
            </div>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className={styles.selectedProducts}>
                {selectedProducts.map((item, index) => {
                  const product = item.product || item;
                  return (
                    <div key={product.id || index} className={styles.selectedProduct}>
                      <div className={styles.productImage}>
                        {product.images?.[0] ? (
                          <img src={product.images[0].imageUrl} alt={product.name} />
                        ) : (
                          <div className={styles.noImage}>No Image</div>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <h5>{product.name}</h5>
                        <p>{product.brand} - {product.category}</p>
                        <p className={styles.price}>${product.price}</p>
                      </div>
                      <div className={styles.quantityControl}>
                        <label>Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.removeProductBtn}
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Product Selector */}
            {showProductSelector && (
              <div className={styles.productSelector}>
                <div className={styles.productFilters}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className={styles.searchInput}
                  />
                  <select
                    value={productFilters.category}
                    onChange={(e) => setProductFilters(prev => ({ ...prev, category: e.target.value }))}
                    className={styles.filterSelect}
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

                <div className={styles.availableProducts}>
                  {availableProducts.map(product => (
                    <div key={product.id} className={styles.availableProduct}>
                      <div className={styles.productImage}>
                        {product.images?.[0] ? (
                          <img src={product.images[0].imageUrl} alt={product.name} />
                        ) : (
                          <div className={styles.noImage}>No Image</div>
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <h5>{product.name}</h5>
                        <p>{product.brand} - {product.category}</p>
                        <p className={styles.price}>${product.price}</p>
                        <p className={styles.stock}>Stock: {product.stockQuantity}</p>
                      </div>
                      <button
                        type="button"
                        className={styles.addBtn}
                        onClick={() => handleAddProduct(product)}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                  {availableProducts.length === 0 && (
                    <div className={styles.noProducts}>
                      No available products found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : (template ? 'Update' : 'Create')} Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
