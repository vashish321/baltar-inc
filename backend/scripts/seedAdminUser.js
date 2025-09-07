const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdminUser() {
  try {
    console.log('🔐 Creating admin user...');

    const email = 'BaltarInc@admin.com';
    const password = 'Click@123';

    // Check if admin user already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists. Updating password...');

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update the existing user
      await prisma.admin.update({
        where: { email },
        data: {
          password: hashedPassword
        }
      });

      console.log('✅ Admin user password updated successfully!');
    } else {
      console.log('👤 Creating new admin user...');

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new admin user
      await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          firstName: 'Baltar Inc',
          lastName: 'Admin',
          role: 'admin'
        }
      });

      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin User Details:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ADMIN`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedAdminUser()
    .then(() => {
      console.log('✅ Admin user seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Admin user seed failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAdminUser };
