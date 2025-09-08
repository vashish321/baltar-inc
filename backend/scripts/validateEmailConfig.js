require('dotenv').config();
const EmailService = require('../services/emailService');

async function validateEmailConfiguration() {
  console.log('📧 Validating Email Configuration...');
  console.log('='.repeat(50));

  try {
    // Test 1: Check environment variables
    console.log('\n1. Checking environment variables...');
    const requiredEnvVars = ['BREVO_API_KEY', 'BREVO_FROM_EMAIL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log(`❌ Missing environment variables: ${missingVars.join(', ')}`);
      return false;
    }
    console.log('✅ All required environment variables are set');
    console.log(`   BREVO_API_KEY: ${process.env.BREVO_API_KEY ? 'Set (***' + process.env.BREVO_API_KEY.slice(-4) + ')' : 'Not set'}`);
    console.log(`   BREVO_FROM_EMAIL: ${process.env.BREVO_FROM_EMAIL || 'Not set'}`);

    // Test 2: Validate API key format
    console.log('\n2. Validating API key format...');
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey && apiKey.length > 10) {
      console.log('✅ API key format appears valid');
    } else {
      console.log('❌ API key format appears invalid');
      return false;
    }

    // Test 3: Test email template generation
    console.log('\n3. Testing email template generation...');
    try {
      const testData = {
        customerName: 'Test Customer',
        packageName: 'Test Package',
        orderMonth: new Date()
      };

      // Test Le Mode Co notification template
      const notificationHTML = EmailService.generateLeModeCoNotificationHTML(
        testData.customerName,
        testData.packageName,
        testData.orderMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      );

      if (notificationHTML && notificationHTML.includes(testData.customerName)) {
        console.log('✅ Le Mode Co notification template generated successfully');
      } else {
        console.log('❌ Le Mode Co notification template generation failed');
        return false;
      }

      // Test shipping notification template
      const shippingHTML = EmailService.generateShippingNotificationHTML({
        ...testData,
        trackingNumber: 'TEST123456789'
      });

      if (shippingHTML && shippingHTML.includes('TEST123456789')) {
        console.log('✅ Shipping notification template generated successfully');
      } else {
        console.log('❌ Shipping notification template generation failed');
        return false;
      }

      // Test delivery confirmation template
      const deliveryHTML = EmailService.generateDeliveryConfirmationHTML(testData);

      if (deliveryHTML && deliveryHTML.includes(testData.customerName)) {
        console.log('✅ Delivery confirmation template generated successfully');
      } else {
        console.log('❌ Delivery confirmation template generation failed');
        return false;
      }

    } catch (error) {
      console.log('❌ Email template generation failed:', error.message);
      return false;
    }

    // Test 4: Validate email service methods
    console.log('\n4. Validating email service methods...');
    const requiredMethods = [
      'sendBrevoEmail',
      'sendLeModeCoOrderNotification',
      'sendOrderStatusNotification',
      'generateLeModeCoNotificationHTML',
      'generateShippingNotificationHTML',
      'generateDeliveryConfirmationHTML'
    ];

    const missingMethods = requiredMethods.filter(method => typeof EmailService[method] !== 'function');
    
    if (missingMethods.length > 0) {
      console.log(`❌ Missing email service methods: ${missingMethods.join(', ')}`);
      return false;
    }
    console.log('✅ All required email service methods are available');

    console.log('\n✅ Email configuration validation passed!');
    console.log('\n📝 Notes:');
    console.log('   - Email sending requires IP whitelisting in Brevo dashboard');
    console.log('   - Add your server IP to: https://app.brevo.com/security/authorised_ips');
    console.log('   - Test actual email sending after IP whitelisting');

    return true;

  } catch (error) {
    console.error('❌ Email configuration validation failed:', error);
    return false;
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  validateEmailConfiguration()
    .then((success) => {
      if (success) {
        console.log('✅ Email configuration validation completed successfully');
        process.exit(0);
      } else {
        console.log('❌ Email configuration validation failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Validation failed:', error);
      process.exit(1);
    });
}

module.exports = { validateEmailConfiguration };
