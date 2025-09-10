require('dotenv').config();
const AuthService = require('../services/authService');

async function testOrderEndpoint() {
  try {
    console.log('🔧 Testing Order Endpoint...');
    
    // Get admin token
    const loginResult = await AuthService.loginAdmin('BaltarInc@admin.com', 'Click@123');
    const token = loginResult.token;
    console.log('✅ Admin token obtained');

    // Test the order endpoint
    const subscriptionId = 'cmfbhvse5000402edazf5flkk';
    const response = await fetch(`http://localhost:5000/api/le-mode-co/admin/subscriptions/${subscriptionId}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();
    console.log('📊 Order endpoint response:');
    console.log('Status:', response.status);
    console.log('Success:', result.success);
    console.log('Orders count:', result.orders?.length || 0);
    
    if (result.orders && result.orders.length > 0) {
      const order = result.orders[0];
      console.log('✅ Order found:');
      console.log('  - ID:', order.id);
      console.log('  - Status:', order.status);
      console.log('  - Items:', order.items?.length || 0);
      console.log('  - Created:', order.createdAt);
    } else {
      console.log('❌ No orders returned');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOrderEndpoint();
