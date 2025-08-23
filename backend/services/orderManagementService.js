const { PrismaClient } = require('@prisma/client');
const EmailService = require('./emailService');

const prisma = new PrismaClient();

class OrderManagementService {
  // Update order status with history tracking
  static async updateOrderStatus(orderId, newStatus, adminId, notes = null, trackingNumber = null) {
    try {
      const order = await prisma.subscriptionOrder.findUnique({
        where: { id: orderId },
        include: {
          subscription: {
            include: { package: true }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Prepare update data
      const updateData = { status: newStatus };
      
      if (newStatus === 'SHIPPED' && trackingNumber) {
        updateData.trackingNumber = trackingNumber;
        updateData.shippedAt = new Date();
      }
      
      if (newStatus === 'DELIVERED') {
        updateData.deliveredAt = new Date();
      }

      // Update order status
      const updatedOrder = await prisma.subscriptionOrder.update({
        where: { id: orderId },
        data: updateData,
        include: {
          subscription: {
            include: { package: true }
          },
          items: {
            include: { product: true }
          }
        }
      });

      // Create status history record
      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: newStatus,
          notes,
          changedBy: adminId
        }
      });

      // Send automatic notifications for certain status changes
      if (newStatus === 'SHIPPED' || newStatus === 'DELIVERED') {
        await this.sendStatusUpdateNotification(updatedOrder, newStatus, trackingNumber);
      }

      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Get order status history
  static async getOrderStatusHistory(orderId) {
    try {
      const history = await prisma.orderStatusHistory.findMany({
        where: { orderId },
        orderBy: { createdAt: 'desc' }
      });

      return history;
    } catch (error) {
      console.error('Error fetching order status history:', error);
      throw error;
    }
  }

  // Add product to order from catalog
  static async addProductToOrder(orderId, productId, quantity = 1, notes = null) {
    try {
      // Get product details
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      if (!product.isActive) {
        throw new Error('Product is not active');
      }

      // Check stock availability
      if (product.stockQuantity < quantity) {
        throw new Error('Insufficient stock available');
      }

      // Add item to order
      const orderItem = await prisma.orderItem.create({
        data: {
          orderId,
          productId,
          itemName: product.name,
          description: product.description,
          category: product.category,
          quantity,
          unitValue: product.price
        },
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
                take: 1
              }
            }
          }
        }
      });

      // Update product stock
      await prisma.product.update({
        where: { id: productId },
        data: {
          stockQuantity: product.stockQuantity - quantity
        }
      });

      // Update order status to ITEMS_ADDED if it was PENDING
      const order = await prisma.subscriptionOrder.findUnique({
        where: { id: orderId }
      });

      if (order.status === 'PENDING') {
        await this.updateOrderStatus(orderId, 'ITEMS_ADDED', null, 'Items added to order');
      }

      // Update order total value
      await this.updateOrderTotalValue(orderId);

      return orderItem;
    } catch (error) {
      console.error('Error adding product to order:', error);
      throw error;
    }
  }

  // Remove item from order
  static async removeItemFromOrder(itemId) {
    try {
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: itemId },
        include: { product: true }
      });

      if (!orderItem) {
        throw new Error('Order item not found');
      }

      // Restore stock if product exists
      if (orderItem.product) {
        await prisma.product.update({
          where: { id: orderItem.productId },
          data: {
            stockQuantity: orderItem.product.stockQuantity + orderItem.quantity
          }
        });
      }

      // Delete the order item
      await prisma.orderItem.delete({
        where: { id: itemId }
      });

      // Update order total value
      await this.updateOrderTotalValue(orderItem.orderId);

      return { success: true, message: 'Item removed successfully' };
    } catch (error) {
      console.error('Error removing item from order:', error);
      throw error;
    }
  }

  // Update order total value
  static async updateOrderTotalValue(orderId) {
    try {
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId }
      });

      const totalValue = orderItems.reduce((sum, item) => {
        return sum + (item.unitValue || 0) * item.quantity;
      }, 0);

      await prisma.subscriptionOrder.update({
        where: { id: orderId },
        data: { totalValue }
      });

      return totalValue;
    } catch (error) {
      console.error('Error updating order total value:', error);
      throw error;
    }
  }

  // Send status update notification
  static async sendStatusUpdateNotification(order, status, trackingNumber = null) {
    try {
      let notificationType;
      let subject;
      let templateData;

      switch (status) {
        case 'SHIPPED':
          notificationType = 'SHIPPING_NOTIFICATION';
          subject = `Your ${order.subscription.package.name} is on its way! 📦`;
          templateData = {
            customerName: order.subscription.fullName,
            packageName: order.subscription.package.name,
            trackingNumber,
            orderMonth: order.orderMonth
          };
          break;
        case 'DELIVERED':
          notificationType = 'DELIVERY_CONFIRMATION';
          subject = `Your ${order.subscription.package.name} has been delivered! 🎉`;
          templateData = {
            customerName: order.subscription.fullName,
            packageName: order.subscription.package.name,
            orderMonth: order.orderMonth
          };
          break;
        default:
          return; // No notification for other statuses
      }

      // Send email
      const emailResult = await EmailService.sendOrderStatusNotification({
        to: order.subscription.email,
        subject,
        notificationType,
        templateData
      });

      // Log notification
      await prisma.notificationLog.create({
        data: {
          orderId: order.id,
          subscriptionId: order.subscriptionId,
          notificationType,
          recipientEmail: order.subscription.email,
          subject,
          content: JSON.stringify(templateData),
          deliveryStatus: emailResult ? 'success' : 'failed'
        }
      });

      return emailResult;
    } catch (error) {
      console.error('Error sending status update notification:', error);
      
      // Log failed notification
      await prisma.notificationLog.create({
        data: {
          orderId: order.id,
          subscriptionId: order.subscriptionId,
          notificationType: 'GENERAL_UPDATE',
          recipientEmail: order.subscription.email,
          subject: 'Status Update Failed',
          deliveryStatus: 'failed',
          errorMessage: error.message
        }
      });
      
      throw error;
    }
  }

  // Send manual notification
  static async sendManualNotification(orderId, adminId, customMessage = null) {
    try {
      const order = await prisma.subscriptionOrder.findUnique({
        where: { id: orderId },
        include: {
          subscription: {
            include: { package: true }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      const monthName = order.orderMonth.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });

      const emailResult = await EmailService.sendLeModeCoOrderNotification({
        to: order.subscription.email,
        customerName: order.subscription.fullName,
        packageName: order.subscription.package.name,
        orderMonth: order.orderMonth,
        customMessage
      });

      // Update notification status
      await prisma.subscriptionOrder.update({
        where: { id: orderId },
        data: {
          isNotified: true,
          notifiedAt: new Date()
        }
      });

      // Log notification
      await prisma.notificationLog.create({
        data: {
          orderId,
          subscriptionId: order.subscriptionId,
          notificationType: 'GENERAL_UPDATE',
          recipientEmail: order.subscription.email,
          subject: `Your ${order.subscription.package.name} is Ready! 📦✨`,
          content: customMessage || 'Order fulfillment notification',
          deliveryStatus: 'success'
        }
      });

      return emailResult;
    } catch (error) {
      console.error('Error sending manual notification:', error);
      throw error;
    }
  }

  // Get orders with enhanced details
  static async getOrdersWithDetails(filters = {}) {
    try {
      const { 
        subscriptionId, 
        status, 
        page = 1, 
        limit = 10,
        startDate,
        endDate
      } = filters;

      const skip = (page - 1) * limit;
      const where = {};

      if (subscriptionId) where.subscriptionId = subscriptionId;
      if (status) where.status = status;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const [orders, total] = await Promise.all([
        prisma.subscriptionOrder.findMany({
          where,
          include: {
            subscription: {
              include: { package: true }
            },
            items: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1
                    }
                  }
                }
              }
            },
            statusHistory: {
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: parseInt(skip),
          take: parseInt(limit)
        }),
        prisma.subscriptionOrder.count({ where })
      ]);

      return {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching orders with details:', error);
      throw error;
    }
  }

  // Get notification history for an order
  static async getNotificationHistory(orderId) {
    try {
      const notifications = await prisma.notificationLog.findMany({
        where: { orderId },
        orderBy: { sentAt: 'desc' }
      });

      return notifications;
    } catch (error) {
      console.error('Error fetching notification history:', error);
      throw error;
    }
  }
}

module.exports = OrderManagementService;
