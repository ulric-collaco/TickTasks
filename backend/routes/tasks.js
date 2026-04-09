const express = require('express');
const router = express.Router();
const store = require('../store');

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

function parseTaskId(rawId) {
  const id = Number.parseInt(rawId, 10);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
}

// GET /tasks
router.get('/', (req, res) => {
  res.json({ success: true, data: store.getAll() });
});

// POST /tasks
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ success: false, error: 'Title must be a non-empty string.' });
  }
  const task = store.create(title.trim());
  res.status(201).json({ success: true, data: task });
});

// PATCH /tasks/:id — update completed (boolean) and/or title (string)
router.patch('/:id', (req, res) => {
  // Validate numeric id
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ success: false, error: 'Task id must be a positive integer.' });
  }

  const hasCompleted = hasOwn(req.body, 'completed');
  const hasTitle = hasOwn(req.body, 'title');

  // Require update fields
  if (!hasCompleted && !hasTitle) {
    return res.status(400).json({ success: false, error: 'Provide completed and/or title.' });
  }

  const { completed, title } = req.body;

  if (hasCompleted && typeof completed !== 'boolean') {
    return res.status(400).json({ success: false, error: 'completed must be a boolean.' });
  }
  if (hasTitle && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ success: false, error: 'title must be a non-empty string.' });
  }

  const task = store.update(id, {
    completed: hasCompleted ? completed : undefined,
    title: hasTitle ? title : undefined,
  });
  if (!task) return res.status(404).json({ success: false, error: 'Task not found.' });

  res.json({ success: true, data: task });
});

// DELETE /tasks/:id
router.delete('/:id', (req, res) => {
  // Validate numeric id
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ success: false, error: 'Task id must be a positive integer.' });
  }

  const removed = store.remove(id);
  if (!removed) return res.status(404).json({ success: false, error: 'Task not found.' });

  res.json({ success: true, data: null });
});

module.exports = router;
