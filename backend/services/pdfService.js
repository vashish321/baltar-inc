const PDFDocument = require('pdfkit');

class PDFService {
  // Generate quote PDF
  static async generateQuotePDF(quote) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        const pageWidth = doc.page.width - 100; // Account for margins
        let currentY = 50;

        // Header Section
        doc.fontSize(32)
           .fillColor('#1a1a1a')
           .text('BALTAR INC', 50, currentY, { align: 'left' });

        currentY += 40;
        doc.fontSize(16)
           .fillColor('#666666')
           .text('PROFESSIONAL SERVICES QUOTATION', 50, currentY, { align: 'left' });

        currentY += 30;
        // Header line
        doc.moveTo(50, currentY)
           .lineTo(550, currentY)
           .strokeColor('#e5e7eb')
           .lineWidth(2)
           .stroke();

        currentY += 40;

        // Quote Information Section (Two columns)
        const leftCol = 50;
        const rightCol = 350;

        // Left column - Quote details
        doc.fontSize(12)
           .fillColor('#374151')
           .text('QUOTE DETAILS', leftCol, currentY);

        currentY += 20;
        doc.fontSize(11)
           .fillColor('#000000')
           .text(`Quote ID: ${quote.id}`, leftCol, currentY);

        currentY += 15;
        doc.text(`Date Issued: ${new Date(quote.createdAt).toLocaleDateString()}`, leftCol, currentY);

        currentY += 15;
        doc.text(`Status: ${quote.status}`, leftCol, currentY);

        // Right column - Client information
        const clientY = currentY - 50;
        doc.fontSize(12)
           .fillColor('#374151')
           .text('CLIENT INFORMATION', rightCol, clientY);

        doc.fontSize(11)
           .fillColor('#000000')
           .text(`${quote.name}`, rightCol, clientY + 20);

        doc.text(`${quote.email}`, rightCol, clientY + 35);

        if (quote.phone) {
          doc.text(`${quote.phone}`, rightCol, clientY + 50);
        }

        currentY += 60;

        // Service Details Section
        doc.fontSize(14)
           .fillColor('#1a1a1a')
           .text('SERVICE DETAILS', 50, currentY);

        currentY += 25;

        // Service details table-like layout
        const serviceDetails = [];

        if (quote.serviceType === 'SAVOUR_AND_SIP') {
          serviceDetails.push(['Service Type', 'Savour & Sip Hospitality Services']);
          if (quote.eventType) serviceDetails.push(['Event Type', quote.eventType]);
          if (quote.guestCount) serviceDetails.push(['Guest Count', quote.guestCount.toString()]);
          if (quote.eventDate) serviceDetails.push(['Event Date', new Date(quote.eventDate).toLocaleDateString()]);
          if (quote.services) {
            const services = JSON.parse(quote.services);
            serviceDetails.push(['Requested Services', services.join(', ')]);
          }
        } else if (quote.serviceType === 'FRONTEND_WEB_DESIGN') {
          serviceDetails.push(['Service Type', 'Frontend Web Design & Development']);
          if (quote.company) serviceDetails.push(['Company', quote.company]);
          if (quote.websiteType) serviceDetails.push(['Website Type', quote.websiteType]);
          if (quote.budget) serviceDetails.push(['Budget Range', quote.budget]);
        }

        // Render service details in clean rows
        serviceDetails.forEach(([label, value]) => {
          doc.fontSize(10)
             .fillColor('#6b7280')
             .text(label.toUpperCase(), 50, currentY);

          doc.fontSize(11)
             .fillColor('#000000')
             .text(value, 200, currentY);

          currentY += 18;
        });

        // Additional Details
        if (quote.message) {
          currentY += 20;
          doc.fontSize(12)
             .fillColor('#374151')
             .text('ADDITIONAL REQUIREMENTS', 50, currentY);

          currentY += 20;
          doc.fontSize(11)
             .fillColor('#000000')
             .text(quote.message, 50, currentY, {
               width: pageWidth,
               align: 'justify',
               lineGap: 3
             });

          currentY += doc.heightOfString(quote.message, { width: pageWidth }) + 20;
        }

        // Quote Amount Section (Highlighted)
        currentY += 30;
        const quoteBoxHeight = 80;

        // Background box
        doc.rect(50, currentY, pageWidth, quoteBoxHeight)
           .fillColor('#f8fafc')
           .fill();

        // Border
        doc.rect(50, currentY, pageWidth, quoteBoxHeight)
           .strokeColor('#e2e8f0')
           .lineWidth(1)
           .stroke();

        // Quote amount text
        doc.fontSize(14)
           .fillColor('#374151')
           .text('TOTAL QUOTE AMOUNT', 70, currentY + 20);

        doc.fontSize(28)
           .fillColor('#059669')
           .text(`$${quote.quotedAmount.toLocaleString()}`, 70, currentY + 40);

        currentY += quoteBoxHeight + 30;

        // Admin Notes
        if (quote.adminNotes) {
          doc.fontSize(12)
             .fillColor('#374151')
             .text('NOTES', 50, currentY);

          currentY += 20;
          doc.fontSize(11)
             .fillColor('#000000')
             .text(quote.adminNotes, 50, currentY, {
               width: pageWidth,
               align: 'justify',
               lineGap: 3
             });

          currentY += doc.heightOfString(quote.adminNotes, { width: pageWidth }) + 30;
        }

        // Footer
        const footerY = doc.page.height - 100;

