const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.use('/tasks', taskRoutes);

// Catch malformed JSON
app.use((err, _req, res, next) => {
  if (!(err instanceof SyntaxError) || err.status !== 400 || !('body' in err)) {
    return next(err);
  }

  return res.status(400).json({ success: false, error: 'Malformed JSON body.' });
});

// Final error fallback
app.use((err, _req, res, _next) => {
  const status = Number.isInteger(err.status) ? err.status : 500;
  const message = status === 500 ? 'Internal server error.' : err.message;
  res.status(status).json({ success: false, error: message });
});

module.exports = app;