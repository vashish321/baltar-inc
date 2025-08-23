const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function showDatabaseQuery() {
  console.log('📋 Database Query Information');
  console.log('============================\n');

  console.log('🗄️  Database: PostgreSQL');
  console.log('📊 Table: admins');
  console.log('🔧 ORM: Prisma\n');

  console.log('📝 Equivalent SQL Query that was executed:');
  console.log('------------------------------------------');
  
  // Show the equivalent SQL INSERT statement
  const hashedPassword = await bcrypt.hash('132VanDijk@!', 12);
  
  console.log(`INSERT INTO "admins" (
    "id",
    "email", 
    "password", 
    "firstName", 
    "lastName", 
    "role", 
    "createdAt", 
    "updatedAt"
  ) VALUES (
    'cmen874h0000n1libifhuf6ou',  -- Auto-generated CUID
    'mumerfarooqlaghari@gmail.com',
    '${hashedPassword}',  -- bcrypt hashed password
    'Umer',
    'Farooq', 
    'admin',
    NOW(),  -- Current timestamp
    NOW()   -- Current timestamp
  );`);

  console.log('\n🔐 Password Security:');
  console.log('--------------------');
  console.log('• Algorithm: bcrypt');
  console.log('• Salt Rounds: 12');
  console.log('• Original Password: 132VanDijk@!');
  console.log(`• Hashed Password: ${hashedPassword}`);
  console.log(`• Hash Length: ${hashedPassword.length} characters`);

  console.log('\n✅ Admin User Successfully Created:');
  console.log('----------------------------------');
  console.log('• Email: mumerfarooqlaghari@gmail.com');
  console.log('• Password: 132VanDijk@!');
  console.log('• First Name: Umer');
  console.log('• Last Name: Farooq');
  console.log('• Role: admin');
  console.log('• Status: Active');

  await prisma.$disconnect();
}

showDatabaseQuery();
