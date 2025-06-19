const express = require('express');
const router = express.Router();
const ClientService = require('../services/clientService');

// Create new client
router.post('/', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, company, address, city, province, postalCode } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, first name, and last name are required' 
      });
    }

    const client = await ClientService.createClient({
      email,
      firstName,
      lastName,
      phone,
      company,
      address,
      city,
      province,
      postalCode
    });

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ 
      error: 'Failed to create client',
      details: error.message 
    });
  }
});

// Get client by email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const client = await ClientService.getClientByEmail(email);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      success: true,
      client
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client',
      details: error.message 
    });
  }
});

// Get client by ID
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const client = await ClientService.getClientById(clientId);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({
      success: true,
      client
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client',
      details: error.message 
    });
  }
});

// Update client
router.patch('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const updateData = req.body;

    const client = await ClientService.updateClient(clientId, updateData);

    res.json({
      success: true,
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ 
      error: 'Failed to update client',
      details: error.message 
    });
  }
});

// Get all clients (admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const result = await ClientService.getAllClients(
      parseInt(page),
      parseInt(limit),
      search
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ 
      error: 'Failed to fetch clients',
      details: error.message 
    });
  }
});

// Find or create client
router.post('/find-or-create', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, company } = req.body;

    if (!email || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, first name, and last name are required' 
      });
    }

    const client = await ClientService.findOrCreateClient({
      email,
      firstName,
      lastName,
      phone,
      company
    });

    res.json({
      success: true,
      client,
      message: client.createdAt === client.updatedAt ? 'Client created' : 'Client found'
    });
  } catch (error) {
    console.error('Error finding or creating client:', error);
    res.status(500).json({ 
      error: 'Failed to find or create client',
      details: error.message 
    });
  }
});

// Delete client
router.delete('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    await ClientService.deleteClient(clientId);

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ 
      error: 'Failed to delete client',
      details: error.message 
    });
  }
});

// Get client dashboard
router.get('/:clientId/dashboard', async (req, res) => {
  try {
    const { clientId } = req.params;

    const dashboard = await ClientService.getClientDashboard(clientId);

    res.json({
      success: true,
      dashboard
    });
  } catch (error) {
    console.error('Error fetching client dashboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client dashboard',
      details: error.message 
    });
  }
});

module.exports = router;
