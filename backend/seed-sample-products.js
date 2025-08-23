const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSampleProducts() {
  console.log('🌱 Seeding Sample Products...\n');

  try {
    // Sample products data
    const sampleProducts = [
      {
        name: 'Classic White Button-Down Shirt',
        description: 'Timeless white cotton button-down shirt perfect for any occasion',
        category: 'CLOTHING',
        brand: 'Le Mode Co',
        color: 'White',
        size: 'M',
        price: 89.99,
        sku: 'LMC-SHIRT-001',
        stockQuantity: 50
      },
      {
        name: 'Elegant Black Dress',
        description: 'Sophisticated black dress suitable for evening events',
        category: 'CLOTHING',
        brand: 'Le Mode Co',
        color: 'Black',
        size: 'M',
        price: 149.99,
        sku: 'LMC-DRESS-001',
        stockQuantity: 30
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Premium leather crossbody bag with adjustable strap',
        category: 'BAGS',
        brand: 'Le Mode Co',
        color: 'Brown',
        size: 'ONE_SIZE',
        price: 199.99,
        sku: 'LMC-BAG-001',
        stockQuantity: 25
      },
      {
        name: 'Gold Statement Necklace',
        description: 'Bold gold-plated statement necklace',
        category: 'JEWELRY',
        brand: 'Le Mode Co',
        color: 'Gold',
        size: 'ONE_SIZE',
        price: 79.99,
        sku: 'LMC-JEWELRY-001',
        stockQuantity: 40
      },
      {
        name: 'Silk Scarf',
        description: 'Luxurious silk scarf with floral pattern',
        category: 'ACCESSORIES',
        brand: 'Le Mode Co',
        color: 'Multi',
        size: 'ONE_SIZE',
        price: 59.99,
        sku: 'LMC-SCARF-001',
        stockQuantity: 35
      },
      {
        name: 'Ankle Boots',
        description: 'Stylish leather ankle boots with block heel',
        category: 'SHOES',
        brand: 'Le Mode Co',
        color: 'Black',
        size: 'M',
        price: 179.99,
        sku: 'LMC-SHOES-001',
        stockQuantity: 20
      },
      {
        name: 'Cashmere Sweater',
        description: 'Soft cashmere sweater in neutral tone',
        category: 'CLOTHING',
        brand: 'Le Mode Co',
        color: 'Beige',
        size: 'M',
        price: 229.99,
        sku: 'LMC-SWEATER-001',
        stockQuantity: 15
      },
      {
        name: 'Designer Sunglasses',
        description: 'Trendy oversized sunglasses with UV protection',
        category: 'ACCESSORIES',
        brand: 'Le Mode Co',
        color: 'Black',
        size: 'ONE_SIZE',
        price: 129.99,
        sku: 'LMC-SUNGLASSES-001',
        stockQuantity: 30
      },
      {
        name: 'Wool Coat',
        description: 'Elegant wool coat for cold weather',
        category: 'OUTERWEAR',
        brand: 'Le Mode Co',
        color: 'Navy',
        size: 'M',
        price: 349.99,
        sku: 'LMC-COAT-001',
        stockQuantity: 12
      },
      {
        name: 'Pearl Earrings',
        description: 'Classic pearl stud earrings',
        category: 'JEWELRY',
        brand: 'Le Mode Co',
        color: 'White',
        size: 'ONE_SIZE',
        price: 89.99,
        sku: 'LMC-EARRINGS-001',
        stockQuantity: 45
      }
    ];

    console.log('Creating sample products...');
    
    // Check if products already exist
    const existingProducts = await prisma.product.findMany();
    if (existingProducts.length > 0) {
      console.log(`Found ${existingProducts.length} existing products. Skipping seed.`);
      return;
    }

    // Create products
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: productData
      });
      createdProducts.push(product);
      console.log(`   ✅ Created: ${product.name} (${product.sku})`);
    }

    console.log(`\n🎉 Successfully created ${createdProducts.length} sample products!`);
    
    // Create sample product images (placeholder URLs)
    console.log('\nCreating sample product images...');
    for (const product of createdProducts) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: `https://via.placeholder.com/400x400/d4af37/000000?text=${encodeURIComponent(product.name)}`,
          altText: product.name,
          isPrimary: true,
          sortOrder: 0
        }
      });
      console.log(`   ✅ Added image for: ${product.name}`);
    }

    console.log('\n📋 Sample Products Summary:');
    console.log(`   • ${createdProducts.filter(p => p.category === 'CLOTHING').length} Clothing items`);
    console.log(`   • ${createdProducts.filter(p => p.category === 'ACCESSORIES').length} Accessories`);
    console.log(`   • ${createdProducts.filter(p => p.category === 'SHOES').length} Shoes`);
    console.log(`   • ${createdProducts.filter(p => p.category === 'JEWELRY').length} Jewelry items`);
    console.log(`   • ${createdProducts.filter(p => p.category === 'BAGS').length} Bags`);
    console.log(`   • ${createdProducts.filter(p => p.category === 'OUTERWEAR').length} Outerwear`);

  } catch (error) {
    console.error('❌ Error seeding sample products:', error.message);
    console.error('   Details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedSampleProducts();
