const express = require('express');
const router = express.Router();
const LeModeCoService = require('../services/leModeCoService');
const OrderManagementService = require('../services/orderManagementService');
const TemplateService = require('../services/templateService');
const AuthService = require('../services/authService');
const EmailService = require('../services/emailService');

// Public Routes (for customers)

// Get all active packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await LeModeCoService.getAllPackages(false);

    res.json({
      success: true,
      packages
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      error: 'Failed to fetch packages',
      details: error.message
    });
  }
});

// Get products for lookbook (public endpoint)
router.get('/lookbook/products', async (req, res) => {
  try {
    const { category } = req.query;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const where = {
      isActive: true
    };

    if (category) {
      // Support both category ID and category name
      if (category.length > 10) { // Assume it's a CUID if longer than 10 chars
        where.categoryId = category;
      } else {
        where.category = {
          name: category.toUpperCase()
        };
      }
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            sortOrder: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    await prisma.$disconnect();

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching lookbook products:', error);
    res.status(500).json({
      error: 'Failed to fetch lookbook products',
      details: error.message
    });
  }
});

// Get available categories for lookbook (public endpoint)
router.get('/lookbook/categories', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    await prisma.$disconnect();

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching lookbook categories:', error);
    res.status(500).json({
      error: 'Failed to fetch lookbook categories',
      details: error.message
    });
  }
});

// Create subscription
router.post('/subscribe', async (req, res) => {
  try {
    const { email, fullName, phone, zipCode, address, packageId } = req.body;

    // Validate required fields
    if (!email || !fullName || !phone || !zipCode || !address || !packageId) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Check if customer already has an active subscription
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const existingSubscription = await prisma.customerSubscription.findFirst({
      where: {
        email,
        status: { in: ['PENDING', 'PAID'] }
      }
    });

    if (existingSubscription) {
      return res.status(400).json({
        error: 'You already have an active or pending subscription'
      });
    }

    const subscription = await LeModeCoService.createSubscription({
      email,
      fullName,
      phone,
      zipCode,
      address,
      packageId
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      error: 'Failed to create subscription',
      details: error.message
    });
  }
});

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        error: 'Subscription ID is required'
      });
    }

    const paymentData = await LeModeCoService.createStripePaymentIntent(subscriptionId);

    res.json({
      success: true,
      ...paymentData
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      details: error.message
    });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Payment intent ID is required'
      });
    }

    const subscription = await LeModeCoService.confirmPayment(paymentIntentId);

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      subscription
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      error: 'Failed to confirm payment',
      details: error.message
    });
  }
});

// Admin Routes (require authentication)

// Get all packages (including inactive)
router.get('/admin/packages', AuthService.requireAuth, async (req, res) => {
  try {
    const packages = await LeModeCoService.getAllPackages(true);
    
    res.json({
      success: true,
      packages
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      error: 'Failed to fetch packages',
      details: error.message
    });
  }
});

// Create package
router.post('/admin/packages', AuthService.requireAuth, async (req, res) => {
  try {
    const packageData = req.body;
    const subscriptionPackage = await LeModeCoService.createPackage(packageData);

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package: subscriptionPackage
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({
      error: 'Failed to create package',
      details: error.message
    });
  }
});

// Update package
router.put('/admin/packages/:packageId', AuthService.requireAuth, async (req, res) => {
  try {
    const { packageId } = req.params;
    const updateData = req.body;
    
    const subscriptionPackage = await LeModeCoService.updatePackage(packageId, updateData);

    res.json({
      success: true,
      message: 'Package updated successfully',
      package: subscriptionPackage
    });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({
      error: 'Failed to update package',
      details: error.message
    });
  }
});

// Delete package
router.delete('/admin/packages/:packageId', AuthService.requireAuth, async (req, res) => {
  try {
    const { packageId } = req.params;
    
    const result = await LeModeCoService.deletePackage(packageId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({
      error: 'Failed to delete package',
      details: error.message
    });
  }
});

// Get all subscriptions
router.get('/admin/subscriptions', AuthService.requireAuth, async (req, res) => {
  try {
    const filters = req.query;
    const result = await LeModeCoService.getAllSubscriptions(filters);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      error: 'Failed to fetch subscriptions',
      details: error.message
    });
  }
});

// Get orders for a subscription
router.get('/admin/subscriptions/:subscriptionId/orders', AuthService.requireAuth, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const orders = await LeModeCoService.getOrdersBySubscription(subscriptionId);
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// Update subscription status
router.put('/admin/subscriptions/:subscriptionId/status', AuthService.requireAuth, async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'PAID', 'FAILED', 'COMPLIMENTARY', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid subscription status',
        validStatuses
      });
    }

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const updatedSubscription = await prisma.customerSubscription.update({
      where: { id: subscriptionId },
      data: { status },
      include: {
        package: true,
        order: {
          include: {
            items: true
          }
        }
      }
    });

    await prisma.$disconnect();

    res.json({
      success: true,
      subscription: updatedSubscription
    });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    res.status(500).json({
      error: 'Failed to update subscription status',
      details: error.message
    });
  }
});

