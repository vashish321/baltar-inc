const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSpecificSubscriptionOrders() {
  console.log('🔍 Testing Specific Subscription Orders...\n');

  try {
    // Get all subscriptions to see which ones the user might be clicking
    console.log('1. All subscriptions in database:');
    const allSubscriptions = await prisma.customerSubscription.findMany({
      include: {
        package: true,
        orders: {
          include: {
            items: {
              include: {
                product: {
                  include: { images: true }
                }
              }
            }
          }
        }
      }
    });

    for (const sub of allSubscriptions) {
      console.log(`\n   Subscription: ${sub.fullName} (${sub.email})`);
      console.log(`   ID: ${sub.id}`);
      console.log(`   Payment Status: ${sub.paymentStatus}`);
      console.log(`   Package: ${sub.package.name}`);
      console.log(`   Orders: ${sub.orders.length}`);
      
      if (sub.orders.length > 0) {
        console.log('   Order Details:');
        for (const order of sub.orders) {
          console.log(`     • ${order.status} - ${order.orderMonth.toLocaleDateString()} - ${order.items.length} items - $${order.totalValue || 0}`);
        }
      }
    }

    // Test the API call for each subscription with orders
    console.log('\n2. Testing API calls for subscriptions with orders:');
    
    const subscriptionsWithOrders = allSubscriptions.filter(sub => sub.orders.length > 0);
    
    for (const sub of subscriptionsWithOrders) {
      console.log(`\n   Testing API for: ${sub.fullName}`);
      console.log(`   Subscription ID: ${sub.id}`);
      
      // Simulate the API call
      const orders = await prisma.subscriptionOrder.findMany({
        where: { subscriptionId: sub.id },
        include: {
          items: {
            include: {
              product: {
                include: { images: true }
              }
            }
          },
          subscription: {
            include: { package: true }
          }
        },
        orderBy: { orderMonth: 'desc' }
      });

      console.log(`   API Result: ${orders.length} orders`);
      
      if (orders.length > 0) {
        console.log('   ✅ API would return orders:');
        for (const order of orders) {
          console.log(`     • Order ${order.id}: ${order.status} (${order.orderMonth.toLocaleDateString()})`);
          console.log(`       Items: ${order.items.length}, Total: $${order.totalValue || 0}`);
          
          // Check if items have proper product data
          for (const item of order.items) {
            if (item.product) {
              console.log(`         - ${item.product.name} (${item.quantity}x)`);
            } else {
              console.log(`         - ${item.itemName} (${item.quantity}x) [No product link]`);
            }
          }
        }
      } else {
        console.log('   ❌ API would return empty result');
      }
    }

    // Check if there are any Farooq subscriptions specifically
    console.log('\n3. Checking Farooq subscriptions specifically:');
    const farooqSubscriptions = allSubscriptions.filter(sub => 
      sub.fullName.toLowerCase().includes('farooq')
    );

    if (farooqSubscriptions.length > 0) {
      console.log(`   Found ${farooqSubscriptions.length} Farooq subscriptions:`);
      for (const sub of farooqSubscriptions) {
        console.log(`   • ${sub.fullName} (${sub.email})`);
        console.log(`     Payment Status: ${sub.paymentStatus}`);
        console.log(`     Orders: ${sub.orders.length}`);
        
        if (sub.paymentStatus !== 'PAID') {
          console.log(`     ⚠️  This subscription is ${sub.paymentStatus}, not PAID`);
          console.log(`     💡 User should select a PAID subscription to see orders`);
        }
      }
    }

    // Recommend which subscriptions to test with
    console.log('\n4. Recommendations for testing:');
    const paidSubscriptionsWithOrders = allSubscriptions.filter(sub => 
      sub.paymentStatus === 'PAID' && sub.orders.length > 0
    );

    if (paidSubscriptionsWithOrders.length > 0) {
      console.log('   ✅ Use these PAID subscriptions for testing:');
      for (const sub of paidSubscriptionsWithOrders) {
        console.log(`   • ${sub.fullName} (${sub.email}) - ${sub.orders.length} orders`);
        console.log(`     Click "View Orders" for this subscription to see orders`);
      }
    } else {
      console.log('   ❌ No PAID subscriptions with orders found!');
      console.log('   💡 Create test data or update payment status to PAID');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testSpecificSubscriptionOrders();
