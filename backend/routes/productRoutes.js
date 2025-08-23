const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProductService = require('../services/productService');
const AuthService = require('../services/authService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Admin Routes (require authentication)

// Get all products
router.get('/admin/products', AuthService.requireAuth, async (req, res) => {
  try {
    const filters = req.query;
    const result = await ProductService.getAllProducts(filters);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      error: 'Failed to fetch products',
      details: error.message
    });
  }
});

// Get product by ID
router.get('/admin/products/:productId', AuthService.requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await ProductService.getProductById(productId);
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      error: 'Failed to fetch product',
      details: error.message
    });
  }
});

// Create new product
router.post('/admin/products', AuthService.requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    const productData = req.body;
    const imageFiles = req.files || [];
    
    const product = await ProductService.createProduct(productData, imageFiles);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      error: 'Failed to create product',
      details: error.message
    });
  }
});

// Update product
router.put('/admin/products/:productId', AuthService.requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    
    const product = await ProductService.updateProduct(productId, updateData);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      error: 'Failed to update product',
      details: error.message
    });
  }
});

// Delete product
router.delete('/admin/products/:productId', AuthService.requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const result = await ProductService.deleteProduct(productId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      error: 'Failed to delete product',
      details: error.message
    });
  }
});

// Upload additional images to existing product
router.post('/admin/products/:productId/images', AuthService.requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    const { productId } = req.params;
    const imageFiles = req.files || [];
    
    if (imageFiles.length === 0) {
      return res.status(400).json({
        error: 'No images provided'
      });
    }
    
    const images = await ProductService.uploadProductImages(productId, imageFiles);
    
    res.status(201).json({
      success: true,
      message: 'Images uploaded successfully',
      images
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      error: 'Failed to upload images',
      details: error.message
    });
  }
});

// Delete product image
router.delete('/admin/products/images/:imageId', AuthService.requireAuth, async (req, res) => {
  try {
    const { imageId } = req.params;
    
    const result = await ProductService.deleteProductImage(imageId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      error: 'Failed to delete image',
      details: error.message
    });
  }
});

// Update image order
router.put('/admin/products/:productId/images/order', AuthService.requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageOrders } = req.body;
    
    const result = await ProductService.updateImageOrder(productId, imageOrders);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error updating image order:', error);
    res.status(500).json({
      error: 'Failed to update image order',
      details: error.message
    });
  }
});

// Get product categories
router.get('/admin/products/meta/categories', AuthService.requireAuth, async (req, res) => {
  try {
    const categories = await ProductService.getProductCategories();
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      details: error.message
    });
  }
});

// Get product brands
router.get('/admin/products/meta/brands', AuthService.requireAuth, async (req, res) => {
  try {
    const brands = await ProductService.getProductBrands();
    
    res.json({
      success: true,
      brands
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      error: 'Failed to fetch brands',
      details: error.message
    });
  }
});

// Search products for order management
router.get('/admin/products/search', AuthService.requireAuth, async (req, res) => {
  try {
    const { q: searchTerm, category, limit } = req.query;
    
    const products = await ProductService.searchProductsForOrder(searchTerm, {
      category,
      limit
    });
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      error: 'Failed to search products',
      details: error.message
    });
  }
});

// Update stock quantity
router.put('/admin/products/:productId/stock', AuthService.requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, operation = 'set' } = req.body;
    
    const product = await ProductService.updateStock(productId, quantity, operation);
    
    res.json({
      success: true,
      message: 'Stock updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      error: 'Failed to update stock',
      details: error.message
    });
  }
});

module.exports = router;
