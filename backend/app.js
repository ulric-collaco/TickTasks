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

module.exports = app;