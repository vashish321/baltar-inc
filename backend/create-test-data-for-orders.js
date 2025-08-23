const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestDataForOrders() {
  console.log('🧪 Creating Test Data for Orders Management...\n');

  try {
    // Step 1: Ensure we have packages
    console.log('1. Checking subscription packages...');
    let packages = await prisma.subscriptionPackage.findMany();
    
    if (packages.length === 0) {
      console.log('   Creating sample packages...');
      const samplePackages = [
        {
          name: 'Essentials Box',
          price: 69.99,
          description: 'Perfect starter package with essential fashion items',
          features: JSON.stringify(['3-4 curated items', 'Basic styling guide', 'Free shipping']),
          bestFor: 'Fashion beginners',
          isPopular: false,
          isActive: true
        },
        {
          name: 'Luxury Box',
          price: 149.99,
          description: 'Premium fashion curation with luxury brands',
          features: JSON.stringify(['5-6 premium items', 'Personal stylist consultation', 'Priority shipping', 'Exclusive brands']),
          bestFor: 'Fashion enthusiasts',
          isPopular: true,
          isActive: true
        }
      ];

      for (const packageData of samplePackages) {
        await prisma.subscriptionPackage.create({ data: packageData });
      }
      packages = await prisma.subscriptionPackage.findMany();
      console.log(`   ✅ Created ${packages.length} packages`);
    } else {
      console.log(`   ✅ Found ${packages.length} existing packages`);
    }

    // Step 2: Create test customers with different payment statuses
    console.log('\n2. Creating test customers with subscriptions...');
    
    const testCustomers = [
      {
        email: 'sarah.johnson@example.com',
        fullName: 'Sarah Johnson',
        phone: '+1-555-0101',
        zipCode: '10001',
        address: '123 Fashion Ave, New York, NY 10001',
        packageId: packages[0].id,
        monthlyAmount: packages[0].price,
        paymentStatus: 'PAID',
        status: 'ACTIVE',
        preferences: JSON.stringify({
          style: 'casual',
          colors: ['blue', 'black', 'white'],
          sizes: ['M'],
          categories: ['clothing', 'accessories']
        })
      },
      {
        email: 'emma.davis@example.com',
        fullName: 'Emma Davis',
        phone: '+1-555-0102',
        zipCode: '90210',
        address: '456 Style Blvd, Beverly Hills, CA 90210',
        packageId: packages[1].id,
        monthlyAmount: packages[1].price,
        paymentStatus: 'PAID',
        status: 'ACTIVE',
        preferences: JSON.stringify({
          style: 'trendy',
          colors: ['pink', 'gold', 'cream'],
          sizes: ['S'],
          categories: ['clothing', 'jewelry', 'bags']
        })
      },
      {
        email: 'michael.brown@example.com',
        fullName: 'Michael Brown',
        phone: '+1-555-0103',
        zipCode: '60601',
        address: '789 Trend St, Chicago, IL 60601',
        packageId: packages[0].id,
        monthlyAmount: packages[0].price,
        paymentStatus: 'PENDING',
        status: 'PENDING',
        preferences: JSON.stringify({
          style: 'classic',
          colors: ['navy', 'gray', 'brown'],
          sizes: ['L'],
          categories: ['clothing', 'accessories']
        })
      }
    ];

    const createdSubscriptions = [];
    for (const customerData of testCustomers) {
      // Check if customer already exists
      const existingSubscription = await prisma.customerSubscription.findFirst({
        where: { email: customerData.email }
      });

      if (!existingSubscription) {
        const subscription = await prisma.customerSubscription.create({
          data: customerData,
          include: { package: true }
        });
        createdSubscriptions.push(subscription);
        console.log(`   ✅ Created subscription for ${subscription.fullName} (${subscription.paymentStatus})`);
      } else {
        createdSubscriptions.push(existingSubscription);
        console.log(`   ✅ Found existing subscription for ${existingSubscription.fullName}`);
      }
    }

    // Step 3: Create orders for paid subscriptions
    console.log('\n3. Creating orders for paid subscriptions...');
    
    const paidSubscriptions = createdSubscriptions.filter(sub => sub.paymentStatus === 'PAID');
    const createdOrders = [];

    for (const subscription of paidSubscriptions) {
      // Create multiple orders for different months
      const orderMonths = [
        new Date('2024-01-01'),
        new Date('2024-02-01'),
        new Date('2024-03-01')
      ];

      for (let i = 0; i < orderMonths.length; i++) {
        const orderMonth = orderMonths[i];
        const statuses = ['COMPLETED', 'ITEMS_ADDED', 'PENDING'];
        const status = statuses[i];

        // Check if order already exists
        const existingOrder = await prisma.subscriptionOrder.findFirst({
          where: {
            subscriptionId: subscription.id,
            orderMonth: orderMonth
          }
        });

        if (!existingOrder) {
          const order = await prisma.subscriptionOrder.create({
            data: {
              subscriptionId: subscription.id,
              orderMonth: orderMonth,
              status: status,
              totalValue: status === 'COMPLETED' ? subscription.monthlyAmount : 0,
              trackingNumber: status === 'COMPLETED' ? `TRK${Date.now()}${i}` : null,
              shippedAt: status === 'COMPLETED' ? new Date() : null,
              isNotified: status === 'COMPLETED'
            }
          });
          createdOrders.push(order);
          console.log(`   ✅ Created ${status} order for ${subscription.fullName} (${orderMonth.toLocaleDateString()})`);
        }
      }
    }

    // Step 4: Add items to some orders
    console.log('\n4. Adding items to orders...');
    
    // Get some products to add to orders
    const products = await prisma.product.findMany({
      where: { isActive: true },
      take: 5
    });

    if (products.length > 0) {
      for (const order of createdOrders) {
        if (order.status === 'ITEMS_ADDED' || order.status === 'COMPLETED') {
          // Add 2-3 random products to each order
          const numItems = Math.floor(Math.random() * 2) + 2; // 2-3 items
          const selectedProducts = products.slice(0, numItems);

          for (const product of selectedProducts) {
            // Check if item already exists
            const existingItem = await prisma.orderItem.findFirst({
              where: {
                orderId: order.id,
                productId: product.id
              }
            });

            if (!existingItem) {
              await prisma.orderItem.create({
                data: {
                  orderId: order.id,
                  productId: product.id,
                  itemName: product.name,
                  description: product.description,
                  category: product.category,
                  quantity: 1,
                  unitValue: product.price
                }
              });
            }
          }

          // Update order total value
          const orderItems = await prisma.orderItem.findMany({
            where: { orderId: order.id },
            include: { product: true }
          });

          const totalValue = orderItems.reduce((sum, item) => 
            sum + (item.unitValue * item.quantity), 0
          );

          await prisma.subscriptionOrder.update({
            where: { id: order.id },
            data: { totalValue }
          });

          console.log(`   ✅ Added ${orderItems.length} items to order (Total: $${totalValue.toFixed(2)})`);
        }
      }
    }

    // Step 5: Create some notification logs
    console.log('\n5. Creating notification logs...');
    
    const completedOrders = createdOrders.filter(order => order.status === 'COMPLETED');
    for (const order of completedOrders) {
      const subscription = createdSubscriptions.find(sub => sub.id === order.subscriptionId);
      
      const existingNotification = await prisma.notificationLog.findFirst({
        where: {
          orderId: order.id,
          notificationType: 'DELIVERY_CONFIRMATION'
        }
      });

      if (!existingNotification) {
        await prisma.notificationLog.create({
          data: {
            orderId: order.id,
            subscriptionId: subscription.id,
            notificationType: 'DELIVERY_CONFIRMATION',
            recipientEmail: subscription.email,
            subject: `Your ${subscription.package.name} is ready!`,
            content: `Hi ${subscription.fullName}, your monthly fashion box has been curated and is ready for shipment.`,
            deliveryStatus: 'success',
            sentAt: new Date()
          }
        });
        console.log(`   ✅ Created notification log for ${subscription.fullName}`);
      }
    }

    // Step 6: Display summary
    console.log('\n📋 Test Data Summary:');
    
    const allSubscriptions = await prisma.customerSubscription.findMany({
      include: { package: true }
    });
    
    const allOrders = await prisma.subscriptionOrder.findMany({
      include: {
        subscription: true,
        items: {
          include: { product: true }
        }
      }
    });

    console.log(`   • ${allSubscriptions.length} total subscriptions`);
    console.log(`   • ${allSubscriptions.filter(s => s.paymentStatus === 'PAID').length} paid subscriptions`);
    console.log(`   • ${allSubscriptions.filter(s => s.paymentStatus === 'PENDING').length} pending payment subscriptions`);
    console.log(`   • ${allOrders.length} total orders`);
    console.log(`   • ${allOrders.filter(o => o.status === 'COMPLETED').length} completed orders`);
    console.log(`   • ${allOrders.filter(o => o.status === 'ITEMS_ADDED').length} orders with items added`);
    console.log(`   • ${allOrders.filter(o => o.status === 'PENDING').length} pending orders`);

    console.log('\n🎉 Test data creation completed successfully!');
    console.log('\n📝 You can now:');
    console.log('   1. View subscriptions in the admin dashboard');
    console.log('   2. Update payment status using the dropdown');
    console.log('   3. Click "View Orders" to see customer orders');
    console.log('   4. Test product addition functionality on existing orders');
    console.log('   5. Test template application on pending orders');

  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
    console.error('   Details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestDataForOrders();
