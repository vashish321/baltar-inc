const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class AuthService {
  // Create admin user (run once to setup)
  static async createAdmin(email, password, firstName, lastName) {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          role: 'admin'
        }
      });

      return { success: true, admin: { id: admin.id, email: admin.email } };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Admin with this email already exists');
      }
      throw error;
    }
  }

  // Login admin
  static async loginAdmin(email, password) {
    try {
      const admin = await prisma.admin.findUnique({
        where: { email }
      });

      if (!admin) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { 
          adminId: admin.id, 
          email: admin.email,
          role: admin.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Verify token
  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.adminId }
      });

      if (!admin) {
        throw new Error('Admin not found');
      }

      return {
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Middleware to protect admin routes
  static async requireAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.substring(7);
      const result = await AuthService.verifyToken(token);
      
      req.admin = result.admin;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
}

module.exports = AuthService;
