const express = require('express');
const prisma = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'ADMIN') {
      projects = await prisma.project.findMany({
        where: { adminId: req.user.id },
        include: { _count: { select: { tasks: true } } }
      });
    } else {
      // Members see projects where they have tasks
      const userTasks = await prisma.task.findMany({
        where: { assigneeId: req.user.id },
        select: { projectId: true }
      });
      const projectIds = [...new Set(userTasks.map(t => t.projectId))];
      
      projects = await prisma.project.findMany({
        where: { id: { in: projectIds } },
        include: { _count: { select: { tasks: true } } }
      });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create project (Admin only)
router.post('/', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        description,
        adminId: req.user.id
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project details including tasks
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } }
          }
        },
        admin: { select: { id: true, name: true } }
      }
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Check access: Admin who owns it or Member assigned to a task inside it. 
    // To make it simpler, we just allow any authenticated user to view project details if they have the ID
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
