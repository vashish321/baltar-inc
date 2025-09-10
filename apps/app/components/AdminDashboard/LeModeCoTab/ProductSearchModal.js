import React, { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/config';
import styles from './ProductSearchModal.module.css';

const ProductSearchModal = ({ orderId, onClose, onRefresh }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      // Build query parameters for search and filtering
      const queryParams = new URLSearchParams({
        search: searchTerm,
        category: '',
        brand: '',
        page: '1'
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      prev.map(p => p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p)
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
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Search products by name, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {selectedProducts.length > 0 && (
            <div className={styles.selectedSection}>
              <h4>Selected Products ({selectedProducts.length})</h4>
              <div className={styles.selectedProducts}>
                {selectedProducts.map(product => (
                  <div key={product.id} className={styles.selectedProduct}>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{product.name}</span>
                      <span className={styles.productPrice}>${product.price}</span>
                    </div>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.removeSelected}
                      onClick={() => toggleProductSelection(product)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.productsSection}>
            <h4>Available Products</h4>
            {loading ? (
              <div className={styles.loading}>Loading products...</div>
            ) : (
              <div className={styles.productsList}>
                {filteredProducts.map(product => {
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
                        {product.color && <span>Color: {product.color}</span>}
                        {product.size && <span>Size: {product.size}</span>}
                        {product.category && <span>Category: {product.category.name}</span>}
                      </div>
                      <div className={styles.productStock}>
                        Stock: {product.stockQuantity || 0}
                      </div>
                      {isSelected && (
                        <div className={styles.selectedBadge}>✓ Selected</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.addButton}
            onClick={addSelectedProducts}
            disabled={selectedProducts.length === 0 || adding}
          >
            {adding ? 'Adding...' : `Add ${selectedProducts.length} Product${selectedProducts.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchModal;
