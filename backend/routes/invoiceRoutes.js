const express = require('express');
const router = express.Router();
const InvoiceService = require('../services/invoiceService');
const AuthService = require('../services/authService');

// Create manual invoice
router.post('/create', async (req, res) => {
  try {
    const { projectId, serviceType, items } = req.body;

    if (!projectId || !serviceType || !items || !Array.isArray(items)) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId, serviceType, items' 
      });
    }

    let invoice;
    if (serviceType === 'FRONTEND_WEB_DESIGN') {
      invoice = await InvoiceService.createFrontendWebDesignInvoice(projectId, items);
    } else if (serviceType === 'SAVOUR_AND_SIP') {
      invoice = await InvoiceService.createSavourAndSipInvoice(projectId, items);
    } else {
      return res.status(400).json({ error: 'Invalid service type' });
    }

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      invoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ 
      error: 'Failed to create invoice',
      details: error.message 
    });
  }
});

// Auto-generate invoice from project
router.post('/auto-generate/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const invoice = await InvoiceService.autoGenerateInvoice(projectId);

    res.status(201).json({
      success: true,
      message: 'Invoice auto-generated successfully',
      invoice
    });
  } catch (error) {
    console.error('Error auto-generating invoice:', error);
    res.status(500).json({ 
      error: 'Failed to auto-generate invoice',
      details: error.message 
    });
  }
});

// Get all invoices for a client
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    const invoices = await InvoiceService.getClientInvoices(clientId);

    res.json({
      success: true,
      invoices
    });
  } catch (error) {
    console.error('Error fetching client invoices:', error);
    res.status(500).json({ 
      error: 'Failed to fetch invoices',
      details: error.message 
    });
  }
});

// Get specific invoice
router.get('/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        invoiceItems: true,
        client: true,
        project: true,
        payments: true
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ 
      error: 'Failed to fetch invoice',
      details: error.message 
    });
  }
});

// Update invoice status
router.patch('/:invoiceId/status', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        validStatuses 
      });
    }

    const invoice = await InvoiceService.updateInvoiceStatus(invoiceId, status);

    res.json({
      success: true,
      message: 'Invoice status updated successfully',
      invoice
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ 
      error: 'Failed to update invoice status',
      details: error.message 
    });
  }
});

// Record payment
router.post('/:invoiceId/payment', async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { amount, paymentMethod, transactionId } = req.body;

    if (!amount || !paymentMethod) {
      return res.status(400).json({ 
        error: 'Amount and payment method are required' 
      });
    }

    const payment = await InvoiceService.recordPayment(
      invoiceId, 
      amount, 
      paymentMethod, 
      transactionId
    );

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      payment
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ 
      error: 'Failed to record payment',
      details: error.message 
    });
  }
});

// Get all invoices (admin)
router.get('/', AuthService.requireAuth, async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const { status, serviceType, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (serviceType) {
      where.project = {
        serviceType: serviceType
      };
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        invoiceItems: true,
        client: true,
        project: true,
        payments: true
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.invoice.count({ where });

    res.json({
      success: true,
      invoices,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ 
      error: 'Failed to fetch invoices',
      details: error.message 
    });
  }
});

// Generate and send invoice (admin only)
router.post('/generate', AuthService.requireAuth, async (req, res) => {
  try {
    const {
      serviceType,
      customerName,
      customerEmail,
      cost,
      eventType,
      guestCount,
      websiteType,
      projectDescription
    } = req.body;

    if (!serviceType || !customerName || !customerEmail || !cost) {
      return res.status(400).json({
        error: 'Service type, customer name, email, and cost are required'
      });
    }

    const invoiceData = {
      serviceType,
      customerName,
      customerEmail,
      cost: parseFloat(cost),
      eventType,
      guestCount,
      websiteType,
      projectDescription,
      adminId: req.admin.id
    };

    const result = await InvoiceService.generateAndSendInvoice(invoiceData);

    res.json({
      success: true,
      message: 'Invoice generated and sent successfully',
      ...result
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({
      error: 'Failed to generate invoice',
      details: error.message
    });
  }
});

module.exports = router;
