const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateToSingleOrder() {
  try {
    console.log('🔄 Starting migration to single order per subscription...');

    // Get all subscriptions with their current order (if any)
    const subscriptions = await prisma.customerSubscription.findMany({
      include: {
        order: {
          include: {
            items: true
          }
        }
      }
    });

    // Also get all existing orders to handle the migration
    const allOrders = await prisma.subscriptionOrder.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Found ${subscriptions.length} subscriptions to migrate`);
    console.log(`📦 Found ${allOrders.length} total orders in system`);

    // Group orders by subscription
    const ordersBySubscription = {};
    for (const order of allOrders) {
      if (!ordersBySubscription[order.subscriptionId]) {
        ordersBySubscription[order.subscriptionId] = [];
      }
      ordersBySubscription[order.subscriptionId].push(order);
    }

    for (const subscription of subscriptions) {
      console.log(`\n🔄 Processing subscription: ${subscription.fullName} (${subscription.email})`);

      const subscriptionOrders = ordersBySubscription[subscription.id] || [];

      if (subscriptionOrders.length === 0) {
        console.log('   ⚠️ No orders found, creating new order...');

        // Create a new order for this subscription
        await prisma.subscriptionOrder.create({
          data: {
            subscriptionId: subscription.id,
            status: 'PENDING'
          }
        });

        console.log('   ✅ Created new order');
        continue;
      }

      if (subscriptionOrders.length === 1) {
        console.log('   ✅ Already has single order, skipping...');
        continue;
      }

      // Multiple orders exist - consolidate them
      console.log(`   📦 Found ${subscriptionOrders.length} orders, consolidating...`);

      // Collect all items from all orders
      const allItems = [];
      let hasCompletedOrder = false;
      let latestTrackingNumber = null;
      let latestShippedAt = null;
      let latestDeliveredAt = null;

      for (const order of subscriptionOrders) {
        // Collect items
        allItems.push(...order.items);

        // Check for completed status
        if (order.status === 'COMPLETED') {
          hasCompletedOrder = true;
          if (order.trackingNumber) latestTrackingNumber = order.trackingNumber;
          if (order.shippedAt) latestShippedAt = order.shippedAt;
          if (order.deliveredAt) latestDeliveredAt = order.deliveredAt;
        }
      }

      // Delete all existing orders for this subscription
      await prisma.orderItem.deleteMany({
        where: {
          orderId: {
            in: subscriptionOrders.map(o => o.id)
          }
        }
      });

      await prisma.subscriptionOrder.deleteMany({
        where: {
          subscriptionId: subscription.id
        }
      });

      // Create single consolidated order
      const newOrder = await prisma.subscriptionOrder.create({
        data: {
          subscriptionId: subscription.id,
          status: hasCompletedOrder ? 'COMPLETED' : (allItems.length > 0 ? 'ITEMS_ADDED' : 'PENDING'),
          trackingNumber: latestTrackingNumber,
          shippedAt: latestShippedAt,
          deliveredAt: latestDeliveredAt,
          isNotified: hasCompletedOrder
        }
      });

      // Add all items to the new order
      if (allItems.length > 0) {
        for (const item of allItems) {
          await prisma.orderItem.create({
            data: {
              orderId: newOrder.id,
              itemName: item.itemName,
              description: item.description,
              category: item.category,
              productId: item.productId,
              quantity: item.quantity || 1,
              unitValue: item.unitValue || 0
            }
          });
        }
      }

      console.log(`   ✅ Consolidated ${subscriptionOrders.length} orders into 1 order with ${allItems.length} items`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    
    const finalStats = await Promise.all([
      prisma.customerSubscription.count(),
      prisma.subscriptionOrder.count(),
      prisma.orderItem.count()
    ]);

    console.log(`   📋 Total subscriptions: ${finalStats[0]}`);
    console.log(`   📦 Total orders: ${finalStats[1]}`);
    console.log(`   🛍️ Total items: ${finalStats[2]}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateToSingleOrder()
    .then(() => {
      console.log('✅ Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateToSingleOrder };
