const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedLeModeCoPackages() {
  try {
    console.log('🌱 Seeding Le-Mode-Co subscription packages...');

    // Check if packages already exist
    const existingPackages = await prisma.subscriptionPackage.count();
    if (existingPackages > 0) {
      console.log('📦 Packages already exist, skipping seed...');
      return;
    }

    const packages = [
      {
        name: 'Essentials Box',
        price: 79.00,
        description: 'Perfect for building a minimalist wardrobe with curated essentials',
        features: [
          '3 curated outfits',
          'Exclusive accessories',
          'Free returns & exchanges',
          'Personal stylist access'
        ],
        bestFor: 'Minimalist wardrobe lovers',
        isPopular: false
      },
      {
        name: 'Luxury Box',
        price: 149.00,
        description: 'Premium fashion experience with designer brands and VIP treatment',
        features: [
          '6 premium outfits',
          'Designer brands',
          'Priority shipping',
          'VIP styling support'
        ],
        bestFor: 'Luxury lifestyle enthusiasts',
        isPopular: true
      },
      {
        name: 'Bespoke Box',
        price: 299.00,
        description: 'Fully customized fashion experience tailored to your unique style',
        features: [
          'Fully tailored wardrobe',
          'Exclusive collaborations',
          'Personal fashion consultant',
          'Priority events access'
        ],
        bestFor: 'Fashion-forward elites',
        isPopular: false
      },
      {
        name: 'Platinum Box',
        price: 499.00,
        description: 'The ultimate luxury fashion experience with exclusive haute couture pieces',
        features: [
          'Haute couture pieces',
          'Limited edition items',
          'Personal shopping sessions',
          'Exclusive fashion events',
          'White-glove delivery service'
        ],
        bestFor: 'Ultra-luxury fashion connoisseurs',
        isPopular: false
      }
    ];

    for (const packageData of packages) {
      const createdPackage = await prisma.subscriptionPackage.create({
        data: {
          ...packageData,
          features: JSON.stringify(packageData.features)
        }
      });
      
      console.log(`✅ Created package: ${createdPackage.name} - $${createdPackage.price}/month`);
    }

    console.log('🎉 Le-Mode-Co packages seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding packages:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedLeModeCoPackages()
    .then(() => {
      console.log('✨ Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedLeModeCoPackages;