        // Footer line
        doc.moveTo(50, footerY - 20)
           .lineTo(550, footerY - 20)
           .strokeColor('#e5e7eb')
           .lineWidth(1)
           .stroke();

        doc.fontSize(10)
           .fillColor('#6b7280')
           .text('Thank you for choosing Baltar Inc for your professional service needs.', 50, footerY, { align: 'center', width: pageWidth });

        doc.fontSize(9)
           .text('For questions regarding this quote, please contact us at admin@baltar.ca', 50, footerY + 15, { align: 'center', width: pageWidth });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Generate invoice PDF
  static async generateInvoicePDF(invoice) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        const pageWidth = doc.page.width - 100;
        let currentY = 50;

        // Header Section
        doc.fontSize(32)
           .fillColor('#1a1a1a')
           .text('BALTAR INC', 50, currentY, { align: 'left' });

        currentY += 40;
        doc.fontSize(16)
           .fillColor('#666666')
           .text('INVOICE', 50, currentY, { align: 'left' });

        currentY += 30;
        // Header line
        doc.moveTo(50, currentY)
           .lineTo(550, currentY)
           .strokeColor('#e5e7eb')
           .lineWidth(2)
           .stroke();

        currentY += 40;

        // Invoice Information Section (Two columns)
        const leftCol = 50;
        const rightCol = 350;

        // Left column - Invoice details
        doc.fontSize(12)
           .fillColor('#374151')
           .text('INVOICE DETAILS', leftCol, currentY);

        currentY += 20;
        doc.fontSize(11)
           .fillColor('#000000')
           .text(`Invoice Number: ${invoice.invoiceNumber}`, leftCol, currentY);

        currentY += 15;
        doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, leftCol, currentY);

        currentY += 15;
        doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, leftCol, currentY);

        // Right column - Bill to information
        const billToY = currentY - 50;
        doc.fontSize(12)
           .fillColor('#374151')
           .text('BILL TO', rightCol, billToY);

        doc.fontSize(11)
           .fillColor('#000000')
           .text(`${invoice.client.firstName} ${invoice.client.lastName}`, rightCol, billToY + 20);

        doc.text(`${invoice.client.email}`, rightCol, billToY + 35);

        if (invoice.client.phone) {
          doc.text(`${invoice.client.phone}`, rightCol, billToY + 50);
        }

        currentY += 80;

        // Service Description Section
        doc.fontSize(14)
           .fillColor('#1a1a1a')
           .text('SERVICES PROVIDED', 50, currentY);

        currentY += 30;

        // Service table header
        doc.rect(50, currentY, pageWidth, 25)
           .fillColor('#f8fafc')
           .fill();

        doc.rect(50, currentY, pageWidth, 25)
           .strokeColor('#e2e8f0')
           .lineWidth(1)
           .stroke();

        doc.fontSize(10)
           .fillColor('#374151')
           .text('DESCRIPTION', 60, currentY + 8);

        doc.text('AMOUNT', 450, currentY + 8);

        currentY += 25;

        // Service item
        doc.rect(50, currentY, pageWidth, 40)
           .strokeColor('#e2e8f0')
           .lineWidth(1)
           .stroke();

        doc.fontSize(12)
           .fillColor('#000000')
           .text(invoice.title, 60, currentY + 8);

        doc.fontSize(11)
           .text(`$${invoice.subtotal.toLocaleString()}`, 450, currentY + 8);

        if (invoice.description) {
          doc.fontSize(10)
             .fillColor('#6b7280')
             .text(invoice.description, 60, currentY + 25, { width: 350 });
        }

        currentY += 40;

        // Totals Section
        currentY += 30;
        const totalsStartY = currentY;

        // Subtotal
        doc.fontSize(11)
           .fillColor('#374151')
           .text('Subtotal:', 400, currentY);

        doc.fillColor('#000000')
           .text(`$${invoice.subtotal.toLocaleString()}`, 480, currentY);

        currentY += 20;

        // Tax (if applicable)
        if (invoice.tax > 0) {
          doc.fillColor('#374151')
             .text('Tax:', 400, currentY);

          doc.fillColor('#000000')
             .text(`$${invoice.tax.toLocaleString()}`, 480, currentY);

          currentY += 20;
        }

        // Total line
        doc.moveTo(380, currentY)
           .lineTo(550, currentY)
           .strokeColor('#374151')
           .lineWidth(1)
           .stroke();

        currentY += 15;

        // Total amount
        doc.fontSize(14)
           .fillColor('#1a1a1a')
           .text('TOTAL:', 400, currentY);

        doc.fontSize(16)
           .fillColor('#059669')
           .text(`$${invoice.total.toLocaleString()}`, 480, currentY);

        // Payment Terms
        currentY += 60;
        doc.fontSize(12)
           .fillColor('#374151')
           .text('PAYMENT TERMS', 50, currentY);

        currentY += 20;
        doc.fontSize(11)
           .fillColor('#000000')
           .text('Payment is due within 30 days of invoice date.', 50, currentY);

        // Footer
        const footerY = doc.page.height - 100;

        // Footer line
        doc.moveTo(50, footerY - 20)
           .lineTo(550, footerY - 20)
           .strokeColor('#e5e7eb')
           .lineWidth(1)
           .stroke();

        doc.fontSize(10)
           .fillColor('#6b7280')
           .text('Thank you for your business with Baltar Inc.', 50, footerY, { align: 'center', width: pageWidth });

        doc.fontSize(9)
           .text('For questions regarding this invoice, please contact us at admin@baltar.ca', 50, footerY + 15, { align: 'center', width: pageWidth });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFService;
