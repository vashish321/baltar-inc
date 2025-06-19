const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const ClientService = require('../services/clientService');
const ProjectService = require('../services/projectService');

const prisma = new PrismaClient();

// Create new booking (from contact forms)
router.post('/', async (req, res) => {
  try {
    const {
      // Client info
      email,
      firstName,
      lastName,
      phone,
      company,
      
      // Service info
      serviceType,
      eventDate,
      eventLocation,
      guestCount,
      services,
      specialRequests,
      
      // Frontend Web Design specific
      websiteType,
      domainName,
      hostingNeeds,
      
      // Project info
      projectTitle,
      projectDescription,
      estimatedBudget
    } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !serviceType) {
      return res.status(400).json({
        error: 'Email, first name, last name, and service type are required'
      });
    }

    // Find or create client
    const client = await ClientService.findOrCreateClient({
      email,
      firstName,
      lastName,
      phone,
      company
    });

    // Create booking record
    const booking = await prisma.booking.create({
      data: {
        clientId: client.id,
        serviceType,
        eventDate: eventDate ? new Date(eventDate) : new Date(),
        eventLocation: eventLocation || 'TBD',
        guestCount: guestCount ? parseInt(guestCount) : null,
        services: JSON.stringify(services || []),
        specialRequests: specialRequests || null
      }
    });

    // Create project
    const projectData = {
      clientId: client.id,
      serviceType,
      title: projectTitle || `${serviceType === 'FRONTEND_WEB_DESIGN' ? 'Website Development' : 'Event Services'} - ${firstName} ${lastName}`,
      description: projectDescription || specialRequests,
      estimatedCost: estimatedBudget ? parseFloat(estimatedBudget) : null
    };

    // Add service-specific fields
    if (serviceType === 'FRONTEND_WEB_DESIGN') {
      projectData.domainName = domainName;
      projectData.hostingPlan = hostingNeeds;
    } else if (serviceType === 'SAVOUR_AND_SIP') {
      projectData.eventDate = eventDate ? new Date(eventDate) : null;
      projectData.eventLocation = eventLocation;
      projectData.guestCount = guestCount ? parseInt(guestCount) : null;
      projectData.eventType = Array.isArray(services) ? services.join(', ') : services;
    }

    const project = await ProjectService.createProject(projectData);

    // Send confirmation email (would be implemented with email service)
    // await EmailService.sendBookingConfirmation(client.email, booking, project);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
      project,
      client: {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      error: 'Failed to create booking',
      details: error.message
    });
  }
});

// Get all bookings (admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, serviceType, status } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (serviceType) where.serviceType = serviceType;
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
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
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit)
    });

    const total = await prisma.booking.count({ where });

    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details: error.message
    });
  }
});

// Get booking by ID
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      error: 'Failed to fetch booking',
      details: error.message
    });
  }
});

// Update booking status
router.patch('/:bookingId/status', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: {
        client: true
      }
    });

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      error: 'Failed to update booking status',
      details: error.message
    });
  }
});

// Delete booking
router.delete('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    await prisma.booking.delete({
      where: { id: bookingId }
    });

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      error: 'Failed to delete booking',
      details: error.message
    });
  }
});

// Get client bookings
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Error fetching client bookings:', error);
    res.status(500).json({
      error: 'Failed to fetch client bookings',
      details: error.message
    });
  }
});

module.exports = router;
