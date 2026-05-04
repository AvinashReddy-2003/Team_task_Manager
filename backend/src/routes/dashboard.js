const express = require('express');
const prisma = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/', authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    let tasks;

    if (req.user.role === 'ADMIN') {
      // Admin sees all tasks for projects they created
      tasks = await prisma.task.findMany({
        where: {
          project: {
            adminId: req.user.id
          }
        }
      });
    } else {
      // Members see tasks assigned to them
      tasks = await prisma.task.findMany({
        where: {
          assigneeId: req.user.id
        }
      });
    }

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: tasks.filter(t => t.status === 'DONE').length,
      overdue: tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'DONE').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
