const express = require('express');
const router = express.Router();
const store = require('../store');

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
  const id = parseInt(req.params.id, 10);
  const { completed, title } = req.body;

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ success: false, error: 'completed must be a boolean.' });
  }
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ success: false, error: 'title must be a non-empty string.' });
  }

  const task = store.update(id, { completed, title });
  if (!task) return res.status(404).json({ success: false, error: 'Task not found.' });

  res.json({ success: true, data: task });
});

// DELETE /tasks/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const removed = store.remove(id);
  if (!removed) return res.status(404).json({ success: false, error: 'Task not found.' });

  res.json({ success: true, data: null });
});

module.exports = router;
