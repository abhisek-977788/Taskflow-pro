const Task = require('../models/Task');

// GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, category, search, sort = '-createdAt', page = 1, limit = 20 } = req.query;

    const query = { userId: req.user._id };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) query.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category:    { $regex: search, $options: 'i' } },
      { tags:        { $regex: search, $options: 'i' } },
    ];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email avatar');

    res.json({
      success: true,
      tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/stats
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [statusStats, priorityStats, weeklyStats] = await Promise.all([
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { userId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            created: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [todayTasks, overdueTasks] = await Promise.all([
      Task.find({ userId, dueDate: { $gte: today, $lt: tomorrow } }),
      Task.find({ userId, dueDate: { $lt: today }, status: { $ne: 'completed' } }),
    ]);

    res.json({
      success: true,
      stats: {
        byStatus: statusStats,
        byPriority: priorityStats,
        weekly: weeklyStats,
        todayCount: todayTasks.length,
        overdueCount: overdueTasks.length,
        todayTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, category, tags, assignedTo } = req.body;

    const taskCount = await Task.countDocuments({ userId: req.user._id, status: status || 'todo' });

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      tags,
      assignedTo,
      userId: req.user._id,
      position: taskCount,
    });

    const populated = await task.populate('assignedTo', 'name email avatar');

    // Emit real-time event
    const io = req.app.get('io');
    if (io) io.to(req.user._id.toString()).emit('task:created', populated);

    res.status(201).json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'category', 'tags', 'assignedTo', 'position'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    const populated = await task.populate('assignedTo', 'name email avatar');

    const io = req.app.get('io');
    if (io) io.to(req.user._id.toString()).emit('task:updated', populated);

    res.json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const io = req.app.get('io');
    if (io) io.to(req.user._id.toString()).emit('task:deleted', { _id: req.params.id });

    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/tasks/reorder
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{ id, status, position }]
    const bulkOps = tasks.map(({ id, status, position }) => ({
      updateOne: {
        filter: { _id: id, userId: req.user._id },
        update: { $set: { status, position } },
      },
    }));
    await Task.bulkWrite(bulkOps);

    const io = req.app.get('io');
    if (io) io.to(req.user._id.toString()).emit('tasks:reordered', tasks);

    res.json({ success: true, message: 'Tasks reordered.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskStats, createTask, updateTask, deleteTask, reorderTasks };
