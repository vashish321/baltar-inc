const PDFService = require('./pdfService');
const nodemailer = require('nodemailer');

class EmailService {
  // Create SMTP transporter for Brevo
  static createSMTPTransporter() {
    return nodemailer.createTransport({
      host: process.env.BREVO_SMTP_SERVER,
      port: parseInt(process.env.BREVO_SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_PASSWORD
      }
    });
  }

  // Send email via Brevo API directly
  static async sendBrevoEmail(emailData) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Brevo API error: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }

  // Send email via SMTP
  static async sendSMTPEmail(emailData, pdfBuffer, filename) {
    const transporter = this.createSMTPTransporter();

    const mailOptions = {
      from: `"${emailData.sender.name}" <${emailData.sender.email}>`,
      to: emailData.to.map(recipient => `"${recipient.name}" <${recipient.email}>`).join(', '),
      subject: emailData.subject,
      html: emailData.htmlContent,
      attachments: pdfBuffer ? [{
        filename: filename,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }] : []
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  }

  // Send quote email with PDF
  static async sendQuoteEmail(quote) {
    try {
      // Generate PDF
      const pdfBuffer = await PDFService.generateQuotePDF(quote);

      // Try SMTP first since we have the credentials
      if (process.env.BREVO_SMTP_LOGIN && process.env.BREVO_SMTP_PASSWORD) {
        console.log('Attempting to send quote email via Brevo SMTP...');

        const emailData = {
          subject: `Quote from Baltar Inc - ${quote.serviceType === 'SAVOUR_AND_SIP' ? 'Savour & Sip' : 'Frontend Web Design'}`,
          htmlContent: this.generateQuoteEmailHTML(quote),
          sender: { name: 'Baltar Inc', email: process.env.BREVO_FROM_EMAIL || 'admin@baltar.ca' },
          to: [{ email: quote.email, name: quote.name }]
        };

        const result = await this.sendSMTPEmail(emailData, pdfBuffer, `Quote-${quote.id}.pdf`);

        console.log('✅ Quote email sent via Brevo SMTP:', result.messageId);

        return {
          success: true,
          message: 'Quote email sent successfully via SMTP',
          emailId: result.messageId
        };
      } else {
        throw new Error('Brevo SMTP credentials not configured. Please set BREVO_SMTP_LOGIN and BREVO_SMTP_PASSWORD in environment variables.');
      }
    } catch (error) {
      console.error('Error sending quote email via Brevo:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      throw new Error('Failed to send quote email: ' + error.message);
    }
  }

  // Send invoice email with PDF
  static async sendInvoiceEmail(invoice) {
    try {
      // Generate PDF
      const pdfBuffer = await PDFService.generateInvoicePDF(invoice);

      // Try SMTP first since we have the credentials
      if (process.env.BREVO_SMTP_LOGIN && process.env.BREVO_SMTP_PASSWORD) {
        console.log('Attempting to send invoice email via Brevo SMTP...');

        const emailData = {
          subject: `Invoice ${invoice.invoiceNumber} from Baltar Inc`,
          htmlContent: this.generateInvoiceEmailHTML(invoice),
          sender: { name: 'Baltar Inc', email: process.env.BREVO_FROM_EMAIL || 'admin@baltar.ca' },
          to: [{ email: invoice.client.email, name: `${invoice.client.firstName} ${invoice.client.lastName}` }]
        };

        const result = await this.sendSMTPEmail(emailData, pdfBuffer, `Invoice-${invoice.invoiceNumber}.pdf`);

        console.log('✅ Invoice email sent via Brevo SMTP:', result.messageId);

        return {
          success: true,
          message: 'Invoice email sent successfully via SMTP',
          emailId: result.messageId
        };
      } else {
        throw new Error('Brevo SMTP credentials not configured. Please set BREVO_SMTP_LOGIN and BREVO_SMTP_PASSWORD in environment variables.');
      }
    } catch (error) {
      console.error('Error sending invoice email via Brevo:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      throw new Error('Failed to send invoice email: ' + error.message);
    }
  }

  // Generate quote email HTML
  static generateQuoteEmailHTML(quote) {
    const serviceType = quote.serviceType === 'SAVOUR_AND_SIP' ? 'Savour & Sip' : 'Frontend Web Design';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quote from Baltar Inc</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .quote-amount { background: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚡ Baltar Inc</h1>
            <p>Your ${serviceType} Quote is Ready</p>
          </div>
          <div class="content">
            <h2>Hello ${quote.name},</h2>
            <p>Thank you for your interest in our ${serviceType} services. We've prepared a custom quote based on your requirements.</p>

            <div class="quote-amount">
              <h3>Quote Amount: $${quote.quotedAmount.toLocaleString()}</h3>
            </div>

            ${quote.adminNotes ? `<p><strong>Notes:</strong> ${quote.adminNotes}</p>` : ''}

            <p>Please find the detailed quote attached as a PDF. If you have any questions or would like to proceed, please don't hesitate to contact us.</p>

            <p>We look forward to working with you!</p>

            <p>Best regards,<br>The Baltar Inc Team</p>
          </div>
          <div class="footer">
            <p>Baltar Inc | Email: admin@baltar.ca</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate invoice email HTML
  static generateInvoiceEmailHTML(invoice) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice from Baltar Inc</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .invoice-details { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚡ Baltar Inc</h1>
            <p>Invoice ${invoice.invoiceNumber}</p>
          </div>
          <div class="content">
            <h2>Hello ${invoice.client.firstName} ${invoice.client.lastName},</h2>
            <p>Thank you for choosing Baltar Inc. Please find your invoice attached.</p>

            <div class="invoice-details">
              <h3>Invoice Details</h3>
              <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Service:</strong> ${invoice.title}</p>
              <p><strong>Amount:</strong> $${invoice.total.toLocaleString()}</p>
              <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>

            <p>Payment terms: Net 30 days</p>
            <p>If you have any questions about this invoice, please contact us.</p>

            <p>Thank you for your business!</p>

            <p>Best regards,<br>The Baltar Inc Team</p>
          </div>
          <div class="footer">
            <p>Baltar Inc | Email: admin@baltar.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Setup Brevo integration
  static setupBrevo(apiKey) {
    process.env.BREVO_API_KEY = apiKey;
    console.log('Brevo API key configured');
  }

  // Send Le-Mode-Co order notification
  static async sendLeModeCoOrderNotification(emailData) {
    try {
      const { to, customerName, packageName, orderMonth } = emailData;

      const monthName = orderMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      if (process.env.BREVO_SMTP_LOGIN && process.env.BREVO_SMTP_PASSWORD) {
        console.log('Attempting to send Le-Mode-Co notification via Brevo SMTP...');

        const emailData = {
          subject: `Your ${packageName} is Ready! 📦✨`,
          htmlContent: this.generateLeModeCoNotificationHTML(customerName, packageName, monthName),
          sender: { name: 'Le Mode Co', email: process.env.BREVO_FROM_EMAIL || 'admin@baltar.ca' },
          to: [{ email: to, name: customerName }]
        };

        const result = await this.sendBrevoEmail(emailData);
        console.log('Le-Mode-Co notification sent successfully via Brevo SMTP');
        return result;
      } else {
        throw new Error('Email configuration not available');
      }
    } catch (error) {
      console.error('Error sending Le-Mode-Co notification:', error);
      throw error;
    }
  }

  // Generate Le-Mode-Co notification email HTML
  static generateLeModeCoNotificationHTML(customerName, packageName, monthName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Fashion Box is Ready!</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #d4af37, #f4e4bc); padding: 40px 30px; text-align: center; }
          .header h1 { color: #000; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #d4af37; margin-bottom: 20px; font-size: 24px; }
          .content p { margin-bottom: 15px; font-size: 16px; }
          .highlight { background-color: #f8f9fa; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer p { margin: 5px 0; font-size: 14px; color: #6c757d; }
          .surprise-box { background: linear-gradient(135deg, #fff, #f8f9fa); border: 2px solid #d4af37; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
          .surprise-box h3 { color: #d4af37; margin-bottom: 15px; font-size: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Le Mode Co</h1>
          </div>

          <div class="content">
            <h2>Hello ${customerName}! 👋</h2>

            <p>We're thrilled to let you know that your <strong>${packageName}</strong> for <strong>${monthName}</strong> has been carefully curated and is ready for you!</p>

            <div class="surprise-box">
              <h3>🎁 Your Surprise Awaits</h3>
              <p>Our styling team has handpicked exclusive pieces just for you. Each item has been selected to elevate your wardrobe and reflect the latest fashion trends.</p>
            </div>

            <div class="highlight">
              <p><strong>What happens next?</strong></p>
              <p>Your beautifully packaged fashion box will be shipped to your address within the next 2-3 business days. You'll receive a tracking number once it's on its way!</p>
            </div>

            <p>We can't wait for you to discover what's inside your ${packageName}. Remember, each piece is a surprise, carefully chosen to complement your style and bring excitement to your fashion journey.</p>

            <p>If you have any questions or concerns, please don't hesitate to reach out to our customer service team.</p>

            <p>Happy styling!</p>
            <p><strong>The Le Mode Co Team</strong></p>
          </div>

          <div class="footer">
            <p>Le Mode Co - Curated Fashion Delivered</p>
            <p>This email was sent regarding your ${packageName} subscription.</p>
            <p>© ${new Date().getFullYear()} Le Mode Co. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Send order status notification
  static async sendOrderStatusNotification(emailData) {
    try {
      const { to, subject, notificationType, templateData } = emailData;

      if (process.env.BREVO_SMTP_LOGIN && process.env.BREVO_SMTP_PASSWORD) {
        console.log(`Attempting to send ${notificationType} notification via Brevo SMTP...`);

        let htmlContent;
        switch (notificationType) {
          case 'SHIPPING_NOTIFICATION':
            htmlContent = this.generateShippingNotificationHTML(templateData);
            break;
          case 'DELIVERY_CONFIRMATION':
            htmlContent = this.generateDeliveryConfirmationHTML(templateData);
            break;
          default:
            htmlContent = this.generateLeModeCoNotificationHTML(
              templateData.customerName,
              templateData.packageName,
              templateData.orderMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            );
        }

        const emailData = {
          subject,
          htmlContent,
          sender: { name: 'Le Mode Co', email: process.env.BREVO_FROM_EMAIL || 'admin@baltar.ca' },
          to: [{ email: to, name: templateData.customerName }]
        };

        const result = await this.sendBrevoEmail(emailData);
        console.log(`${notificationType} notification sent successfully via Brevo SMTP`);
        return result;
      } else {
        throw new Error('Email configuration not available');
      }
    } catch (error) {
      console.error(`Error sending ${notificationType} notification:`, error);
      throw error;
    }
  }

  // Generate shipping notification email HTML
  static generateShippingNotificationHTML(templateData) {
    const { customerName, packageName, trackingNumber, orderMonth } = templateData;
    const monthName = orderMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Package is on its way!</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #d4af37, #f4e4bc); padding: 40px 30px; text-align: center; }
          .header h1 { color: #000; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #d4af37; margin-bottom: 20px; font-size: 24px; }
          .content p { margin-bottom: 15px; font-size: 16px; }
          .tracking-box { background: linear-gradient(135deg, #fff, #f8f9fa); border: 2px solid #d4af37; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
          .tracking-box h3 { color: #d4af37; margin-bottom: 15px; font-size: 20px; }
          .tracking-number { font-size: 18px; font-weight: bold; color: #2d3748; background: #f7fafc; padding: 10px; border-radius: 5px; margin: 10px 0; }
          .highlight { background-color: #f8f9fa; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer p { margin: 5px 0; font-size: 14px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Le Mode Co</h1>
          </div>

          <div class="content">
            <h2>Great News, ${customerName}! 📦</h2>

            <p>Your <strong>${packageName}</strong> for <strong>${monthName}</strong> has been shipped and is on its way to you!</p>

            ${trackingNumber ? `
            <div class="tracking-box">
              <h3>🚚 Track Your Package</h3>
              <p>Your tracking number is:</p>
              <div class="tracking-number">${trackingNumber}</div>
              <p>You can track your package using this number with your shipping carrier.</p>
            </div>
            ` : ''}

            <div class="highlight">
              <p><strong>What to expect:</strong></p>
              <p>Your package should arrive within 3-5 business days. You'll receive another notification once it's delivered!</p>
            </div>

            <p>We're excited for you to discover the carefully curated pieces our styling team has selected just for you.</p>

            <p>If you have any questions about your shipment, please don't hesitate to contact our customer service team.</p>

            <p>Happy styling!</p>
            <p><strong>The Le Mode Co Team</strong></p>
          </div>

          <div class="footer">
            <p>Le Mode Co - Curated Fashion Delivered</p>
            <p>This email was sent regarding your ${packageName} subscription.</p>
            <p>© ${new Date().getFullYear()} Le Mode Co. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate delivery confirmation email HTML
  static generateDeliveryConfirmationHTML(templateData) {
    const { customerName, packageName, orderMonth } = templateData;
    const monthName = orderMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Package has been delivered!</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #d4af37, #f4e4bc); padding: 40px 30px; text-align: center; }
          .header h1 { color: #000; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 2px; }
          .content { padding: 40px 30px; }
          .content h2 { color: #d4af37; margin-bottom: 20px; font-size: 24px; }
          .content p { margin-bottom: 15px; font-size: 16px; }
          .celebration-box { background: linear-gradient(135deg, #fff, #f8f9fa); border: 2px solid #d4af37; border-radius: 10px; padding: 25px; margin: 25px 0; text-align: center; }
          .celebration-box h3 { color: #d4af37; margin-bottom: 15px; font-size: 20px; }
          .highlight { background-color: #f8f9fa; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
          .footer p { margin: 5px 0; font-size: 14px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Le Mode Co</h1>
          </div>

          <div class="content">
            <h2>Your Package Has Arrived, ${customerName}! 🎉</h2>

            <p>We're thrilled to let you know that your <strong>${packageName}</strong> for <strong>${monthName}</strong> has been successfully delivered!</p>

            <div class="celebration-box">
              <h3>🎁 Time to Unbox Your Style</h3>
              <p>Your carefully curated fashion pieces are waiting for you. We can't wait to see how you style them!</p>
            </div>

            <div class="highlight">
              <p><strong>Share Your Style:</strong></p>
              <p>We'd love to see how you style your new pieces! Tag us on social media @lemodecoofficial for a chance to be featured.</p>
            </div>

            <p>If you have any questions about your items or need assistance with sizing, our customer service team is here to help.</p>

            <p>Thank you for being a valued Le Mode Co subscriber. We're already working on your next month's surprise!</p>

            <p>Happy styling!</p>
            <p><strong>The Le Mode Co Team</strong></p>
          </div>

          <div class="footer">
            <p>Le Mode Co - Curated Fashion Delivered</p>
            <p>This email was sent regarding your ${packageName} subscription.</p>
            <p>© ${new Date().getFullYear()} Le Mode Co. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = EmailService;
