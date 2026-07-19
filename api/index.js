const express = require('express');
const cors = require('cors');
const path = require('path');
const experienceRoutes = require('../server/routes/experience');
const aiSummaryRoutes = require('../server/routes/aisummary');
const translateRoutes = require('../server/routes/translate');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api', experienceRoutes);
app.use('/api', aiSummaryRoutes);
app.use('/api', translateRoutes);

// Serve static frontend
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

module.exports = app;
