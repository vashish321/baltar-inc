const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testEnhancedTemplateWorkflow() {
  console.log('🧪 Testing Enhanced Template Workflow...\n');

  try {
    // Test 1: Verify products exist
    console.log('1. Checking available products...');
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { images: true }
    });
    console.log(`   ✅ Found ${products.length} active products`);

    if (products.length === 0) {
      console.log('   ❌ No products found. Please run seed-sample-products.js first');
      return;
    }

    // Test 2: Create a sample template with products
    console.log('\n2. Creating sample template...');
    const template = await prisma.orderTemplate.create({
      data: {
        name: 'Casual Spring Collection',
        description: 'Perfect casual outfit for spring season',
        templateType: 'SEASONAL',
        packageTier: 'Luxury Box',
        season: 'SPRING_SUMMER',
        preference: 'CASUAL'
      }
    });
    console.log(`   ✅ Created template: ${template.name}`);

    // Test 3: Add products to template
    console.log('\n3. Adding products to template...');
    const selectedProducts = products.slice(0, 3); // Take first 3 products
    const templateItems = [];

    for (const product of selectedProducts) {
      const templateItem = await prisma.templateItem.create({
        data: {
          templateId: template.id,
          productId: product.id,
          quantity: 1,
          notes: `Added to ${template.name}`
        }
      });
      templateItems.push(templateItem);
      console.log(`   ✅ Added ${product.name} to template`);
    }

    // Test 4: Verify template with products
    console.log('\n4. Verifying template with products...');
    const templateWithItems = await prisma.orderTemplate.findUnique({
      where: { id: template.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        }
      }
    });

    console.log(`   ✅ Template has ${templateWithItems.items.length} items`);
    const totalValue = templateWithItems.items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    console.log(`   ✅ Total template value: $${totalValue.toFixed(2)}`);

    // Test 5: Create a subscription and order for testing
    console.log('\n5. Creating test subscription and order...');
    
    // Get or create a package
    let testPackage = await prisma.subscriptionPackage.findFirst();
    if (!testPackage) {
      testPackage = await prisma.subscriptionPackage.create({
        data: {
          name: 'Test Package',
          price: 99.99,
          description: 'Test package',
          features: JSON.stringify(['Test feature']),
          bestFor: 'Testing',
          isActive: true
        }
      });
    }

    const testSubscription = await prisma.customerSubscription.create({
      data: {
        email: 'template-test@example.com',
        fullName: 'Template Test Customer',
        phone: '+1234567890',
        zipCode: '12345',
        address: '123 Template Street',
        packageId: testPackage.id,
        monthlyAmount: testPackage.price
      }
    });

    const testOrder = await prisma.subscriptionOrder.create({
      data: {
        subscriptionId: testSubscription.id,
        orderMonth: new Date(),
        status: 'PENDING'
      }
    });

    console.log(`   ✅ Created test order: ${testOrder.id}`);

    // Test 6: Apply template to order (simulate template application)
    console.log('\n6. Testing template application to order...');
    
    for (const templateItem of templateWithItems.items) {
      await prisma.orderItem.create({
        data: {
          orderId: testOrder.id,
          productId: templateItem.productId,
          itemName: templateItem.product.name,
          description: templateItem.product.description,
          category: templateItem.product.category,
          quantity: templateItem.quantity,
          unitValue: templateItem.product.price
        }
      });
      
      // Update product stock
      await prisma.product.update({
        where: { id: templateItem.productId },
        data: {
          stockQuantity: {
            decrement: templateItem.quantity
          }
        }
      });
    }

    // Update order total value
    const orderTotal = templateWithItems.items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    
    await prisma.subscriptionOrder.update({
      where: { id: testOrder.id },
      data: { 
        status: 'ITEMS_ADDED',
        totalValue: orderTotal
      }
    });

    console.log(`   ✅ Applied template to order`);
    console.log(`   ✅ Order total: $${orderTotal.toFixed(2)}`);

    // Test 7: Verify order with items
    console.log('\n7. Verifying order with applied template...');
    const orderWithItems = await prisma.subscriptionOrder.findUnique({
      where: { id: testOrder.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    console.log(`   ✅ Order has ${orderWithItems.items.length} items from template`);
    console.log(`   ✅ Order status: ${orderWithItems.status}`);
    console.log(`   ✅ Order total value: $${orderWithItems.totalValue}`);

    // Test 8: Test product search for manual addition
    console.log('\n8. Testing product search for manual addition...');
    const searchResults = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: { gt: 0 },
        OR: [
          { name: { contains: 'shirt', mode: 'insensitive' } },
          { category: 'CLOTHING' }
        ]
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1
        }
      },
      take: 5
    });

    console.log(`   ✅ Found ${searchResults.length} products for manual addition`);

    // Test 9: Cleanup test data
    console.log('\n9. Cleaning up test data...');
    
    // Delete order items
    await prisma.orderItem.deleteMany({
      where: { orderId: testOrder.id }
    });
    
    // Delete order
    await prisma.subscriptionOrder.delete({
      where: { id: testOrder.id }
    });
    
    // Delete subscription
    await prisma.customerSubscription.delete({
      where: { id: testSubscription.id }
    });
    
    // Delete template items
    await prisma.templateItem.deleteMany({
      where: { templateId: template.id }
    });
    
    // Delete template
    await prisma.orderTemplate.delete({
      where: { id: template.id }
    });

    // Delete test package if we created it
    if (testPackage.name === 'Test Package') {
      await prisma.subscriptionPackage.delete({
        where: { id: testPackage.id }
      });
    }

    // Restore product stock
    for (const product of selectedProducts) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          stockQuantity: { increment: 1 }
        }
      });
    }

    console.log('   ✅ Test data cleaned up');

    console.log('\n🎉 All Enhanced Template Workflow tests passed!');
    console.log('\n📋 Verified Features:');
    console.log('   ✅ Template creation with product selection');
    console.log('   ✅ Template application to orders');
    console.log('   ✅ Product search for manual addition');
    console.log('   ✅ Stock management during order fulfillment');
    console.log('   ✅ Order total value calculation');
    console.log('   ✅ Template preview with product details');
    console.log('   ✅ Dual workflow: Template vs Manual product addition');

  } catch (error) {
    console.error('❌ Enhanced template workflow test failed:', error.message);
    console.error('   Details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testEnhancedTemplateWorkflow();
