"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiEndpoint } from "@/lib/config";
import styles from "@/components/AdminDashboard/LeModeCoTab/ProductSearchModal.module.css";

export default function AddProductsToOrderPage({ params }) {
  const router = useRouter();
  const { orderId } = params || {};

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const queryParams = new URLSearchParams({
        search: searchTerm,
        category: categoryFilter,
        limit: "50",
      }).toString();

      const res = await fetch(
        getApiEndpoint(`/api/products/admin/products?${queryParams}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.find((p) => p.id === product.id);
      if (isSelected) return prev.filter((p) => p.id !== product.id);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, quantity: Math.max(1, Math.min(quantity, p.stockQuantity || 99)) }
          : p
      )
    );
  };

  const addSelectedProducts = async () => {
    if (!orderId || selectedProducts.length === 0) return;

    try {
      setAdding(true);
      const token = localStorage.getItem("adminToken");

      for (const product of selectedProducts) {
        const itemData = {
          itemName: product.name,
          description: `${product.brand || ""} - ${product.color || ""} ${product.size || ""}`.trim(),
          category: product.category?.name || "Product",
          quantity: product.quantity,
          unitValue: product.price,
        };

        await fetch(getApiEndpoint(`/api/le-mode-co/admin/orders/${orderId}/items`), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        });
      }

      // Redirect explicitly to Le-Mode-Co → Orders tab
      router.push('/admin/dashboard#le-mode-co-orders');
    } catch (error) {
      console.error("Error adding products:", error);
      alert("Failed to add products to order");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div className={styles.modalHeader} style={{ borderRadius: 16 }}>
        <h3 style={{ margin: 0 }}>Add Products to Order #{orderId}</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <button className={styles.cancelButton} onClick={() => router.back()}>
            ← Back
          </button>
        </div>
      </div>

      <div className={styles.modalBody} style={{ minHeight: "70vh" }}>
        {/* Left Sidebar */}
        <div className={styles.searchSection}>
          {/* <div className={styles.searchFilters}> */}
            {/* <input
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
          </div> */}

          {selectedProducts.length > 0 && (
            <div className={styles.selectedSection}>
              <div className={styles.selectedProductHeader}>
                <h4>Selected Products ({selectedProducts.length})</h4>
              </div>
              {selectedProducts.map((product) => (
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
              {products.map((product) => {
                const isSelected = selectedProducts.find((p) => p.id === product.id);
                return (
                  <div
                    key={product.id}
                    className={`${styles.productCard} ${isSelected ? styles.selected : ""}`}
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
                      <span className={styles.productStock}>Stock: {product.stockQuantity || 0}</span>
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
            {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
          </span>
          {selectedProducts.length > 0 && (
            <span>
              Total: $
              {selectedProducts
                .reduce((sum, p) => sum + p.price * p.quantity, 0)
                .toFixed(2)}
            </span>
          )}
        </div>
        <div className={styles.footerActions}>
          <button className={styles.cancelButton} onClick={() => router.back()}>
            ✕ Cancel
          </button>
          <button
            className={styles.addButton}
            onClick={addSelectedProducts}
            disabled={selectedProducts.length === 0 || adding}
          >
            {adding
              ? "⏳ Adding..."
              : `✓ Add ${selectedProducts.length} Product${selectedProducts.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

