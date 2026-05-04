const express = require('express');
const prisma = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Create a task (Admin only)
router.post('/', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { title, description, dueDate, projectId, assigneeId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task status or assignee (Members can update status, Admin can update anything)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { status, assigneeId, title, description, dueDate } = req.body;
    
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    let updateData = {};
    if (req.user.role === 'ADMIN') {
      updateData = { status, assigneeId, title, description, dueDate: dueDate ? new Date(dueDate) : undefined };
    } else {
      // Member can only update status if they are assigned to it
      if (task.assigneeId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      updateData = { status };
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
