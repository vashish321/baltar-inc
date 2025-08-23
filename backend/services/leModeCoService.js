const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

class LeModeCoService {
  // Package Management
  static async createPackage(packageData) {
    try {
      const { name, price, description, features, bestFor, isPopular } = packageData;

      const subscriptionPackage = await prisma.subscriptionPackage.create({
        data: {
          name,
          price: parseFloat(price),
          description,
          features: JSON.stringify(features),
          bestFor,
          isPopular: isPopular || false
        }
      });

      return subscriptionPackage;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  }

  static async getAllPackages(includeInactive = false) {
    try {
      const where = includeInactive ? {} : { isActive: true };
      
      const subscriptionPackage = await prisma.subscriptionPackage.findMany({
        where,
        orderBy: { createdAt: 'asc' }
      });

      return subscriptionPackage.map(pkg => ({
        ...pkg,
        features: JSON.parse(pkg.features)
      }));
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  }

  static async getPackageById(packageId) {
    try {
      const subscriptionPackage = await prisma.subscriptionPackage.findUnique({
        where: { id: packageId }
      });

      if (!subscriptionPackage) {
        throw new Error('Package not found');
      }

      return {
        ...subscriptionPackage,
        features: JSON.parse(subscriptionPackage.features)
      };
    } catch (error) {
      console.error('Error fetching package:', error);
      throw error;
    }
  }

  static async updatePackage(packageId, updateData) {
    try {
      const { features, ...otherData } = updateData;
      
      const updatePayload = {
        ...otherData
      };

      if (features) {
        updatePayload.features = JSON.stringify(features);
      }

      if (updatePayload.price) {
        updatePayload.price = parseFloat(updatePayload.price);
      }

      const subscriptionPackage = await prisma.subscriptionPackage.update({
        where: { id: packageId },
        data: updatePayload
      });

      return {
        ...subscriptionPackage,
        features: JSON.parse(subscriptionPackage.features)
      };
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  }

  static async deletePackage(packageId) {
    try {
      // Check if package has active subscriptions
      const activeSubscriptions = await prisma.customerSubscription.count({
        where: {
          packageId,
          status: 'ACTIVE'
        }
      });

      if (activeSubscriptions > 0) {
        throw new Error('Cannot delete package with active subscriptions');
      }

      await prisma.subscriptionPackage.update({
        where: { id: packageId },
        data: { isActive: false }
      });

      return { success: true, message: 'Package deactivated successfully' };
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }

  // Subscription Management
  static async createSubscription(subscriptionData) {
    try {
      const { email, fullName, phone, zipCode, address, packageId } = subscriptionData;

      // Get package details
      const subscriptionPackage = await this.getPackageById(packageId);
      
      // Create subscription record
      const subscription = await prisma.customerSubscription.create({
        data: {
          email,
          fullName,
          phone,
          zipCode,
          address,
          packageId,
          monthlyAmount: subscriptionPackage.price,
          status: 'PENDING',
          paymentStatus: 'PENDING'
        },
        include: {
          package: true
        }
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async createStripePaymentIntent(subscriptionId) {
    try {
      const subscription = await prisma.customerSubscription.findUnique({
        where: { id: subscriptionId },
        include: { package: true }
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(subscription.monthlyAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          subscriptionId: subscription.id,
          customerEmail: subscription.email,
          packageName: subscription.package.name
        }
      });

      // Update subscription with payment intent ID
      await prisma.customerSubscription.update({
        where: { id: subscriptionId },
        data: { stripePaymentId: paymentIntent.id }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async confirmPayment(paymentIntentId) {
    try {
      // Get payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        const subscriptionId = paymentIntent.metadata.subscriptionId;
        
        // Update subscription status
        const subscription = await prisma.customerSubscription.update({
          where: { id: subscriptionId },
          data: {
            status: 'ACTIVE',
            paymentStatus: 'COMPLETED'
          },
          include: {
            package: true
          }
        });

        // Create first order for current month
        await this.createMonthlyOrder(subscriptionId);

        return subscription;
      } else {
        throw new Error('Payment not successful');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  static async getAllSubscriptions(filters = {}) {
    try {
      const { status, page = 1, limit = 10 } = filters;
      const skip = (page - 1) * limit;

      const where = {};
      if (status) where.status = status;

      const subscriptions = await prisma.customerSubscription.findMany({
        where,
        include: {
          package: true,
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      });

      const total = await prisma.customerSubscription.count({ where });

      return {
        subscriptions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }

  // Order Management
  static async createMonthlyOrder(subscriptionId) {
    try {
      const currentMonth = new Date();
      currentMonth.setDate(1); // First day of current month
      currentMonth.setHours(0, 0, 0, 0);

      // Check if order already exists for this month
      const existingOrder = await prisma.subscriptionOrder.findFirst({
        where: {
          subscriptionId,
          orderMonth: currentMonth
        }
      });

      if (existingOrder) {
        return existingOrder;
      }

      const order = await prisma.subscriptionOrder.create({
        data: {
          subscriptionId,
          orderMonth: currentMonth,
          status: 'PENDING'
        },
        include: {
          subscription: {
            include: { package: true }
          }
        }
      });

      return order;
    } catch (error) {
      console.error('Error creating monthly order:', error);
      throw error;
    }
  }

  static async getOrdersBySubscription(subscriptionId, includeEmpty = false) {
    try {
      const whereClause = { subscriptionId };

      // By default, filter out empty PENDING orders (placeholders)
      if (!includeEmpty) {
        whereClause.NOT = {
          AND: [
            { status: 'PENDING' },
            { totalValue: { lte: 0 } },
            { items: { none: {} } }
          ]
        };
      }

      const orders = await prisma.subscriptionOrder.findMany({
        where: whereClause,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          },
          subscription: {
            include: { package: true }
          }
        },
        orderBy: { orderMonth: 'desc' }
      });

      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get all orders including empty ones (for admin management)
  static async getAllOrdersBySubscription(subscriptionId) {
    return this.getOrdersBySubscription(subscriptionId, true);
  }

  static async addItemToOrder(orderId, itemData) {
    try {
      const { itemName, description, category } = itemData;

      const item = await prisma.orderItem.create({
        data: {
          orderId,
          itemName,
          description,
          category
        }
      });

      // Update order status to ITEMS_ADDED if it was PENDING
      await prisma.subscriptionOrder.update({
        where: { id: orderId },
        data: { status: 'ITEMS_ADDED' }
      });

      return item;
    } catch (error) {
      console.error('Error adding item to order:', error);
      throw error;
    }
  }

  static async removeItemFromOrder(itemId) {
    try {
      await prisma.orderItem.delete({
        where: { id: itemId }
      });

      return { success: true, message: 'Item removed successfully' };
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  }

  static async completeOrder(orderId) {
    try {
      const order = await prisma.subscriptionOrder.update({
        where: { id: orderId },
        data: { status: 'COMPLETED' },
        include: {
          subscription: true,
          items: true
        }
      });

      return order;
    } catch (error) {
      console.error('Error completing order:', error);
      throw error;
    }
  }

  static async notifyCustomer(orderId) {
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

      // Update notification status
      await prisma.subscriptionOrder.update({
        where: { id: orderId },
        data: {
          isNotified: true,
          notifiedAt: new Date()
        }
      });

      return {
        order,
        emailData: {
          to: order.subscription.email,
          customerName: order.subscription.fullName,
          packageName: order.subscription.package.name,
          orderMonth: order.orderMonth
        }
      };
    } catch (error) {
      console.error('Error preparing notification:', error);
      throw error;
    }
  }

  // Dashboard Statistics
  static async getDashboardStats() {
    try {
      const [
        totalSubscriptions,
        activeSubscriptions,
        pendingOrders,
        completedOrders,
        monthlyRevenue
      ] = await Promise.all([
        prisma.customerSubscription.count(),
        prisma.customerSubscription.count({ where: { status: 'ACTIVE' } }),
        prisma.subscriptionOrder.count({ where: { status: 'PENDING' } }),
        prisma.subscriptionOrder.count({ where: { status: 'COMPLETED' } }),
        prisma.customerSubscription.aggregate({
          where: { status: 'ACTIVE' },
          _sum: { monthlyAmount: true }
        })
      ]);

      return {
        totalSubscriptions,
        activeSubscriptions,
        pendingOrders,
        completedOrders,
        monthlyRevenue: monthlyRevenue._sum.monthlyAmount || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

module.exports = LeModeCoService;
