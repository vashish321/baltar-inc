const AuthService = require('../services/authService');

async function testAdminLogin() {
  try {
    console.log('🔐 Testing admin login...\n');

    const email = 'mumerfarooqlaghari@gmail.com';
    const password = '132VanDijk@!';

    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password.replace(/./g, '*')}`);
    console.log('');

    const result = await AuthService.loginAdmin(email, password);

    if (result.success) {
      console.log('✅ Login successful!');
      console.log('👤 Admin details:', {
        id: result.admin.id,
        email: result.admin.email,
        firstName: result.admin.firstName,
        lastName: result.admin.lastName,
        role: result.admin.role
      });
      console.log('🎫 JWT Token generated:', result.token ? 'Yes' : 'No');
      console.log('🔗 Token length:', result.token ? result.token.length : 0);
    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.error('❌ Login error:', error.message);
  }
}

testAdminLogin();
