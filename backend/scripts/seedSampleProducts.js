const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSampleProducts() {
  console.log('🌱 Seeding Sample Products...\n');

  try {
    // First, get all categories
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories`);

    // Create a map of category names to IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Sample products data
    const sampleProducts = [
      {
        name: 'Classic White Button-Down Shirt',
        description: 'Timeless white cotton button-down shirt perfect for any occasion',
        categoryName: 'CLOTHING',
        brand: 'Le Mode Co',
        color: 'White',
        size: 'M',
        price: 89.99,
        sku: 'LMC-SHIRT-001',
        stockQuantity: 50,
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80'
        ]
      },
      {
        name: 'Elegant Black Dress',
        description: 'Sophisticated black dress suitable for evening events',
        categoryName: 'CLOTHING',
        brand: 'Le Mode Co',
        color: 'Black',
        size: 'M',
        price: 149.99,
        sku: 'LMC-DRESS-001',
        stockQuantity: 30,
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'
        ]
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Premium leather crossbody bag with adjustable strap',
        categoryName: 'BAGS',
        brand: 'Le Mode Co',
        color: 'Brown',
        size: 'ONE_SIZE',
        price: 199.99,
        sku: 'LMC-BAG-001',
        stockQuantity: 25,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
        ]
      },
      {
        name: 'Gold Statement Necklace',
        description: 'Bold gold-plated statement necklace',
        categoryName: 'JEWELRY',
        brand: 'Le Mode Co',
        color: 'Gold',
        size: 'ONE_SIZE',
        price: 79.99,
        sku: 'LMC-JEWELRY-001',
        stockQuantity: 40,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ]
      },
      {
        name: 'Designer Sunglasses',
        description: 'Stylish designer sunglasses with UV protection',
        categoryName: 'ACCESSORIES',
        brand: 'Le Mode Co',
        color: 'Black',
        size: 'ONE_SIZE',
        price: 129.99,
        sku: 'LMC-SUNGLASS-001',
        stockQuantity: 35,
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'
        ]
      },
      {
        name: 'Ankle Boots',
        description: 'Comfortable leather ankle boots for everyday wear',
        categoryName: 'SHOES',
        brand: 'Le Mode Co',
        color: 'Brown',
        size: '8',
        price: 179.99,
        sku: 'LMC-BOOTS-001',
        stockQuantity: 20,
        images: [
          'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500'
        ]
      }
    ];

    console.log('Creating sample products...');

    // Create products
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const categoryId = categoryMap[productData.categoryName];
      
      if (!categoryId) {
        console.log(`⚠️ Category ${productData.categoryName} not found, skipping ${productData.name}`);
        continue;
      }

      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          categoryId: categoryId,
          brand: productData.brand,
          color: productData.color,
          size: productData.size,
          price: productData.price,
          sku: productData.sku,
          stockQuantity: productData.stockQuantity,
          isActive: true
        }
      });

      // Add images
      if (productData.images && productData.images.length > 0) {
        for (let i = 0; i < productData.images.length; i++) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              imageUrl: productData.images[i],
              altText: `${product.name} - Image ${i + 1}`,
              isPrimary: i === 0,
              sortOrder: i
            }
          });
        }
      }

      createdProducts.push(product);
      console.log(`✅ Created product: ${product.name} (${productData.categoryName})`);
    }

    console.log(`\n🎉 Successfully created ${createdProducts.length} sample products!`);

    // Show summary by category
    const summary = {};
    for (const product of createdProducts) {
      const category = categories.find(c => c.id === product.categoryId);
      const categoryName = category ? category.name : 'Unknown';
      summary[categoryName] = (summary[categoryName] || 0) + 1;
    }

    console.log('\n📊 Products by category:');
    Object.entries(summary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error seeding sample products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedSampleProducts()
    .then(() => {
      console.log('✨ Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSampleProducts };
