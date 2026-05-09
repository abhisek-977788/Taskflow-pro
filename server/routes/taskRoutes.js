const express = require('express');
const { getTasks, getTaskStats, createTask, updateTask, deleteTask, reorderTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);
router.use(apiLimiter);

router.get('/stats', getTaskStats);
router.get('/', getTasks);
router.post('/', createTask);
router.put('/reorder', reorderTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
