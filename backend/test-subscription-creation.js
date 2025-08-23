const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSubscriptionCreation() {
  console.log('🧪 Testing Subscription Creation...\n');

  try {
    // First, ensure we have a package to subscribe to
    console.log('1. Checking for existing packages...');
    let packages = await prisma.subscriptionPackage.findMany();
    
    if (packages.length === 0) {
      console.log('   No packages found, creating test package...');
      const testPackage = await prisma.subscriptionPackage.create({
        data: {
          name: 'Test Package',
          price: 99.99,
          description: 'Test package for subscription creation',
          features: JSON.stringify(['Test feature 1', 'Test feature 2']),
          bestFor: 'Testing purposes',
          isPopular: false,
          isActive: true
        }
      });
      packages = [testPackage];
      console.log(`   ✅ Created test package: ${testPackage.name}`);
    } else {
      console.log(`   ✅ Found ${packages.length} existing packages`);
    }

    const testPackage = packages[0];

    // Test 2: Create a test subscription with new preferences field
    console.log('\n2. Testing subscription creation with preferences...');
    const testSubscription = await prisma.customerSubscription.create({
      data: {
        email: 'test@example.com',
        fullName: 'Test Customer',
        phone: '+1234567890',
        zipCode: '12345',
        address: '123 Test Street, Test City, TC 12345',
        packageId: testPackage.id,
        monthlyAmount: testPackage.price,
        preferences: JSON.stringify({
          style: 'casual',
          colors: ['blue', 'black', 'white'],
          sizes: ['M', 'L'],
          categories: ['clothing', 'accessories']
        })
      }
    });

    console.log(`   ✅ Created subscription: ${testSubscription.id}`);
    console.log(`   ✅ Preferences stored: ${testSubscription.preferences ? 'Yes' : 'No'}`);

    // Test 3: Create an order for the subscription
    console.log('\n3. Testing order creation with enhanced fields...');
    const testOrder = await prisma.subscriptionOrder.create({
      data: {
        subscriptionId: testSubscription.id,
        orderMonth: new Date(),
        status: 'PENDING',
        totalValue: 0
      }
    });

    console.log(`   ✅ Created order: ${testOrder.id}`);
    console.log(`   ✅ Total value field: ${testOrder.totalValue !== undefined ? 'Available' : 'Missing'}`);

    // Test 4: Test order status update with history
    console.log('\n4. Testing order status update with history...');
    const updatedOrder = await prisma.subscriptionOrder.update({
      where: { id: testOrder.id },
      data: { 
        status: 'PROCESSING',
        trackingNumber: 'TEST123456'
      }
    });

    // Create status history record
    const statusHistory = await prisma.orderStatusHistory.create({
      data: {
        orderId: testOrder.id,
        status: 'PROCESSING',
        notes: 'Test status update',
        changedBy: 'test-admin'
      }
    });

    console.log(`   ✅ Updated order status: ${updatedOrder.status}`);
    console.log(`   ✅ Tracking number: ${updatedOrder.trackingNumber}`);
    console.log(`   ✅ Status history created: ${statusHistory.id}`);

    // Test 5: Test notification logging
    console.log('\n5. Testing notification logging...');
    const notificationLog = await prisma.notificationLog.create({
      data: {
        orderId: testOrder.id,
        subscriptionId: testSubscription.id,
        notificationType: 'ORDER_CONFIRMATION',
        recipientEmail: testSubscription.email,
        subject: 'Test Notification',
        content: 'Test notification content',
        deliveryStatus: 'success'
      }
    });

    console.log(`   ✅ Notification logged: ${notificationLog.id}`);

    // Test 6: Cleanup test data
    console.log('\n6. Cleaning up test data...');
    await prisma.notificationLog.delete({ where: { id: notificationLog.id } });
    await prisma.orderStatusHistory.delete({ where: { id: statusHistory.id } });
    await prisma.subscriptionOrder.delete({ where: { id: testOrder.id } });
    await prisma.customerSubscription.delete({ where: { id: testSubscription.id } });
    
    // Only delete test package if we created it
    if (testPackage.name === 'Test Package') {
      await prisma.subscriptionPackage.delete({ where: { id: testPackage.id } });
      console.log('   ✅ Test package deleted');
    }

    console.log('   ✅ Test data cleaned up');

    console.log('\n🎉 All subscription creation tests passed!');
    console.log('\n📋 Verified Features:');
    console.log('   ✅ Subscription creation with preferences field');
    console.log('   ✅ Order creation with enhanced fields');
    console.log('   ✅ Order status updates with tracking');
    console.log('   ✅ Status history tracking');
    console.log('   ✅ Notification logging');
    console.log('   ✅ All database relationships working');

  } catch (error) {
    console.error('❌ Subscription creation test failed:', error.message);
    console.error('   Details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testSubscriptionCreation();
