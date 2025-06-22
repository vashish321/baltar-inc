const { PrismaClient } = require('@prisma/client');
const EmailService = require('./emailService');

const prisma = new PrismaClient();

class QuoteService {
  // Create new quote
  static async createQuote(quoteData) {
    try {
      // Check if client exists, create if not
      let client = null;
      if (quoteData.email) {
        client = await prisma.client.findUnique({
          where: { email: quoteData.email }
        });

        if (!client) {
          // Split name into first and last name
          const nameParts = quoteData.name.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          client = await prisma.client.create({
            data: {
              email: quoteData.email,
              firstName: firstName,
              lastName: lastName,
              phone: quoteData.phone || null,
              company: quoteData.company || null
            }
          });
        }
      }

      // Create quote
      const quote = await prisma.quote.create({
        data: {
          clientId: client?.id || null,
          serviceType: quoteData.serviceType,
          name: quoteData.name,
          email: quoteData.email,
          phone: quoteData.phone || null,
          message: quoteData.message || null,
          
          // Savour & Sip specific fields
          eventType: quoteData.eventType || null,
          guestCount: quoteData.guestCount ? parseInt(quoteData.guestCount) : null,
          eventDate: quoteData.eventDate ? new Date(quoteData.eventDate) : null,
          services: quoteData.services ? JSON.stringify(quoteData.services) : null,
          
          // Frontend Web Design specific fields
          company: quoteData.company || null,
          websiteType: quoteData.websiteType || null,
          budget: quoteData.budget || null
        },
        include: {
          client: true
        }
      });

      return quote;
    } catch (error) {
      throw error;
    }
  }

  // Get all quotes with pagination and filters
  static async getAllQuotes(page = 1, limit = 50, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      
      const where = {};
      if (filters.status) where.status = filters.status;
      if (filters.serviceType) where.serviceType = filters.serviceType;

      const [quotes, total] = await Promise.all([
        prisma.quote.findMany({
          where,
          include: {
            client: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.quote.count({ where })
      ]);

      return {
        quotes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get quote by ID
  static async getQuoteById(quoteId) {
    try {
      const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: {
          client: true
        }
      });

      return quote;
    } catch (error) {
      throw error;
    }
  }

  // Update quote with pricing
  static async updateQuotePrice(quoteId, quotedAmount, adminNotes, adminId) {
    try {
      const quote = await prisma.quote.update({
        where: { id: quoteId },
        data: {
          quotedAmount: parseFloat(quotedAmount),
          adminNotes: adminNotes || null,
          quotedAt: new Date(),
          quotedBy: adminId,
          status: 'QUOTED'
        },
        include: {
          client: true
        }
      });

      return quote;
    } catch (error) {
      throw error;
    }
  }

  // Update quote status
  static async updateQuoteStatus(quoteId, status) {
    try {
      const quote = await prisma.quote.update({
        where: { id: quoteId },
        data: { status },
        include: {
          client: true
        }
      });

      return quote;
    } catch (error) {
      throw error;
    }
  }

  // Send quote email
  static async sendQuoteEmail(quoteId) {
    try {
      const quote = await this.getQuoteById(quoteId);
      
      if (!quote) {
        throw new Error('Quote not found');
      }

      if (quote.status !== 'QUOTED') {
        throw new Error('Quote must be priced before sending');
      }

      // Generate PDF and send email
      const result = await EmailService.sendQuoteEmail(quote);

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get quotes by service type
  static async getQuotesByServiceType(serviceType, page = 1, limit = 50) {
    try {
      return await this.getAllQuotes(page, limit, { serviceType });
    } catch (error) {
      throw error;
    }
  }

  // Get client quotes
  static async getClientQuotes(clientId) {
    try {
      const quotes = await prisma.quote.findMany({
        where: { clientId },
        include: {
          client: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return quotes;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = QuoteService;
