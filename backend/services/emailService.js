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
}

module.exports = EmailService;
