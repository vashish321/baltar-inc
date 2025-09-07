'use client';

import styles from './lookbookSection.module.css';
import { useState, useEffect } from 'react';

export default function LookbookSection() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/le-mode-co/lookbook/categories');
        const data = await response.json();

        if (data.success) {
          setCategories(data.categories);
          // Set first category as active by default
          if (data.categories.length > 0) {
            setActiveCategory(data.categories[0].name);
          }
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    if (activeCategory) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/le-mode-co/lookbook/products?category=${encodeURIComponent(activeCategory)}`);
          const data = await response.json();

          if (data.success) {
            setProducts(data.products);
          } else {
            setError('Failed to load products');
          }
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Failed to load products');
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [activeCategory]);

  if (error) {
    return (
      <section className={styles.lookbookSection}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.lookbookSection}>
      <div className={styles.categories}>
        {loading && categories.length === 0 ? (
          <div className={styles.loading}>Loading categories...</div>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${activeCategory === category.name ? styles.active : ''}`}
              onClick={() => setActiveCategory(category.name)}
            >
              ↗ {category.name}
            </button>
          ))
        )}
      </div>

      {activeCategory && (
        <div className={styles.gallery}>
          {loading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={styles.productItem}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].imageUrl}
                    alt={product.name}
                    className={styles.galleryImage}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg'; // Fallback image
                    }}
                  />
                ) : (
                  <div className={styles.noImage}>
                    <span>No Image</span>
                  </div>
                )}
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{product.name}</div>
                  {product.category && (
                    <div className={styles.productCategory}>{product.category.name}</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noProducts}>
              <p>No products found in this category.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
