const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class TemplateService {
  // Create new template
  static async createTemplate(templateData, adminId) {
    try {
      const {
        name,
        description,
        templateType,
        packageTier,
        season,
        preference,
        items = []
      } = templateData;

      const template = await prisma.orderTemplate.create({
        data: {
          name,
          description,
          templateType,
          packageTier,
          season,
          preference,
          createdBy: adminId
        }
      });

      // Add items to template
      if (items.length > 0) {
        await this.addItemsToTemplate(template.id, items);
      }

      return await this.getTemplateById(template.id);
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  // Get all templates with filters
  static async getAllTemplates(filters = {}) {
    try {
      const {
        templateType,
        packageTier,
        season,
        preference,
        isActive = true,
        page = 1,
        limit = 20
      } = filters;

      const skip = (page - 1) * limit;
      const where = {};

      if (templateType) where.templateType = templateType;
      if (packageTier) where.packageTier = packageTier;
      if (season) where.season = season;
      if (preference) where.preference = preference;
      if (typeof isActive === 'boolean') where.isActive = isActive;

      const [templates, total] = await Promise.all([
        prisma.orderTemplate.findMany({
          where,
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                      take: 1
                    }
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: parseInt(skip),
          take: parseInt(limit)
        }),
        prisma.orderTemplate.count({ where })
      ]);

      return {
        templates,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  // Get template by ID
  static async getTemplateById(templateId) {
    try {
      const template = await prisma.orderTemplate.findUnique({
        where: { id: templateId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1
                  }
                }
              }
            }
          }
        }
      });

      if (!template) {
        throw new Error('Template not found');
      }

      return template;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  }

  // Update template
  static async updateTemplate(templateId, updateData) {
    try {
      const { items, ...templateData } = updateData;

      const template = await prisma.orderTemplate.update({
        where: { id: templateId },
        data: templateData
      });

      // Update items if provided
      if (items) {
        // Remove existing items
        await prisma.templateItem.deleteMany({
          where: { templateId }
        });

        // Add new items
        if (items.length > 0) {
          await this.addItemsToTemplate(templateId, items);
        }
      }

      return await this.getTemplateById(templateId);
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  // Delete template (soft delete)
  static async deleteTemplate(templateId) {
    try {
      await prisma.orderTemplate.update({
        where: { id: templateId },
        data: { isActive: false }
      });

      return { success: true, message: 'Template deactivated successfully' };
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }

  // Add items to template
  static async addItemsToTemplate(templateId, items) {
    try {
      const templateItems = items.map(item => ({
        templateId,
        productId: item.productId,
        quantity: item.quantity || 1,
        notes: item.notes
      }));

      await prisma.templateItem.createMany({
        data: templateItems
      });

      return { success: true, message: 'Items added to template successfully' };
    } catch (error) {
      console.error('Error adding items to template:', error);
      throw error;
    }
  }

  // Apply template to order
  static async applyTemplateToOrder(templateId, orderId) {
    try {
      const template = await this.getTemplateById(templateId);
      
      if (!template) {
        throw new Error('Template not found');
      }

      const OrderManagementService = require('./orderManagementService');
      const addedItems = [];

      // Add each template item to the order
      for (const templateItem of template.items) {
        try {
          const orderItem = await OrderManagementService.addProductToOrder(
            orderId,
            templateItem.productId,
            templateItem.quantity,
            templateItem.notes
          );
          addedItems.push(orderItem);
        } catch (error) {
          console.warn(`Failed to add product ${templateItem.product.name} to order:`, error.message);
          // Continue with other items even if one fails
        }
      }

      return {
        success: true,
        message: `Template applied successfully. ${addedItems.length} items added to order.`,
        addedItems,
        template
      };
    } catch (error) {
      console.error('Error applying template to order:', error);
      throw error;
    }
  }

  // Get templates by subscription package
  static async getTemplatesByPackage(packageTier) {
    try {
      const templates = await prisma.orderTemplate.findMany({
        where: {
          isActive: true,
          OR: [
            { packageTier },
            { templateType: 'SUBSCRIPTION_TIER', packageTier }
          ]
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return templates;
    } catch (error) {
      console.error('Error fetching templates by package:', error);
      throw error;
    }
  }

  // Get seasonal templates
  static async getSeasonalTemplates(season) {
    try {
      const templates = await prisma.orderTemplate.findMany({
        where: {
          isActive: true,
          season
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return templates;
    } catch (error) {
      console.error('Error fetching seasonal templates:', error);
      throw error;
    }
  }

  // Create template from existing order
  static async createTemplateFromOrder(orderId, templateData, adminId) {
    try {
      const { name, description, templateType, packageTier, season, preference } = templateData;

      // Get order items
      const order = await prisma.subscriptionOrder.findUnique({
        where: { id: orderId },
        include: {
          items: {
            where: { productId: { not: null } } // Only items with products
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Create template
      const template = await prisma.orderTemplate.create({
        data: {
          name,
          description,
          templateType,
          packageTier,
          season,
          preference,
          createdBy: adminId
        }
      });

      // Add items from order to template
      const templateItems = order.items.map(item => ({
        templateId: template.id,
        productId: item.productId,
        quantity: item.quantity,
        notes: `From order ${order.id}`
      }));

      await prisma.templateItem.createMany({
        data: templateItems
      });

      return await this.getTemplateById(template.id);
    } catch (error) {
      console.error('Error creating template from order:', error);
      throw error;
    }
  }

  // Get template statistics
  static async getTemplateStats() {
    try {
      const [
        totalTemplates,
        activeTemplates,
        templatesByType,
        templatesByPackage
      ] = await Promise.all([
        prisma.orderTemplate.count(),
        prisma.orderTemplate.count({ where: { isActive: true } }),
        prisma.orderTemplate.groupBy({
          by: ['templateType'],
          where: { isActive: true },
          _count: { templateType: true }
        }),
        prisma.orderTemplate.groupBy({
          by: ['packageTier'],
          where: { 
            isActive: true,
            packageTier: { not: null }
          },
          _count: { packageTier: true }
        })
      ]);

      return {
        totalTemplates,
        activeTemplates,
        templatesByType: templatesByType.map(t => ({
          type: t.templateType,
          count: t._count.templateType
        })),
        templatesByPackage: templatesByPackage.map(t => ({
          package: t.packageTier,
          count: t._count.packageTier
        }))
      };
    } catch (error) {
      console.error('Error fetching template stats:', error);
      throw error;
    }
  }

  // Duplicate template
  static async duplicateTemplate(templateId, newName, adminId) {
    try {
      const originalTemplate = await this.getTemplateById(templateId);
      
      if (!originalTemplate) {
        throw new Error('Template not found');
      }

      const newTemplate = await prisma.orderTemplate.create({
        data: {
          name: newName || `${originalTemplate.name} (Copy)`,
          description: originalTemplate.description,
          templateType: originalTemplate.templateType,
          packageTier: originalTemplate.packageTier,
          season: originalTemplate.season,
          preference: originalTemplate.preference,
          createdBy: adminId
        }
      });

      // Copy items
      const items = originalTemplate.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes
      }));

      if (items.length > 0) {
        await this.addItemsToTemplate(newTemplate.id, items);
      }

      return await this.getTemplateById(newTemplate.id);
    } catch (error) {
      console.error('Error duplicating template:', error);
      throw error;
    }
  }
}

module.exports = TemplateService;
