import React, { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import styles from './ProductSearchModal.module.css';

const ProductSearchModal = ({ orderId, onClose, onRefresh }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px';

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      const queryParams = new URLSearchParams({
        search: searchTerm,
        category: categoryFilter,
        limit: '50'
      }).toString();

      const response = await fetch(getApiEndpoint(`/api/products/admin/products?${queryParams}`), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (product) => {
    setSelectedProducts(prev => {
      const isSelected = prev.find(p => p.id === product.id);
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, quantity: Math.max(1, Math.min(quantity, p.stockQuantity || 99)) } : p)
    );
  };

  const addSelectedProducts = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setAdding(true);
      const token = localStorage.getItem('adminToken');

      for (const product of selectedProducts) {
        const itemData = {
          itemName: product.name,
          description: `${product.brand || ''} - ${product.color || ''} ${product.size || ''}`.trim(),
          category: product.category?.name || 'Product',
          quantity: product.quantity,
          unitValue: product.price
        };

        await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${orderId}/items`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(itemData)
        });
      }

      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error adding products:', error);
      alert('Failed to add products to order');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Add Products to Order</h3>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          {/* Left Sidebar */}
          <div className={styles.searchSection}>
            <div className={styles.searchFilters}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={styles.categorySelect}
              >
                <option value="">All Categories</option>
                <option value="CLOTHING">Clothing</option>
                <option value="ACCESSORIES">Accessories</option>
                <option value="SHOES">Shoes</option>
                <option value="JEWELRY">Jewelry</option>
                <option value="BAGS">Bags</option>
              </select>
            </div>

            {selectedProducts.length > 0 && (
              <div className={styles.selectedSection}>
                <div className={styles.selectedProductHeader}>
                  <h4>Selected Products ({selectedProducts.length})</h4>
                </div>
                {selectedProducts.map(product => (
                  <div key={product.id} className={styles.selectedProduct}>
                    <div className={styles.selectedProductHeader}>
                      <span className={styles.selectedProductName}>{product.name}</span>
                      <span className={styles.selectedProductPrice}>${product.price}</span>
                    </div>
                    <div className={styles.quantityControl}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className={styles.quantityInput}
                        value={product.quantity}
                        onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                        min="1"
                        max={product.stockQuantity || 99}
                      />
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                        disabled={product.quantity >= (product.stockQuantity || 99)}
                      >
                        +
                      </button>
                      <button
                        className={styles.quantityButton}
                        onClick={() => toggleProductSelection(product)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Content Area */}
          <div className={styles.productsContainer}>
            {loading ? (
              <div className={styles.loading}>Loading products...</div>
            ) : (
              <div className={styles.productsList}>
                {products.map(product => {
                  const isSelected = selectedProducts.find(p => p.id === product.id);
                  return (
                    <div
                      key={product.id}
                      className={`${styles.productCard} ${isSelected ? styles.selected : ''}`}
                      onClick={() => toggleProductSelection(product)}
                    >
                      <div className={styles.productHeader}>
                        <h5>{product.name}</h5>
                        <span className={styles.price}>${product.price}</span>
                      </div>
                      <div className={styles.productDetails}>
                        {product.brand && <span>Brand: {product.brand}</span>}
                        {product.category?.name && <span>Category: {product.category.name}</span>}
                        {product.color && <span>Color: {product.color}</span>}
                        {product.size && <span>Size: {product.size}</span>}
                        <span className={styles.productStock}>
                          Stock: {product.stockQuantity || 0}
                        </span>
                      </div>
                      {isSelected && <div className={styles.selectedBadge}>Selected</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <div className={styles.footerInfo}>
            <span>
              {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
            </span>
            {selectedProducts.length > 0 && (
              <span>
                Total: ${selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
              </span>
            )}
          </div>
          <div className={styles.footerActions}>
            <button
              className={styles.addButton}
              onClick={addSelectedProducts}
              disabled={selectedProducts.length === 0 || adding}
            >
              {adding ? '⏳ Adding...' : `✓ Add ${selectedProducts.length} Product${selectedProducts.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchModal;
