const express = require('express');
const router = express.Router();
const ProjectService = require('../services/projectService');

// Create new project
router.post('/', async (req, res) => {
  try {
    const projectData = req.body;

    if (!projectData.clientId || !projectData.serviceType || !projectData.title) {
      return res.status(400).json({ 
        error: 'Client ID, service type, and title are required' 
      });
    }

    const project = await ProjectService.createProject(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ 
      error: 'Failed to create project',
      details: error.message 
    });
  }
});

// Get project by ID
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await ProjectService.getProjectById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ 
      error: 'Failed to fetch project',
      details: error.message 
    });
  }
});

// Update project
router.patch('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;

    const project = await ProjectService.updateProject(projectId, updateData);

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ 
      error: 'Failed to update project',
      details: error.message 
    });
  }
});

// Update project status
router.patch('/:projectId/status', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['INQUIRY', 'QUOTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        validStatuses 
      });
    }

    const project = await ProjectService.updateProjectStatus(projectId, status);

    res.json({
      success: true,
      message: 'Project status updated successfully',
      project
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    res.status(500).json({ 
      error: 'Failed to update project status',
      details: error.message 
    });
  }
});

// Get all projects (admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, serviceType, clientId } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (serviceType) filters.serviceType = serviceType;
    if (clientId) filters.clientId = clientId;

    const result = await ProjectService.getAllProjects(
      parseInt(page),
      parseInt(limit),
      filters
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch projects',
      details: error.message 
    });
  }
});

// Get client projects
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;

    const projects = await ProjectService.getClientProjects(clientId);

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error fetching client projects:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client projects',
      details: error.message 
    });
  }
});

// Delete project
router.delete('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    await ProjectService.deleteProject(projectId);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ 
      error: 'Failed to delete project',
      details: error.message 
    });
  }
});

// Add task to project
router.post('/:projectId/tasks', async (req, res) => {
  try {
    const { projectId } = req.params;
    const taskData = req.body;

    if (!taskData.title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const task = await ProjectService.addTask(projectId, taskData);

    res.status(201).json({
      success: true,
      message: 'Task added successfully',
      task
    });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ 
      error: 'Failed to add task',
      details: error.message 
    });
  }
});

// Update task
router.patch('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const task = await ProjectService.updateTask(taskId, updateData);

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      error: 'Failed to update task',
      details: error.message 
    });
  }
});

module.exports = router;
