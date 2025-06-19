const { PrismaClient } = require('@prisma/client');
const InvoiceService = require('./invoiceService');
const prisma = new PrismaClient();

class ProjectService {
  // Create new project
  static async createProject(projectData) {
    try {
      const project = await prisma.project.create({
        data: {
          clientId: projectData.clientId,
          serviceType: projectData.serviceType,
          title: projectData.title,
          description: projectData.description || null,
          estimatedCost: projectData.estimatedCost || null,
          startDate: projectData.startDate ? new Date(projectData.startDate) : null,
          endDate: projectData.endDate ? new Date(projectData.endDate) : null,
          
          // Frontend Web Design specific
          websiteUrl: projectData.websiteUrl || null,
          domainName: projectData.domainName || null,
          hostingPlan: projectData.hostingPlan || null,
          
          // Savour & Sip specific
          eventDate: projectData.eventDate ? new Date(projectData.eventDate) : null,
          eventLocation: projectData.eventLocation || null,
          guestCount: projectData.guestCount || null,
          eventType: projectData.eventType || null
        },
        include: {
          client: true
        }
      });

      // Create initial tasks based on service type
      await this.createInitialTasks(project.id, project.serviceType);

      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Create initial tasks for a project
  static async createInitialTasks(projectId, serviceType) {
    try {
      let tasks = [];

      if (serviceType === 'FRONTEND_WEB_DESIGN') {
        tasks = [
          {
            title: 'Initial Consultation',
            description: 'Discuss requirements and project scope',
            priority: 'high'
          },
          {
            title: 'Design Mockups',
            description: 'Create initial design concepts',
            priority: 'high'
          },
          {
            title: 'Content Collection',
            description: 'Gather all content, images, and copy',
            priority: 'medium'
          },
          {
            title: 'Development',
            description: 'Build the website',
            priority: 'high'
          },
          {
            title: 'Testing & Review',
            description: 'Test functionality and client review',
            priority: 'medium'
          },
          {
            title: 'Launch',
            description: 'Deploy website and go live',
            priority: 'high'
          }
        ];
      } else if (serviceType === 'SAVOUR_AND_SIP') {
        tasks = [
          {
            title: 'Event Planning Consultation',
            description: 'Discuss event details and requirements',
            priority: 'high'
          },
          {
            title: 'Menu Planning',
            description: 'Design custom menu for the event',
            priority: 'high'
          },
          {
            title: 'Staff Assignment',
            description: 'Assign appropriate staff for the event',
            priority: 'medium'
          },
          {
            title: 'Equipment & Setup Planning',
            description: 'Plan equipment needs and setup requirements',
            priority: 'medium'
          },
          {
            title: 'Final Confirmation',
            description: 'Confirm all details 48 hours before event',
            priority: 'high'
          },
          {
            title: 'Event Execution',
            description: 'Execute the event services',
            priority: 'high'
          }
        ];
      }

      for (const task of tasks) {
        await prisma.task.create({
          data: {
            projectId,
            title: task.title,
            description: task.description,
            priority: task.priority
          }
        });
      }
    } catch (error) {
      console.error('Error creating initial tasks:', error);
      throw error;
    }
  }

  // Get project by ID
  static async getProjectById(projectId) {
    try {
      return await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          client: true,
          tasks: {
            orderBy: { createdAt: 'asc' }
          },
          invoices: {
            include: {
              invoiceItems: true,
              payments: true
            }
          },
          projectFiles: true
        }
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  // Update project
  static async updateProject(projectId, updateData) {
    try {
      return await prisma.project.update({
        where: { id: projectId },
        data: {
          ...updateData,
          updatedAt: new Date()
        },
        include: {
          client: true,
          tasks: true,
          invoices: true
        }
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Update project status
  static async updateProjectStatus(projectId, status) {
    try {
      const project = await prisma.project.update({
        where: { id: projectId },
        data: { 
          status,
          updatedAt: new Date()
        },
        include: {
          client: true
        }
      });

      // Auto-generate invoice when project is approved
      if (status === 'APPROVED' && project.estimatedCost) {
        try {
          await InvoiceService.autoGenerateInvoice(projectId);
        } catch (invoiceError) {
          console.error('Error auto-generating invoice:', invoiceError);
          // Don't fail the status update if invoice generation fails
        }
      }

      return project;
    } catch (error) {
      console.error('Error updating project status:', error);
      throw error;
    }
  }

  // Get all projects (admin)
  static async getAllProjects(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      
      const where = {};
      if (filters.status) where.status = filters.status;
      if (filters.serviceType) where.serviceType = filters.serviceType;
      if (filters.clientId) where.clientId = filters.clientId;

      const projects = await prisma.project.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              company: true
            }
          },
          _count: {
            select: {
              tasks: true,
              invoices: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      });

      const total = await prisma.project.count({ where });

      return {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching all projects:', error);
      throw error;
    }
  }

  // Get client projects
  static async getClientProjects(clientId) {
    try {
      return await prisma.project.findMany({
        where: { clientId },
        include: {
          tasks: {
            orderBy: { createdAt: 'asc' }
          },
          invoices: {
            include: {
              payments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching client projects:', error);
      throw error;
    }
  }

  // Delete project
  static async deleteProject(projectId) {
    try {
      return await prisma.project.delete({
        where: { id: projectId }
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Add task to project
  static async addTask(projectId, taskData) {
    try {
      return await prisma.task.create({
        data: {
          projectId,
          title: taskData.title,
          description: taskData.description || null,
          priority: taskData.priority || 'medium',
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null
        }
      });
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  // Update task
  static async updateTask(taskId, updateData) {
    try {
      return await prisma.task.update({
        where: { id: taskId },
        data: {
          ...updateData,
          ...(updateData.status === 'completed' && { completedAt: new Date() }),
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
}

module.exports = ProjectService;
