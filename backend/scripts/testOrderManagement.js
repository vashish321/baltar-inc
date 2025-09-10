require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const LeModeCoService = require('../services/leModeCoService');

const prisma = new PrismaClient();

async function testOrderManagement() {
  console.log('🔧 Testing Enhanced Order Management...');
  console.log('='.repeat(50));

  try {
    // Test 1: Get subscriptions with orders
    console.log('\n1. Testing subscription and order retrieval...');
    const subscriptions = await prisma.customerSubscription.findMany({
      include: {
        package: true,
        order: {
          include: {
            items: true
          }
        }
      }
    });

    console.log(`✅ Found ${subscriptions.length} subscriptions`);
    
    for (const subscription of subscriptions) {
      console.log(`   - ${subscription.fullName} (${subscription.status})`);
      if (subscription.order) {
        console.log(`     Order: ${subscription.order.id} with ${subscription.order.items.length} items`);
      } else {
        console.log(`     No order found`);
      }
    }

    // Test 2: Create order for subscription without one
    console.log('\n2. Testing order creation...');
    const subscriptionWithoutOrder = subscriptions.find(sub => !sub.order);
    
    if (subscriptionWithoutOrder) {
      console.log(`   Creating order for: ${subscriptionWithoutOrder.fullName}`);
      const newOrder = await LeModeCoService.createSubscriptionOrder(subscriptionWithoutOrder.id);
      console.log(`   ✅ Order created: ${newOrder.id}`);
    } else {
      console.log('   ⚠️ All subscriptions already have orders');
    }

    // Test 3: Test adding items to order
    console.log('\n3. Testing item addition...');
    const orderWithItems = await prisma.subscriptionOrder.findFirst({
      include: { items: true }
    });

    if (orderWithItems) {
      console.log(`   Testing with order: ${orderWithItems.id}`);
      
      const testItem = {
        itemName: 'Test Product',
        description: 'Test product for order management',
        category: 'Test Category',
        quantity: 1,
        unitValue: 25.99
      };

      const addedItem = await LeModeCoService.addItemToOrder(orderWithItems.id, testItem);
      console.log(`   ✅ Item added: ${addedItem.id} - ${addedItem.itemName}`);

      // Clean up test item
      await prisma.orderItem.delete({ where: { id: addedItem.id } });
      console.log(`   ✅ Test item cleaned up`);
    } else {
      console.log('   ⚠️ No orders found for testing');
    }

    // Test 4: Test order status updates
    console.log('\n4. Testing order status updates...');
    const testOrder = await prisma.subscriptionOrder.findFirst();
    
    if (testOrder) {
      console.log(`   Testing with order: ${testOrder.id}`);
      console.log(`   Current status: ${testOrder.status}`);
      
      // Test status history
      const history = await prisma.orderStatusHistory.findMany({
        where: { orderId: testOrder.id },
        orderBy: { createdAt: 'desc' }
      });
      
      console.log(`   ✅ Order has ${history.length} status history entries`);
    }

    // Test 5: Test templates
    console.log('\n5. Testing templates...');
    const templates = await prisma.orderTemplate.findMany({
      include: { items: true }
    });

    console.log(`✅ Found ${templates.length} templates`);
    
    for (const template of templates) {
      console.log(`   - ${template.name}: ${template.items.length} items`);
    }

    // Test 6: Test products for search
    console.log('\n6. Testing product availability...');
    const products = await prisma.product.findMany({
      include: { category: true },
      take: 5
    });

    console.log(`✅ Found ${products.length} products for search`);
    
    for (const product of products) {
      console.log(`   - ${product.name} ($${product.price}) - ${product.category?.name || 'No category'}`);
    }

    console.log('\n✅ Order management testing completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Subscriptions: ${subscriptions.length}`);
    console.log(`   - Orders: ${subscriptions.filter(s => s.order).length}`);
    console.log(`   - Templates: ${templates.length}`);
    console.log(`   - Products: ${products.length}`);

  } catch (error) {
    console.error('❌ Order management testing failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testOrderManagement()
    .then(() => {
      console.log('✅ Testing completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Testing failed:', error);
      process.exit(1);
    });
}

module.exports = { testOrderManagement };
