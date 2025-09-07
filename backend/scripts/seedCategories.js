const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'CLOTHING', description: 'Clothing items including dresses, tops, bottoms', displayOrder: 1 },
  { name: 'ACCESSORIES', description: 'Fashion accessories like belts, scarves, and jewelry', displayOrder: 2 },
  { name: 'SHOES', description: 'Footwear including heels, flats, boots, and sneakers', displayOrder: 3 },
  { name: 'JEWELRY', description: 'Jewelry items including necklaces, earrings, bracelets', displayOrder: 4 },
  { name: 'BAGS', description: 'Handbags, purses, backpacks, and clutches', displayOrder: 5 },
  { name: 'OUTERWEAR', description: 'Coats, jackets, blazers, and cardigans', displayOrder: 6 },
  { name: 'ACTIVEWEAR', description: 'Sportswear and athletic clothing', displayOrder: 7 },
  { name: 'LINGERIE', description: 'Intimate apparel and undergarments', displayOrder: 8 },
  { name: 'OTHER', description: 'Miscellaneous fashion items', displayOrder: 9 }
];

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...');

    // Check if categories already exist
    const existingCategories = await prisma.category.findMany();
    
    if (existingCategories.length > 0) {
      console.log('📋 Categories already exist. Skipping seed.');
      return;
    }

    // Create categories
    for (const category of defaultCategories) {
      await prisma.category.create({
        data: category
      });
      console.log(`✅ Created category: ${category.name}`);
    }

    console.log('🎉 Categories seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCategories };
