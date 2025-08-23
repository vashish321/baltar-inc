'use client';
import { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import styles from './ProductManagement.module.css';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    search: '',
    page: 1
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const queryParams = new URLSearchParams(filters).toString();
      
      const response = await fetch(getApiEndpoint(`/api/products/admin/products?${queryParams}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className={styles.productManagement}>
      <div className={styles.header}>
        <h3>Product Catalog</h3>
        <button 
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          + Add Product
        </button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className={styles.searchInput}
        />
        
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
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

        <input
          type="text"
          placeholder="Filter by brand..."
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className={styles.brandInput}
        />
      </div>

      <div className={styles.productsGrid}>
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onEdit={setEditingProduct}
            onRefresh={fetchProducts}
          />
        ))}
      </div>

      {showCreateModal && (
        <ProductModal
          onClose={() => setShowCreateModal(false)}
          onRefresh={fetchProducts}
        />
      )}

      {editingProduct && (
        <ProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onRefresh={fetchProducts}
        />
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onEdit, onRefresh }) {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];

  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(getApiEndpoint(`/api/products/admin/products/${product.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !product.isActive })
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  return (
    <div className={`${styles.productCard} ${!product.isActive ? styles.inactive : ''}`}>
      <div className={styles.productImage}>
        {primaryImage ? (
          <img src={primaryImage.imageUrl} alt={product.name} />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <h4>{product.name}</h4>
        <p className={styles.brand}>{product.brand}</p>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>${product.price}</p>
        <p className={styles.stock}>Stock: {product.stockQuantity}</p>
      </div>

      <div className={styles.productActions}>
        <button 
          className={styles.editBtn}
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
        <button 
          className={`${styles.toggleBtn} ${product.isActive ? styles.active : styles.inactive}`}
          onClick={handleToggleStatus}
        >
          {product.isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal({ product, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'CLOTHING',
    brand: product?.brand || '',
    color: product?.color || '',
    size: product?.size || '',
    price: product?.price || '',
    sku: product?.sku || '',
    stockQuantity: product?.stockQuantity || 0
  });
  
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      // Add product data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const url = product 
        ? getApiEndpoint(`/api/products/admin/products/${product.id}`)
        : getApiEndpoint('/api/products/admin/products');
      
      const method = product ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });

      if (response.ok) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              />
            </div>
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
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="CLOTHING">Clothing</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="SHOES">Shoes</option>
                <option value="JEWELRY">Jewelry</option>
                <option value="BAGS">Bags</option>
                <option value="OUTERWEAR">Outerwear</option>
                <option value="ACTIVEWEAR">Activewear</option>
                <option value="LINGERIE">Lingerie</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
              >
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="XXXL">XXXL</option>
                <option value="ONE_SIZE">One Size</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Price ($) *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            <p className={styles.fileHint}>Select multiple images (max 10)</p>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={uploading}>
              {uploading ? 'Saving...' : (product ? 'Update' : 'Create')} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
