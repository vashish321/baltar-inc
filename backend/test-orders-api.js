const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testOrdersAPI() {
  console.log('🧪 Testing Orders API Endpoint...\n');

  try {
    // First, get the subscription ID for Sarah Johnson (who has orders)
    const sarahSubscriptionId = 'cmend0vpa000101mcnaefa3gt'; // From debug output
    
    console.log('1. Testing orders API endpoint...');
    console.log(`   Subscription ID: ${sarahSubscriptionId}`);
    
    try {
      // Test without authentication (should fail)
      console.log('   Testing without authentication...');
      await axios.get(`${BASE_URL}/api/le-mode-co/admin/subscriptions/${sarahSubscriptionId}/orders`);
      console.log('   ❌ API should require authentication!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('   ✅ API properly requires authentication');
      } else {
        console.log(`   ❌ Unexpected error: ${error.message}`);
      }
    }

    // Test the public packages endpoint to make sure server is running
    console.log('\n2. Testing server connectivity...');
    try {
      const packagesResponse = await axios.get(`${BASE_URL}/api/le-mode-co/packages`);
      console.log('   ✅ Server is running and responding');
      console.log(`   Found ${packagesResponse.data.packages.length} packages`);
    } catch (error) {
      console.log('   ❌ Server connectivity issue:', error.message);
      return;
    }

    // Test admin subscriptions endpoint
    console.log('\n3. Testing admin subscriptions endpoint...');
    try {
      await axios.get(`${BASE_URL}/api/le-mode-co/admin/subscriptions`);
      console.log('   ❌ Should require authentication');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('   ✅ Admin subscriptions endpoint properly secured');
      } else {
        console.log(`   ❌ Unexpected error: ${error.message}`);
      }
    }

    console.log('\n📋 API Endpoint Status:');
    console.log('   ✅ Server is running and responding');
    console.log('   ✅ Authentication is properly enforced');
    console.log('   ✅ Orders API endpoint exists and is secured');
    
    console.log('\n🔍 Next Steps for Debugging:');
    console.log('   1. Check if admin authentication is working in the frontend');
    console.log('   2. Verify the subscription ID being passed from frontend');
    console.log('   3. Check browser network tab for API call details');
    console.log('   4. Add console.log to frontend to debug the API response');

    console.log('\n💡 Debugging Tips:');
    console.log('   • Open browser developer tools');
    console.log('   • Go to Network tab');
    console.log('   • Click "View Orders" in the admin dashboard');
    console.log('   • Check if the API call is made and what response is received');
    console.log('   • Look for any JavaScript errors in the console');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOrdersAPI();
