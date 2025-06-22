const brevo = require('@getbrevo/brevo');
require('dotenv').config();

async function testBrevoConnection() {
  try {
    console.log('Testing Brevo connection...');
    console.log('API Key:', process.env.BREVO_API_KEY ? 'Set' : 'Not set');
    
    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY not found in environment variables');
      return;
    }

    // Initialize Brevo client
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    const apiInstance = new brevo.TransactionalEmailsApi();

    // Test email
    const sendSmtpEmail = {
      subject: 'Test Email from Baltar Inc Admin Dashboard',
      htmlContent: `
        <html>
          <body>
            <h2>🎉 Brevo Integration Test Successful!</h2>
            <p>This is a test email to verify that the Brevo integration is working correctly.</p>
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>SMTP Server: ${process.env.BREVO_SMTP_SERVER}</li>
              <li>SMTP Port: ${process.env.BREVO_SMTP_PORT}</li>
              <li>SMTP Login: ${process.env.BREVO_SMTP_LOGIN}</li>
            </ul>
            <p>Best regards,<br>Baltar Inc Admin Dashboard</p>
          </body>
        </html>
      `,
      sender: { name: 'Baltar Inc', email: 'admin@baltar.com' },
      to: [{ email: 'admin@baltar.com', name: 'Admin Test' }]
    };

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Brevo integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Brevo test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBrevoConnection();
