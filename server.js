const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Root route - serve main HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// TTS Routes
app.use('/api/tts', require('./routes/tts'));
app.use('/api/voices', require('./routes/voices'));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
    } else {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    }
  });
} else {
  // Development - serve main HTML for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`TTS Server running on port ${PORT}`);
});