const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ClientService {
  // Create new client
  static async createClient(clientData) {
    try {
      const client = await prisma.client.create({
        data: {
          email: clientData.email,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          phone: clientData.phone || null,
          company: clientData.company || null,
          address: clientData.address || null,
          city: clientData.city || null,
          province: clientData.province || null,
          postalCode: clientData.postalCode || null
        }
      });

      return client;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Client with this email already exists');
      }
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Get client by email
  static async getClientByEmail(email) {
    try {
      return await prisma.client.findUnique({
        where: { email },
        include: {
          projects: {
            orderBy: { createdAt: 'desc' }
          },
          invoices: {
            orderBy: { createdAt: 'desc' }
          },
          bookings: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching client by email:', error);
      throw error;
    }
  }

  // Get client by ID
  static async getClientById(clientId) {
    try {
      return await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          projects: {
            orderBy: { createdAt: 'desc' }
          },
          invoices: {
            orderBy: { createdAt: 'desc' }
          },
          bookings: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching client by ID:', error);
      throw error;
    }
  }

  // Update client
  static async updateClient(clientId, updateData) {
    try {
      return await prisma.client.update({
        where: { id: clientId },
        data: updateData
      });
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  // Get all clients (admin)
  static async getAllClients(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      const where = search ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } }
        ]
      } : {};

      const clients = await prisma.client.findMany({
        where,
        include: {
          projects: {
            select: {
              id: true,
              title: true,
              status: true,
              serviceType: true
            }
          },
          _count: {
            select: {
              projects: true,
              invoices: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      });

      const total = await prisma.client.count({ where });

      return {
        clients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching all clients:', error);
      throw error;
    }
  }

  // Find or create client
  static async findOrCreateClient(clientData) {
    try {
      let client = await this.getClientByEmail(clientData.email);
      
      if (!client) {
        client = await this.createClient(clientData);
      }

      return client;
    } catch (error) {
      console.error('Error finding or creating client:', error);
      throw error;
    }
  }

  // Delete client
  static async deleteClient(clientId) {
    try {
      return await prisma.client.delete({
        where: { id: clientId }
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  // Get client dashboard data
  static async getClientDashboard(clientId) {
    try {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          projects: {
            include: {
              tasks: {
                orderBy: { createdAt: 'desc' }
              },
              invoices: {
                include: {
                  payments: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          },
          invoices: {
            include: {
              invoiceItems: true,
              payments: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!client) {
        throw new Error('Client not found');
      }

      // Calculate summary statistics
      const totalProjects = client.projects.length;
      const activeProjects = client.projects.filter(p => 
        ['APPROVED', 'IN_PROGRESS'].includes(p.status)
      ).length;
      const completedProjects = client.projects.filter(p => 
        p.status === 'COMPLETED'
      ).length;

      const totalInvoices = client.invoices.length;
      const paidInvoices = client.invoices.filter(i => i.status === 'PAID').length;
      const pendingInvoices = client.invoices.filter(i => 
        ['DRAFT', 'SENT'].includes(i.status)
      ).length;

      const totalAmount = client.invoices.reduce((sum, inv) => sum + inv.total, 0);
      const paidAmount = client.invoices
        .filter(i => i.status === 'PAID')
        .reduce((sum, inv) => sum + inv.total, 0);
      const pendingAmount = totalAmount - paidAmount;

      return {
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          company: client.company
        },
        summary: {
          projects: {
            total: totalProjects,
            active: activeProjects,
            completed: completedProjects
          },
          invoices: {
            total: totalInvoices,
            paid: paidInvoices,
            pending: pendingInvoices
          },
          financial: {
            totalAmount,
            paidAmount,
            pendingAmount
          }
        },
        recentProjects: client.projects.slice(0, 5),
        recentInvoices: client.invoices.slice(0, 5)
      };
    } catch (error) {
      console.error('Error fetching client dashboard:', error);
      throw error;
    }
  }
}

module.exports = ClientService;
