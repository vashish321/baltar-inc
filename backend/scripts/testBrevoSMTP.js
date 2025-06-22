const nodemailer = require('nodemailer');
require('dotenv').config();

async function testBrevoSMTP() {
  try {
    console.log('Testing Brevo SMTP connection...');
    console.log('SMTP Server:', process.env.BREVO_SMTP_SERVER);
    console.log('SMTP Port:', process.env.BREVO_SMTP_PORT);
    console.log('SMTP Login:', process.env.BREVO_SMTP_LOGIN);
    console.log('SMTP Password:', process.env.BREVO_SMTP_PASSWORD ? 'Set' : 'Not set');
    
    if (!process.env.BREVO_SMTP_LOGIN || !process.env.BREVO_SMTP_PASSWORD) {
      console.error('SMTP credentials not found in environment variables');
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.BREVO_SMTP_SERVER,
      port: parseInt(process.env.BREVO_SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_PASSWORD
      }
    });

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    // Send test email
    const mailOptions = {
      from: '"Baltar Inc" <admin@baltar.com>',
      to: 'test@example.com',
      subject: 'Test Email from Baltar Inc Admin Dashboard (SMTP)',
      html: `
        <html>
          <body>
            <h2>🎉 Brevo SMTP Integration Test Successful!</h2>
            <p>This is a test email to verify that the Brevo SMTP integration is working correctly.</p>
            <p><strong>Configuration Details:</strong></p>
            <ul>
              <li>SMTP Server: ${process.env.BREVO_SMTP_SERVER}</li>
              <li>SMTP Port: ${process.env.BREVO_SMTP_PORT}</li>
              <li>SMTP Login: ${process.env.BREVO_SMTP_LOGIN}</li>
            </ul>
            <p>Best regards,<br>Baltar Inc Admin Dashboard</p>
          </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully via SMTP!');
    console.log('Message ID:', result.messageId);
    console.log('Brevo SMTP integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Brevo SMTP test failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.response) {
      console.error('SMTP response:', error.response);
    }
  }
}

testBrevoSMTP();
