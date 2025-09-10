require('dotenv').config();
const AuthService = require('../services/authService');

async function testTemplateApplication() {
  try {
    console.log('🔧 Testing Template Application...');
    
    // Get admin token
    const loginResult = await AuthService.loginAdmin('BaltarInc@admin.com', 'Click@123');
    const token = loginResult.token;
    console.log('✅ Admin token obtained');

    // Test template application
    const orderId = 'cmfbijyx7000a02edaeh8ttdj';
    const templateId = 'cmf9vh4fa000r2vjp82l47rob'; // From our earlier test
    
    console.log(`📋 Applying template ${templateId} to order ${orderId}...`);
    
    const response = await fetch(`http://localhost:5000/api/le-mode-co/admin/orders/${orderId}/apply-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ templateId })
    });

    const result = await response.json();
    console.log('📊 Template application response:');
    console.log('Status:', response.status);
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ Template applied successfully!');
      console.log(`📦 Items added: ${result.itemsAdded}`);
      
      // Check order items
      const orderResponse = await fetch(`http://localhost:5000/api/le-mode-co/admin/subscriptions/cmfbhvse5000402edazf5flkk/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const orderResult = await orderResponse.json();
      if (orderResult.orders && orderResult.orders.length > 0) {
        const order = orderResult.orders[0];
        console.log(`📋 Order now has ${order.items?.length || 0} items`);
      }
    } else {
      console.log('❌ Template application failed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTemplateApplication();