// Create order for subscription
router.post('/admin/orders/create', AuthService.requireAuth, async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({
        error: 'Subscription ID is required'
      });
    }

    const order = await LeModeCoService.createSubscriptionOrder(subscriptionId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    });
  }
});

// Add item to order
router.post('/admin/orders/:orderId/items', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const itemData = req.body;

    const item = await LeModeCoService.addItemToOrder(orderId, itemData);

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      item
    });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({
      error: 'Failed to add item',
      details: error.message
    });
  }
});

// Remove item from order
router.delete('/admin/orders/items/:itemId', AuthService.requireAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const result = await LeModeCoService.removeItemFromOrder(itemId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({
      error: 'Failed to remove item',
      details: error.message
    });
  }
});

// Complete order
router.put('/admin/orders/:orderId/complete', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await LeModeCoService.completeOrder(orderId);
    
    res.json({
      success: true,
      message: 'Order completed successfully',
      order
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({
      error: 'Failed to complete order',
      details: error.message
    });
  }
});

// Notify customer
router.post('/admin/orders/:orderId/notify', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const notificationData = await LeModeCoService.notifyCustomer(orderId);
    
    // Send email notification
    const emailResult = await EmailService.sendLeModeCoOrderNotification(notificationData.emailData);
    
    res.json({
      success: true,
      message: 'Customer notified successfully',
      emailResult
    });
  } catch (error) {
    console.error('Error notifying customer:', error);
    res.status(500).json({
      error: 'Failed to notify customer',
      details: error.message
    });
  }
});

// Get dashboard statistics
router.get('/admin/dashboard-stats', AuthService.requireAuth, async (req, res) => {
  try {
    const stats = await LeModeCoService.getDashboardStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard stats',
      details: error.message
    });
  }
});

// Enhanced Order Management Routes

// Update order status
router.put('/admin/orders/:orderId/status', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes, trackingNumber } = req.body;
    const adminId = req.user?.id; // Assuming user info is available from auth middleware

    const order = await OrderManagementService.updateOrderStatus(
      orderId,
      status,
      adminId,
      notes,
      trackingNumber
    );

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      error: 'Failed to update order status',
      details: error.message
    });
  }
});

// Get order status history
router.get('/admin/orders/:orderId/status-history', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const history = await OrderManagementService.getOrderStatusHistory(orderId);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error fetching order status history:', error);
    res.status(500).json({
      error: 'Failed to fetch order status history',
      details: error.message
    });
  }
});

// Check if order can be shipped
router.get('/admin/orders/:orderId/shipping-eligibility', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const eligibility = await OrderManagementService.canOrderBeShipped(orderId);

    res.json({
      success: true,
      ...eligibility
    });
  } catch (error) {
    console.error('Error checking shipping eligibility:', error);
    res.status(500).json({
      error: 'Failed to check shipping eligibility',
      details: error.message
    });
  }
});

// Add product from catalog to order
router.post('/admin/orders/:orderId/products', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { productId, quantity, notes } = req.body;

    const orderItem = await OrderManagementService.addProductToOrder(
      orderId,
      productId,
      quantity,
      notes
    );

    res.status(201).json({
      success: true,
      message: 'Product added to order successfully',
      orderItem
    });
  } catch (error) {
    console.error('Error adding product to order:', error);
    res.status(500).json({
      error: 'Failed to add product to order',
      details: error.message
    });
  }
});

// Get orders with enhanced details
router.get('/admin/orders', AuthService.requireAuth, async (req, res) => {
  try {
    const filters = req.query;
    const result = await OrderManagementService.getOrdersWithDetails(filters);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// Send manual notification with enhanced tracking
router.post('/admin/orders/:orderId/notify-enhanced', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { customMessage } = req.body;
    const adminId = req.user?.id;

    const emailResult = await OrderManagementService.sendManualNotification(
      orderId,
      adminId,
      customMessage
    );

    res.json({
      success: true,
      message: 'Customer notified successfully',
      emailResult
    });
  } catch (error) {
    console.error('Error notifying customer:', error);
    res.status(500).json({
      error: 'Failed to notify customer',
      details: error.message
    });
  }
});

// Get notification history for an order
router.get('/admin/orders/:orderId/notifications', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const notifications = await OrderManagementService.getNotificationHistory(orderId);

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notification history:', error);
    res.status(500).json({
      error: 'Failed to fetch notification history',
      details: error.message
    });
  }
});

// Template Management Routes

// Get all templates
router.get('/admin/templates', AuthService.requireAuth, async (req, res) => {
  try {
    const filters = req.query;
    const result = await TemplateService.getAllTemplates(filters);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      error: 'Failed to fetch templates',
      details: error.message
    });
  }
});

// Get template by ID
router.get('/admin/templates/:templateId', AuthService.requireAuth, async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await TemplateService.getTemplateById(templateId);

    res.json({
      success: true,
      template
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({
      error: 'Failed to fetch template',
      details: error.message
    });
  }
});

