const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testLeModeCoAPI() {
  console.log('🧪 Testing Le-Mode-Co API endpoints...\n');

  try {
    // Test 1: Get packages
    console.log('1. Testing GET /api/le-mode-co/packages');
    const packagesResponse = await axios.get(`${BASE_URL}/api/le-mode-co/packages`);
    console.log('✅ Packages fetched successfully');
    console.log(`   Found ${packagesResponse.data.packages.length} packages`);
    
    if (packagesResponse.data.packages.length > 0) {
      const firstPackage = packagesResponse.data.packages[0];
      console.log(`   First package: ${firstPackage.name} - $${firstPackage.price}/month`);
    }

    // Test 2: Create subscription (this will fail without valid data, but tests the endpoint)
    console.log('\n2. Testing POST /api/le-mode-co/subscribe (validation test)');
    try {
      await axios.post(`${BASE_URL}/api/le-mode-co/subscribe`, {});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Subscription validation working correctly');
        console.log(`   Expected error: ${error.response.data.error}`);
      } else {
        throw error;
      }
    }

    // Test 3: Test admin authentication requirement
    console.log('\n3. Testing admin authentication requirement');
    try {
      await axios.get(`${BASE_URL}/api/le-mode-co/admin/packages`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Admin authentication working correctly');
        console.log(`   Expected error: Authentication required`);
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All Le-Mode-Co API tests passed!');
    console.log('\n📋 Available endpoints:');
    console.log('   Public:');
    console.log('   - GET  /api/le-mode-co/packages');
    console.log('   - POST /api/le-mode-co/subscribe');
    console.log('   - POST /api/le-mode-co/create-payment-intent');
    console.log('   - POST /api/le-mode-co/confirm-payment');
    console.log('   \n   Admin (requires authentication):');
    console.log('   - GET    /api/le-mode-co/admin/packages');
    console.log('   - POST   /api/le-mode-co/admin/packages');
    console.log('   - PUT    /api/le-mode-co/admin/packages/:id');
    console.log('   - DELETE /api/le-mode-co/admin/packages/:id');
    console.log('   - GET    /api/le-mode-co/admin/subscriptions');
    console.log('   - GET    /api/le-mode-co/admin/subscriptions/:id/orders');
    console.log('   - POST   /api/le-mode-co/admin/orders/:id/items');
    console.log('   - PUT    /api/le-mode-co/admin/orders/:id/complete');
    console.log('   - POST   /api/le-mode-co/admin/orders/:id/notify');
    console.log('   - GET    /api/le-mode-co/admin/dashboard-stats');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run the test
testLeModeCoAPI();
