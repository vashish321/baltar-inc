const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class ProductService {
  // Create new product
  static async createProduct(productData, imageFiles = []) {
    try {
      const {
        name,
        description,
        category,
        brand,
        color,
        size,
        price,
        sku,
        stockQuantity
      } = productData;

      // Create product
      const product = await prisma.product.create({
        data: {
          name,
          description,
          category,
          brand,
          color,
          size,
          price: parseFloat(price),
          sku,
          stockQuantity: parseInt(stockQuantity) || 0
        }
      });

      // Upload images if provided
      if (imageFiles && imageFiles.length > 0) {
        await this.uploadProductImages(product.id, imageFiles);
      }

      return await this.getProductById(product.id);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Get all products with filters
  static async getAllProducts(filters = {}) {
    try {
      const {
        category,
        brand,
        isActive = true,
        page = 1,
        limit = 20,
        search
      } = filters;

      const skip = (page - 1) * limit;
      const where = {};

      if (category) where.category = category;
      if (brand) where.brand = { contains: brand, mode: 'insensitive' };
      if (typeof isActive === 'boolean') where.isActive = isActive;
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            images: {
              orderBy: { sortOrder: 'asc' }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: parseInt(skip),
          take: parseInt(limit)
        }),
        prisma.product.count({ where })
      ]);

      return {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(productId) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(productId, updateData) {
    try {
      const { images, ...productData } = updateData;

      if (productData.price) {
        productData.price = parseFloat(productData.price);
      }
      if (productData.stockQuantity) {
        productData.stockQuantity = parseInt(productData.stockQuantity);
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: productData,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      });

      return product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product (soft delete)
  static async deleteProduct(productId) {
    try {
      await prisma.product.update({
        where: { id: productId },
        data: { isActive: false }
      });

      return { success: true, message: 'Product deactivated successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Upload product images
  static async uploadProductImages(productId, imageFiles) {
    try {
      const uploadPromises = imageFiles.map(async (file, index) => {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'le-mode-co/products',
          public_id: `${productId}_${Date.now()}_${index}`,
          transformation: [
            { width: 800, height: 800, crop: 'fill', quality: 'auto' }
          ]
        });

        // Save to database
        return prisma.productImage.create({
          data: {
            productId,
            imageUrl: result.secure_url,
            altText: file.originalname || `Product image ${index + 1}`,
            isPrimary: index === 0,
            sortOrder: index
          }
        });
      });

      const images = await Promise.all(uploadPromises);
      return images;
    } catch (error) {
      console.error('Error uploading product images:', error);
      throw error;
    }
  }

  // Delete product image
  static async deleteProductImage(imageId) {
    try {
      const image = await prisma.productImage.findUnique({
        where: { id: imageId }
      });

      if (!image) {
        throw new Error('Image not found');
      }

      // Extract public_id from Cloudinary URL
      const urlParts = image.imageUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `le-mode-co/products/${publicIdWithExtension.split('.')[0]}`;

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Delete from database
      await prisma.productImage.delete({
        where: { id: imageId }
      });

      return { success: true, message: 'Image deleted successfully' };
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  }

  // Update image order
  static async updateImageOrder(productId, imageOrders) {
    try {
      const updatePromises = imageOrders.map(({ imageId, sortOrder }) =>
        prisma.productImage.update({
          where: { id: imageId },
          data: { sortOrder }
        })
      );

      await Promise.all(updatePromises);
      return { success: true, message: 'Image order updated successfully' };
    } catch (error) {
      console.error('Error updating image order:', error);
      throw error;
    }
  }

  // Get product categories with counts
  static async getProductCategories() {
    try {
      const categories = await prisma.product.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: { category: true }
      });

      return categories.map(cat => ({
        category: cat.category,
        count: cat._count.category
      }));
    } catch (error) {
      console.error('Error fetching product categories:', error);
      throw error;
    }
  }

  // Get product brands with counts
  static async getProductBrands() {
    try {
      const brands = await prisma.product.groupBy({
        by: ['brand'],
        where: { 
          isActive: true,
          brand: { not: null }
        },
        _count: { brand: true }
      });

      return brands.map(brand => ({
        brand: brand.brand,
        count: brand._count.brand
      }));
    } catch (error) {
      console.error('Error fetching product brands:', error);
      throw error;
    }
  }

  // Search products for order management
  static async searchProductsForOrder(searchTerm, filters = {}) {
    try {
      const { category, limit = 10 } = filters;
      
      const where = {
        isActive: true,
        stockQuantity: { gt: 0 }
      };

      if (category) where.category = category;
      
      if (searchTerm) {
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { brand: { contains: searchTerm, mode: 'insensitive' } },
          { sku: { contains: searchTerm, mode: 'insensitive' } }
        ];
      }

      const products = await prisma.product.findMany({
        where,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        },
        take: parseInt(limit),
        orderBy: { name: 'asc' }
      });

      return products;
    } catch (error) {
      console.error('Error searching products for order:', error);
      throw error;
    }
  }

  // Update stock quantity
  static async updateStock(productId, quantity, operation = 'set') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      let newQuantity;
      switch (operation) {
        case 'add':
          newQuantity = product.stockQuantity + quantity;
          break;
        case 'subtract':
          newQuantity = Math.max(0, product.stockQuantity - quantity);
          break;
        default:
          newQuantity = quantity;
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { stockQuantity: newQuantity }
      });

      return updatedProduct;
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }
}

module.exports = ProductService;
