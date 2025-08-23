const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Check if the new admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'mumerfarooqlaghari@gmail.com' }
    });

    if (existingAdmin) {
      console.log('Admin user with email mumerfarooqlaghari@gmail.com already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('132VanDijk@!', 12);

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email: 'mumerfarooqlaghari@gmail.com',
        password: hashedPassword,
        firstName: 'Umer',
        lastName: 'Farooq',
        role: 'admin'
      }
    });

    console.log('Admin user created successfully:', {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role
    });

    // Also check if the old default admin exists and show info
    const oldAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@admin.com' }
    });

    if (oldAdmin) {
      console.log('\nNote: Default admin (admin@admin.com) also exists in the database');
    }

  } catch (error) {
    console.error('Error seeding admin:', error);
    if (error.code === 'P2002') {
      console.error('This email is already registered as an admin user');
    }
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
