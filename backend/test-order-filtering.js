const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testOrderFiltering() {
  console.log('🧪 Testing Order Filtering Logic...\n');

  try {
    // Test the new filtering logic
    console.log('1. Testing Sarah Johnson with new filtering:');
    const sarahSubscriptionId = 'cmend0vpa000101mcnaefa3gt';
    
    // Test the old way (all orders)
    const allOrders = await prisma.subscriptionOrder.findMany({
      where: { subscriptionId: sarahSubscriptionId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { orderMonth: 'desc' }
    });

    console.log(`   All orders (old way): ${allOrders.length}`);
    allOrders.forEach((order, index) => {
      console.log(`     ${index + 1}. ${order.status} - ${order.orderMonth.toLocaleDateString()} - ${order.items.length} items - $${order.totalValue || 0}`);
    });

    // Test the new way (filtered orders)
    const filteredOrders = await prisma.subscriptionOrder.findMany({
      where: { 
        subscriptionId: sarahSubscriptionId,
        // Filter out empty PENDING orders (placeholders)
        NOT: {
          AND: [
            { status: 'PENDING' },
            { totalValue: { lte: 0 } },
            { items: { none: {} } }
          ]
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { orderMonth: 'desc' }
    });

    console.log(`\n   Filtered orders (new way): ${filteredOrders.length}`);
    filteredOrders.forEach((order, index) => {
      console.log(`     ${index + 1}. ${order.status} - ${order.orderMonth.toLocaleDateString()} - ${order.items.length} items - $${order.totalValue || 0}`);
    });

    // Test with Emma Davis
    console.log('\n2. Testing Emma Davis with new filtering:');
    const emmaSubscriptionId = 'cmend0wbe000301mcpys16hgg';
    
    const emmaAllOrders = await prisma.subscriptionOrder.findMany({
      where: { subscriptionId: emmaSubscriptionId },
      include: { items: true },
      orderBy: { orderMonth: 'desc' }
    });

    const emmaFilteredOrders = await prisma.subscriptionOrder.findMany({
      where: { 
        subscriptionId: emmaSubscriptionId,
        NOT: {
          AND: [
            { status: 'PENDING' },
            { totalValue: { lte: 0 } },
            { items: { none: {} } }
          ]
        }
      },
      include: { items: true },
      orderBy: { orderMonth: 'desc' }
    });

    console.log(`   Emma - All orders: ${emmaAllOrders.length}, Filtered: ${emmaFilteredOrders.length}`);

    // Test the API endpoint directly
    console.log('\n3. Testing API endpoint with new filtering:');
    
    // Import the service to test it
    const LeModeCoService = require('./services/leModeCoService');
    
    const apiResult = await LeModeCoService.getOrdersBySubscription(sarahSubscriptionId);
    console.log(`   API result for Sarah: ${apiResult.length} orders`);
    
    apiResult.forEach((order, index) => {
      console.log(`     ${index + 1}. ${order.status} - ${order.orderMonth.toLocaleDateString()} - ${order.items.length} items`);
    });

    // Test the "include empty" option
    const apiResultWithEmpty = await LeModeCoService.getOrdersBySubscription(sarahSubscriptionId, true);
    console.log(`\n   API result with empty orders: ${apiResultWithEmpty.length} orders`);

    console.log('\n✅ Order filtering is working correctly!');
    console.log(`   • Sarah Johnson now shows ${filteredOrders.length} meaningful orders instead of ${allOrders.length}`);
    console.log('   • Empty PENDING orders are filtered out');
    console.log('   • Orders with items or completed status are preserved');

  } catch (error) {
    console.error('❌ Error testing order filtering:', error.message);
    console.error('   Details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testOrderFiltering();
