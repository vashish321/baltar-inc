const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugOrdersIssue() {
  console.log('🔍 Debugging Orders Display Issue...\n');

  try {
    // Step 1: Check all subscriptions
    console.log('1. Checking all subscriptions...');
    const subscriptions = await prisma.customerSubscription.findMany({
      include: {
        package: true,
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    console.log(`   Found ${subscriptions.length} subscriptions:`);
    for (const sub of subscriptions) {
      console.log(`   • ${sub.fullName} (${sub.email})`);
      console.log(`     Payment Status: ${sub.paymentStatus}`);
      console.log(`     Subscription Status: ${sub.status}`);
      console.log(`     Package: ${sub.package.name}`);
      console.log(`     Orders: ${sub.orders.length}`);
      
      if (sub.orders.length > 0) {
        for (const order of sub.orders) {
          console.log(`       - Order ${order.id}: ${order.status} (${order.orderMonth.toLocaleDateString()})`);
          console.log(`         Items: ${order.items.length}, Total: $${order.totalValue || 0}`);
        }
      }
      console.log('');
    }

    // Step 2: Check orders specifically for paid subscriptions
    console.log('2. Checking orders for PAID subscriptions...');
    const paidSubscriptions = subscriptions.filter(sub => sub.paymentStatus === 'PAID');
    console.log(`   Found ${paidSubscriptions.length} paid subscriptions`);

    for (const sub of paidSubscriptions) {
      console.log(`   Subscription: ${sub.fullName} (ID: ${sub.id})`);
      console.log(`   Orders for this subscription: ${sub.orders.length}`);
      
      if (sub.orders.length === 0) {
        console.log('   ❌ No orders found for this paid subscription!');
      } else {
        console.log('   ✅ Orders found:');
        for (const order of sub.orders) {
          console.log(`     - ${order.status} order for ${order.orderMonth.toLocaleDateString()}`);
        }
      }
    }

    // Step 3: Check if there are any orders at all
    console.log('\n3. Checking all orders in database...');
    const allOrders = await prisma.subscriptionOrder.findMany({
      include: {
        subscription: {
          include: {
            package: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });

    console.log(`   Total orders in database: ${allOrders.length}`);
    for (const order of allOrders) {
      console.log(`   • Order ${order.id}:`);
      console.log(`     Customer: ${order.subscription.fullName}`);
      console.log(`     Status: ${order.status}`);
      console.log(`     Month: ${order.orderMonth.toLocaleDateString()}`);
      console.log(`     Items: ${order.items.length}`);
      console.log(`     Total Value: $${order.totalValue || 0}`);
      console.log('');
    }

    // Step 4: Test the API endpoint that the frontend calls
    console.log('4. Testing API endpoint simulation...');
    
    if (paidSubscriptions.length > 0) {
      const testSubscription = paidSubscriptions[0];
      console.log(`   Testing orders for subscription: ${testSubscription.fullName}`);
      
      // Simulate the API call
      const ordersForSubscription = await prisma.subscriptionOrder.findMany({
        where: {
          subscriptionId: testSubscription.id
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        },
        orderBy: {
          orderMonth: 'desc'
        }
      });

      console.log(`   API simulation result: ${ordersForSubscription.length} orders`);
      
      if (ordersForSubscription.length === 0) {
        console.log('   ❌ API would return empty result!');
        
        // Check if there's a mismatch in subscription ID
        console.log('   Checking subscription ID consistency...');
        const directOrderCheck = await prisma.subscriptionOrder.findMany({
          where: {
            subscription: {
              email: testSubscription.email
            }
          }
        });
        console.log(`   Orders found by email match: ${directOrderCheck.length}`);
      } else {
        console.log('   ✅ API would return orders successfully');
        for (const order of ordersForSubscription) {
          console.log(`     - ${order.status} order with ${order.items.length} items`);
        }
      }
    }

    // Step 5: Check for any data inconsistencies
    console.log('\n5. Checking for data inconsistencies...');
    
    // Check for orphaned orders
    const orphanedOrders = await prisma.subscriptionOrder.findMany({
      where: {
        subscription: null
      }
    });
    
    if (orphanedOrders.length > 0) {
      console.log(`   ❌ Found ${orphanedOrders.length} orphaned orders (no subscription)`);
    } else {
      console.log('   ✅ No orphaned orders found');
    }

    // Check for orders with invalid subscription IDs
    const ordersWithInvalidSubs = await prisma.subscriptionOrder.findMany({
      where: {
        NOT: {
          subscriptionId: {
            in: subscriptions.map(sub => sub.id)
          }
        }
      }
    });

    if (ordersWithInvalidSubs.length > 0) {
      console.log(`   ❌ Found ${ordersWithInvalidSubs.length} orders with invalid subscription IDs`);
      for (const order of ordersWithInvalidSubs) {
        console.log(`     Order ${order.id} references subscription ${order.subscriptionId} (not found)`);
      }
    } else {
      console.log('   ✅ All orders have valid subscription references');
    }

    console.log('\n📋 Summary:');
    console.log(`   • Total subscriptions: ${subscriptions.length}`);
    console.log(`   • Paid subscriptions: ${paidSubscriptions.length}`);
    console.log(`   • Total orders: ${allOrders.length}`);
    console.log(`   • Orders for paid subscriptions: ${paidSubscriptions.reduce((sum, sub) => sum + sub.orders.length, 0)}`);

    if (allOrders.length === 0) {
      console.log('\n❌ ROOT CAUSE: No orders exist in the database!');
      console.log('   Solution: Run the test data creation script to create orders');
    } else if (paidSubscriptions.reduce((sum, sub) => sum + sub.orders.length, 0) === 0) {
      console.log('\n❌ ROOT CAUSE: No orders associated with paid subscriptions!');
      console.log('   Solution: Check subscription-order associations');
    } else {
      console.log('\n✅ Orders exist and are properly associated');
      console.log('   Issue might be in the frontend API call or component rendering');
    }

  } catch (error) {
    console.error('❌ Error during debugging:', error.message);
    console.error('   Details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the debug script
debugOrdersIssue();
