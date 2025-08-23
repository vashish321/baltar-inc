const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function analyzeOrderCountIssue() {
  console.log('🔍 Analyzing Order Count Display Issue...\n');

  try {
    // Get Sarah Johnson's subscription and orders
    console.log('1. Sarah Johnson\'s Order Analysis:');
    const sarahSubscription = await prisma.customerSubscription.findFirst({
      where: {
        email: 'sarah.johnson@example.com'
      },
      include: {
        package: true,
        orders: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: {
            orderMonth: 'desc'
          }
        }
      }
    });

    if (!sarahSubscription) {
      console.log('   ❌ Sarah Johnson subscription not found');
      return;
    }

    console.log(`   Customer: ${sarahSubscription.fullName}`);
    console.log(`   Email: ${sarahSubscription.email}`);
    console.log(`   Package: ${sarahSubscription.package.name}`);
    console.log(`   Payment Status: ${sarahSubscription.paymentStatus}`);
    console.log(`   Total Orders: ${sarahSubscription.orders.length}\n`);

    // Analyze each order
    console.log('2. Detailed Order Analysis:');
    sarahSubscription.orders.forEach((order, index) => {
      console.log(`   Order ${index + 1}:`);
      console.log(`     ID: ${order.id}`);
      console.log(`     Status: ${order.status}`);
      console.log(`     Month: ${order.orderMonth.toLocaleDateString()}`);
      console.log(`     Items: ${order.items.length}`);
      console.log(`     Total Value: $${order.totalValue || 0}`);
      console.log(`     Created: ${order.createdAt.toLocaleDateString()}`);
      
      if (order.items.length > 0) {
        console.log(`     Products:`);
        order.items.forEach(item => {
          console.log(`       - ${item.product ? item.product.name : item.itemName} (${item.quantity}x) - $${item.price || 0}`);
        });
      } else {
        console.log(`     ⚠️  Empty order (no items)`);
      }
      
      // Determine if this is a "meaningful" order
      const isMeaningful = order.items.length > 0 || order.status === 'COMPLETED' || order.totalValue > 0;
      console.log(`     Meaningful: ${isMeaningful ? '✅ Yes' : '❌ No'}`);
      console.log('');
    });

    // Categorize orders
    console.log('3. Order Categorization:');
    const emptyOrders = sarahSubscription.orders.filter(order => 
      order.items.length === 0 && order.totalValue === 0
    );
    const ordersWithItems = sarahSubscription.orders.filter(order => 
      order.items.length > 0
    );
    const completedOrders = sarahSubscription.orders.filter(order => 
      order.status === 'COMPLETED'
    );
    const pendingOrders = sarahSubscription.orders.filter(order => 
      order.status === 'PENDING'
    );

    console.log(`   Empty orders (0 items, $0): ${emptyOrders.length}`);
    console.log(`   Orders with items: ${ordersWithItems.length}`);
    console.log(`   Completed orders: ${completedOrders.length}`);
    console.log(`   Pending orders: ${pendingOrders.length}`);

    // Show empty orders details
    if (emptyOrders.length > 0) {
      console.log('\n   Empty Orders Details:');
      emptyOrders.forEach(order => {
        console.log(`     • ${order.status} order for ${order.orderMonth.toLocaleDateString()}`);
        console.log(`       Created: ${order.createdAt.toLocaleDateString()}`);
        console.log(`       Purpose: ${order.status === 'PENDING' ? 'Awaiting items to be added' : 'Unknown'}`);
      });
    }

    // Recommendations
    console.log('\n4. Order Display Recommendations:');
    
    console.log('\n   Option A: Show All Orders (Current Behavior)');
    console.log(`     • Total: ${sarahSubscription.orders.length} orders`);
    console.log('     • Pros: Complete transparency, shows workflow status');
    console.log('     • Cons: May confuse users with empty orders');
    
    console.log('\n   Option B: Show Only Orders with Items');
    console.log(`     • Total: ${ordersWithItems.length} orders`);
    console.log('     • Pros: Shows only "meaningful" orders with products');
    console.log('     • Cons: Hides pending orders that may need attention');
    
    console.log('\n   Option C: Show Orders with Items OR Completed Status');
    const meaningfulOrders = sarahSubscription.orders.filter(order => 
      order.items.length > 0 || order.status === 'COMPLETED' || order.totalValue > 0
    );
    console.log(`     • Total: ${meaningfulOrders.length} orders`);
    console.log('     • Pros: Balanced approach, shows progress and completed work');
    console.log('     • Cons: Still may show some empty orders');

    console.log('\n   Option D: Filter by Status (Hide PENDING with 0 items)');
    const nonEmptyPendingOrders = sarahSubscription.orders.filter(order => 
      !(order.status === 'PENDING' && order.items.length === 0 && order.totalValue === 0)
    );
    console.log(`     • Total: ${nonEmptyPendingOrders.length} orders`);
    console.log('     • Pros: Hides empty pending orders, shows active work');
    console.log('     • Cons: May hide orders that admins need to work on');

    // Check other customers for comparison
    console.log('\n5. Comparison with Other Customers:');
    const allSubscriptions = await prisma.customerSubscription.findMany({
      where: {
        paymentStatus: 'PAID'
      },
      include: {
        orders: {
          include: {
            items: true
          }
        }
      }
    });

    for (const sub of allSubscriptions) {
      const emptyOrdersCount = sub.orders.filter(order => 
        order.items.length === 0 && order.totalValue === 0
      ).length;
      const totalOrders = sub.orders.length;
      const ordersWithItems = sub.orders.filter(order => order.items.length > 0).length;
      
      console.log(`   ${sub.fullName}:`);
      console.log(`     Total: ${totalOrders}, With Items: ${ordersWithItems}, Empty: ${emptyOrdersCount}`);
    }

    console.log('\n6. Recommended Solution:');
    console.log('   Based on the analysis, I recommend Option D:');
    console.log('   • Filter out PENDING orders that have 0 items and $0 value');
    console.log('   • Keep all other orders (ITEMS_ADDED, COMPLETED, etc.)');
    console.log('   • This provides a clean view while preserving important order states');
    console.log('   • Empty PENDING orders are typically just placeholders for future work');

  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the analysis
analyzeOrderCountIssue();
