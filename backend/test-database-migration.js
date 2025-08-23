const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseMigration() {
  console.log('🧪 Testing Database Migration...\n');

  try {
    // Test 1: Check if Product table exists
    console.log('1. Testing Product table...');
    const products = await prisma.product.findMany();
    console.log(`✅ Products table exists, found: ${products.length} products`);

    // Test 2: Check if ProductImage table exists
    console.log('\n2. Testing ProductImage table...');
    const productImages = await prisma.productImage.findMany();
    console.log(`✅ ProductImage table exists, found: ${productImages.length} images`);

    // Test 3: Check if OrderStatusHistory table exists
    console.log('\n3. Testing OrderStatusHistory table...');
    const statusHistory = await prisma.orderStatusHistory.findMany();
    console.log(`✅ OrderStatusHistory table exists, found: ${statusHistory.length} records`);

    // Test 4: Check if OrderTemplate table exists
    console.log('\n4. Testing OrderTemplate table...');
    const templates = await prisma.orderTemplate.findMany();
    console.log(`✅ OrderTemplate table exists, found: ${templates.length} templates`);

    // Test 5: Check if TemplateItem table exists
    console.log('\n5. Testing TemplateItem table...');
    const templateItems = await prisma.templateItem.findMany();
    console.log(`✅ TemplateItem table exists, found: ${templateItems.length} items`);

    // Test 6: Check if NotificationLog table exists
    console.log('\n6. Testing NotificationLog table...');
    const notifications = await prisma.notificationLog.findMany();
    console.log(`✅ NotificationLog table exists, found: ${notifications.length} notifications`);

    // Test 7: Check if CustomerSubscription has preferences column
    console.log('\n7. Testing CustomerSubscription preferences column...');
    const subscriptions = await prisma.customerSubscription.findMany({
      select: { id: true, preferences: true }
    });
    console.log(`✅ CustomerSubscription.preferences column exists, found: ${subscriptions.length} subscriptions`);

    // Test 8: Check if SubscriptionOrder has new columns
    console.log('\n8. Testing SubscriptionOrder enhanced columns...');
    const orders = await prisma.subscriptionOrder.findMany({
      select: { 
        id: true, 
        trackingNumber: true, 
        shippedAt: true, 
        deliveredAt: true, 
        totalValue: true 
      }
    });
    console.log(`✅ SubscriptionOrder enhanced columns exist, found: ${orders.length} orders`);

    // Test 9: Check if OrderItem has new columns
    console.log('\n9. Testing OrderItem enhanced columns...');
    const orderItems = await prisma.orderItem.findMany({
      select: { 
        id: true, 
        productId: true, 
        quantity: true, 
        unitValue: true 
      }
    });
    console.log(`✅ OrderItem enhanced columns exist, found: ${orderItems.length} items`);

    console.log('\n🎉 All database migration tests passed!');
    console.log('\n📋 Database Schema Status:');
    console.log('   ✅ Product table created');
    console.log('   ✅ ProductImage table created');
    console.log('   ✅ OrderStatusHistory table created');
    console.log('   ✅ OrderTemplate table created');
    console.log('   ✅ TemplateItem table created');
    console.log('   ✅ NotificationLog table created');
    console.log('   ✅ CustomerSubscription.preferences column added');
    console.log('   ✅ SubscriptionOrder enhanced with new columns');
    console.log('   ✅ OrderItem enhanced with new columns');

  } catch (error) {
    console.error('❌ Database migration test failed:', error.message);
    console.error('   Details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseMigration();