// Create new template
router.post('/admin/templates', AuthService.requireAuth, async (req, res) => {
  try {
    const templateData = req.body;
    const adminId = req.user?.id;

    const template = await TemplateService.createTemplate(templateData, adminId);

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      error: 'Failed to create template',
      details: error.message
    });
  }
});

// Update template
router.put('/admin/templates/:templateId', AuthService.requireAuth, async (req, res) => {
  try {
    const { templateId } = req.params;
    const updateData = req.body;

    const template = await TemplateService.updateTemplate(templateId, updateData);

    res.json({
      success: true,
      message: 'Template updated successfully',
      template
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      error: 'Failed to update template',
      details: error.message
    });
  }
});

// Delete template
router.delete('/admin/templates/:templateId', AuthService.requireAuth, async (req, res) => {
  try {
    const { templateId } = req.params;

    const result = await TemplateService.deleteTemplate(templateId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({
      error: 'Failed to delete template',
      details: error.message
    });
  }
});

// Apply template to order
router.post('/admin/orders/:orderId/apply-template', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { templateId } = req.body;

    const result = await TemplateService.applyTemplateToOrder(templateId, orderId);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error applying template to order:', error);
    res.status(500).json({
      error: 'Failed to apply template to order',
      details: error.message
    });
  }
});

// Get templates by package
router.get('/admin/templates/package/:packageTier', AuthService.requireAuth, async (req, res) => {
  try {
    const { packageTier } = req.params;
    const templates = await TemplateService.getTemplatesByPackage(packageTier);

    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching templates by package:', error);
    res.status(500).json({
      error: 'Failed to fetch templates by package',
      details: error.message
    });
  }
});

// Get seasonal templates
router.get('/admin/templates/season/:season', AuthService.requireAuth, async (req, res) => {
  try {
    const { season } = req.params;
    const templates = await TemplateService.getSeasonalTemplates(season);

    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching seasonal templates:', error);
    res.status(500).json({
      error: 'Failed to fetch seasonal templates',
      details: error.message
    });
  }
});

// Create template from order
router.post('/admin/orders/:orderId/create-template', AuthService.requireAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const templateData = req.body;
    const adminId = req.user?.id;

    const template = await TemplateService.createTemplateFromOrder(orderId, templateData, adminId);

    res.status(201).json({
      success: true,
      message: 'Template created from order successfully',
      template
    });
  } catch (error) {
    console.error('Error creating template from order:', error);
    res.status(500).json({
      error: 'Failed to create template from order',
      details: error.message
    });
  }
});

// Duplicate template
router.post('/admin/templates/:templateId/duplicate', AuthService.requireAuth, async (req, res) => {
  try {
    const { templateId } = req.params;
    const { newName } = req.body;
    const adminId = req.user?.id;

    const template = await TemplateService.duplicateTemplate(templateId, newName, adminId);

    res.status(201).json({
      success: true,
      message: 'Template duplicated successfully',
      template
    });
  } catch (error) {
    console.error('Error duplicating template:', error);
    res.status(500).json({
      error: 'Failed to duplicate template',
      details: error.message
    });
  }
});

// Get template statistics
router.get('/admin/templates/meta/stats', AuthService.requireAuth, async (req, res) => {
  try {
    const stats = await TemplateService.getTemplateStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching template stats:', error);
    res.status(500).json({
      error: 'Failed to fetch template stats',
      details: error.message
    });
  }
});

// Category Management Routes (Admin only)

// Get all categories
router.get('/admin/categories', AuthService.requireAuth, async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const categories = await prisma.category.findMany({
      orderBy: {
        displayOrder: 'asc'
      }
    });

    await prisma.$disconnect();

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

// Create new category
router.post('/admin/categories', AuthService.requireAuth, async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Category name is required'
      });
    }

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const category = await prisma.category.create({
      data: {
        name: name.toUpperCase(),
        description,
        displayOrder: displayOrder || 0
      }
    });

    await prisma.$disconnect();

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      error: 'Failed to create category',
      details: error.message
    });
  }
});

// Update category
router.put('/admin/categories/:id', AuthService.requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, displayOrder, isActive } = req.body;

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const updateData = {};
    if (name !== undefined) updateData.name = name.toUpperCase();
    if (description !== undefined) updateData.description = description;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await prisma.category.update({
      where: { id },
      data: updateData
    });

    await prisma.$disconnect();

    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      error: 'Failed to update category',
      details: error.message
    });
  }
});

// Delete category
router.delete('/admin/categories/:id', AuthService.requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      await prisma.$disconnect();
      return res.status(400).json({
        error: 'Cannot delete category with existing products',
        details: `This category has ${productsCount} products. Please reassign or delete the products first.`
      });
    }

    await prisma.category.delete({
      where: { id }
    });

    await prisma.$disconnect();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      error: 'Failed to delete category',
      details: error.message
    });
  }
});

module.exports = router;
