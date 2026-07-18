require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const experienceRoutes = require('./routes/experience');
const aiSummaryRoutes = require('./routes/aisummary');
const translateRoutes = require('./routes/translate');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// API routes
app.use('/api', experienceRoutes);
app.use('/api', aiSummaryRoutes);
app.use('/api', translateRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
