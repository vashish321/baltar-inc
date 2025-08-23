const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyAdmin() {
  try {
    console.log('🔍 Verifying admin user creation...\n');

    // Check if the new admin exists
    const newAdmin = await prisma.admin.findUnique({
      where: { email: 'mumerfarooqlaghari@gmail.com' }
    });

    if (newAdmin) {
      console.log('✅ Admin user found:');
      console.log({
        id: newAdmin.id,
        email: newAdmin.email,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
        updatedAt: newAdmin.updatedAt
      });
    } else {
      console.log('❌ Admin user not found');
    }

    // Get total admin count
    const totalAdmins = await prisma.admin.count();
    console.log(`\n📊 Total admin users in database: ${totalAdmins}`);

    // List all admin emails (for verification)
    const allAdmins = await prisma.admin.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    console.log('\n📋 All admin users:');
    allAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} (${admin.firstName} ${admin.lastName}) - ${admin.role}`);
    });

  } catch (error) {
    console.error('❌ Error verifying admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdmin();
