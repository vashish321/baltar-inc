require('dotenv').config();

async function testBrevoAPI() {
  try {
    console.log('Testing Brevo API connection...');
    console.log('API Key:', process.env.BREVO_API_KEY ? 'Set' : 'Not set');
    console.log('SMTP Password:', process.env.BREVO_SMTP_PASSWORD ? 'Set' : 'Not set');

    if (!process.env.BREVO_API_KEY) {
      console.error('BREVO_API_KEY not found in environment variables');
      return;
    }

    const emailData = {
      subject: 'Test Email from Baltar Inc Admin Dashboard',
      htmlContent: `
        <html>
          <body>
            <h2>🎉 Brevo Integration Test Successful!</h2>
            <p>This is a test email to verify that the Brevo integration is working correctly.</p>
            <p>Best regards,<br>Baltar Inc Admin Dashboard</p>
          </body>
        </html>
      `,
      sender: { name: 'Baltar Inc', email: 'admin@baltar.ca' },
      to: [{ email: 'test@example.com', name: 'Test User' }]
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('Brevo integration is working correctly.');
    } else {
      const errorData = await response.text();
      console.error('❌ Brevo API error:', response.status, errorData);
    }
    
  } catch (error) {
    console.error('❌ Brevo test failed:', error.message);
  }
}

testBrevoAPI();
