require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const LeModeCoService = require('../services/leModeCoService');
const ProductService = require('../services/productService');

const prisma = new PrismaClient();

async function testBugFixes() {
  console.log('🔧 Testing Bug Fixes...');
  console.log('='.repeat(50));

  try {
    // Test 1: Dashboard Stats (Bug 3)
    console.log('\n1. Testing Dashboard Stats...');
    try {
      const stats = await LeModeCoService.getDashboardStats();
      console.log('✅ Dashboard stats working:');
      console.log(`   - Total Subscriptions: ${stats.totalSubscriptions}`);
      console.log(`   - Active Subscriptions: ${stats.activeSubscriptions}`);
      console.log(`   - Paid Subscriptions: ${stats.paidSubscriptions}`);
      console.log(`   - Complimentary Subscriptions: ${stats.complimentarySubscriptions}`);
      console.log(`   - Monthly Revenue: $${stats.monthlyRevenue}`);
    } catch (error) {
      console.log('❌ Dashboard stats failed:', error.message);
    }

    // Test 2: Product Creation (Bug 1)
    console.log('\n2. Testing Product Creation...');
    try {
      // First, get a category to use
      const categories = await prisma.category.findMany({ take: 1 });
      
      if (categories.length === 0) {
        console.log('⚠️ No categories found, creating one for testing...');
        const testCategory = await prisma.category.create({
          data: {
            name: 'Test Category',
            description: 'Test category for product creation'
          }
        });
        categories.push(testCategory);
      }

      const testProductData = {
        name: 'Test Product',
        description: 'Test product for bug fix verification',
        categoryId: categories[0].id,
        brand: 'Test Brand',
        color: 'Test Color',
        size: 'M',
        price: 25.99,
        sku: `TEST-${Date.now()}`,
        stockQuantity: 10
      };

      const product = await ProductService.createProduct(testProductData);
      console.log('✅ Product creation working:');
      console.log(`   - Product ID: ${product.id}`);
      console.log(`   - Product Name: ${product.name}`);
      console.log(`   - Category ID: ${product.categoryId}`);

      // Clean up test product
      await prisma.product.delete({ where: { id: product.id } });
      console.log('   - Test product cleaned up');

    } catch (error) {
      console.log('❌ Product creation failed:', error.message);
    }

    // Test 3: Order Creation (Bug 2)
    console.log('\n3. Testing Order Creation...');
    try {
      // Get a test subscription
      const subscriptions = await prisma.customerSubscription.findMany({ take: 1 });
      
      if (subscriptions.length === 0) {
        console.log('⚠️ No subscriptions found for order creation test');
      } else {
        const subscription = subscriptions[0];
        console.log(`   - Testing with subscription: ${subscription.fullName}`);
        
        // Check if order already exists
        const existingOrder = await prisma.subscriptionOrder.findUnique({
          where: { subscriptionId: subscription.id }
        });

        if (existingOrder) {
          console.log('✅ Order already exists for this subscription:');
          console.log(`   - Order ID: ${existingOrder.id}`);
          console.log(`   - Order Status: ${existingOrder.status}`);
        } else {
          // Create order
          const order = await LeModeCoService.createSubscriptionOrder(subscription.id);
          console.log('✅ Order creation working:');
          console.log(`   - Order ID: ${order.id}`);
          console.log(`   - Order Status: ${order.status}`);
        }
      }
    } catch (error) {
      console.log('❌ Order creation failed:', error.message);
    }

    // Test 4: Check subscription status values
    console.log('\n4. Testing Subscription Status Values...');
    try {
      const statusCounts = await Promise.all([
        prisma.customerSubscription.count({ where: { status: 'PENDING' } }),
        prisma.customerSubscription.count({ where: { status: 'PAID' } }),
        prisma.customerSubscription.count({ where: { status: 'FAILED' } }),
        prisma.customerSubscription.count({ where: { status: 'COMPLIMENTARY' } }),
        prisma.customerSubscription.count({ where: { status: 'CANCELLED' } })
      ]);

      console.log('✅ Subscription status counts:');
      console.log(`   - PENDING: ${statusCounts[0]}`);
      console.log(`   - PAID: ${statusCounts[1]}`);
      console.log(`   - FAILED: ${statusCounts[2]}`);
      console.log(`   - COMPLIMENTARY: ${statusCounts[3]}`);
      console.log(`   - CANCELLED: ${statusCounts[4]}`);
    } catch (error) {
      console.log('❌ Status value test failed:', error.message);
    }

    console.log('\n✅ Bug fix testing completed!');

  } catch (error) {
    console.error('❌ Bug fix testing failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testBugFixes()
    .then(() => {
      console.log('✅ Testing completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Testing failed:', error);
      process.exit(1);
    });
}

module.exports = { testBugFixes };
