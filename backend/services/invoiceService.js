const { PrismaClient } = require('@prisma/client');
const EmailService = require('./emailService');
const prisma = new PrismaClient();

class InvoiceService {
  // Generate invoice number
  static generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${year}${month}-${timestamp}`;
  }

  // Calculate tax (13% HST for Ontario)
  static calculateTax(subtotal, taxRate = 0.13) {
    return Math.round(subtotal * taxRate * 100) / 100;
  }

  // Create invoice for Frontend Web Design
  static async createFrontendWebDesignInvoice(projectId, items) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { client: true }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const tax = this.calculateTax(subtotal);
      const total = subtotal + tax;

      const invoice = await prisma.invoice.create({
        data: {
          clientId: project.clientId,
          projectId: projectId,
          invoiceNumber: this.generateInvoiceNumber(),
          title: `Website Development - ${project.title}`,
          description: `Professional website development services for ${project.client.company || project.client.firstName + ' ' + project.client.lastName}`,
          subtotal: subtotal,
          tax: tax,
          total: total,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          invoiceItems: {
            create: items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice
            }))
          }
        },
        include: {
          invoiceItems: true,
          client: true,
          project: true
        }
      });

      return invoice;
    } catch (error) {
      console.error('Error creating frontend web design invoice:', error);
      throw error;
    }
  }

  // Create invoice for Savour & Sip
  static async createSavourAndSipInvoice(projectId, items) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { client: true }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const tax = this.calculateTax(subtotal);
      const total = subtotal + tax;

      const invoice = await prisma.invoice.create({
        data: {
          clientId: project.clientId,
          projectId: projectId,
          invoiceNumber: this.generateInvoiceNumber(),
          title: `Hospitality Services - ${project.eventType || 'Event'}`,
          description: `Professional hospitality and catering services for ${project.eventLocation} on ${project.eventDate ? new Date(project.eventDate).toLocaleDateString() : 'TBD'}`,
          subtotal: subtotal,
          tax: tax,
          total: total,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
          invoiceItems: {
            create: items.map(item => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.quantity * item.unitPrice
            }))
          }
        },
        include: {
          invoiceItems: true,
          client: true,
          project: true
        }
      });

      return invoice;
    } catch (error) {
      console.error('Error creating Savour & Sip invoice:', error);
      throw error;
    }
  }

  // Auto-generate invoice from project
  static async autoGenerateInvoice(projectId) {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { client: true }
      });

      if (!project) {
        throw new Error('Project not found');
      }

      let items = [];

      if (project.serviceType === 'FRONTEND_WEB_DESIGN') {
        // Default items for web design based on estimated cost
        const basePrice = project.estimatedCost || 1500;
        items = [
          {
            description: 'Website Design & Development',
            quantity: 1,
            unitPrice: basePrice * 0.7
          },
          {
            description: 'Domain & Hosting Setup',
            quantity: 1,
            unitPrice: basePrice * 0.1
          },
          {
            description: 'SEO Optimization',
            quantity: 1,
            unitPrice: basePrice * 0.1
          },
          {
            description: 'Training & Support',
            quantity: 1,
            unitPrice: basePrice * 0.1
          }
        ];

        return await this.createFrontendWebDesignInvoice(projectId, items);
      } else if (project.serviceType === 'SAVOUR_AND_SIP') {
        // Default items for catering based on guest count and estimated cost
        const basePrice = project.estimatedCost || 2000;
        const guestCount = project.guestCount || 50;
        
        items = [
          {
            description: 'Catering Services',
            quantity: guestCount,
            unitPrice: Math.round((basePrice * 0.6) / guestCount * 100) / 100
          },
          {
            description: 'Service Staff',
            quantity: Math.ceil(guestCount / 25), // 1 staff per 25 guests
            unitPrice: Math.round((basePrice * 0.3) / Math.ceil(guestCount / 25) * 100) / 100
          },
          {
            description: 'Equipment & Setup',
            quantity: 1,
            unitPrice: basePrice * 0.1
          }
        ];

        return await this.createSavourAndSipInvoice(projectId, items);
      }

      throw new Error('Invalid service type');
    } catch (error) {
      console.error('Error auto-generating invoice:', error);
      throw error;
    }
  }

  // Get all invoices for a client
  static async getClientInvoices(clientId) {
    try {
      return await prisma.invoice.findMany({
        where: { clientId },
        include: {
          invoiceItems: true,
          project: true,
          payments: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching client invoices:', error);
      throw error;
    }
  }

  // Update invoice status
  static async updateInvoiceStatus(invoiceId, status) {
    try {
      return await prisma.invoice.update({
        where: { id: invoiceId },
        data: { 
          status,
          ...(status === 'PAID' && { paidDate: new Date() })
        },
        include: {
          invoiceItems: true,
          client: true,
          project: true
        }
      });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  // Record payment
  static async recordPayment(invoiceId, amount, paymentMethod, transactionId) {
    try {
      const payment = await prisma.payment.create({
        data: {
          invoiceId,
          amount,
          paymentMethod,
          transactionId,
          status: 'COMPLETED',
          paidAt: new Date()
        }
      });

      // Update invoice status to paid if fully paid
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { payments: true }
      });

      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
      
      if (totalPaid >= invoice.total) {
        await this.updateInvoiceStatus(invoiceId, 'PAID');
      }

      return payment;
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }

  // Generate and send invoice (for admin dashboard)
  static async generateAndSendInvoice(invoiceData) {
    try {
      const {
        serviceType,
        customerName,
        customerEmail,
        cost,
        eventType,
        guestCount,
        websiteType,
        projectDescription,
        adminId
      } = invoiceData;

      // Check if client exists, create if not
      let client = await prisma.client.findUnique({
        where: { email: customerEmail }
      });

      if (!client) {
        // Split name into first and last name
        const nameParts = customerName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        client = await prisma.client.create({
          data: {
            email: customerEmail,
            firstName: firstName,
            lastName: lastName
          }
        });
      }

      // Calculate tax and total
      const subtotal = cost;
      const tax = this.calculateTax(subtotal);
      const total = subtotal + tax;

      // Create invoice title based on service type
      let title = '';
      let description = '';

      if (serviceType === 'SAVOUR_AND_SIP') {
        title = `Hospitality Services - ${eventType || 'Event'}`;
        description = `Professional hospitality and catering services${guestCount ? ` for ${guestCount} guests` : ''}`;
      } else if (serviceType === 'FRONTEND_WEB_DESIGN') {
        title = `Website Development - ${websiteType || 'Custom Website'}`;
        description = projectDescription || 'Professional website development services';
      }

      // Create invoice
      const invoice = await prisma.invoice.create({
        data: {
          clientId: client.id,
          invoiceNumber: this.generateInvoiceNumber(),
          title: title,
          description: description,
          subtotal: subtotal,
          tax: tax,
          total: total,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          invoiceItems: {
            create: [{
              description: title,
              quantity: 1,
              unitPrice: subtotal,
              total: subtotal
            }]
          }
        },
        include: {
          invoiceItems: true,
          client: true
        }
      });

      // Send invoice email
      const emailResult = await EmailService.sendInvoiceEmail(invoice);

      return {
        invoice,
        emailResult
      };
    } catch (error) {
      console.error('Error generating and sending invoice:', error);
      throw error;
    }
  }
}

module.exports = InvoiceService;
