const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const usernameChecker = require('./services/usernameChecker');
const sites = require('./config/sites');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Username Checker API is running' });
});

app.get('/api/sites', (req, res) => {
  res.json(sites);
});

app.post('/api/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Username is required' 
      });
    }

    if (username.length < 2 || username.length > 30) {
      return res.status(400).json({ 
        error: 'Username must be between 2 and 30 characters' 
      });
    }

    // Validate username format (alphanumeric, underscore, hyphen)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        error: 'Username can only contain letters, numbers, underscores, and hyphens' 
      });
    }

    console.log(`Checking username: ${username}`);
    
    const results = await usernameChecker.checkUsername(username);
    
    res.json({
      username,
      results,
      timestamp: new Date().toISOString(),
      totalSites: results.length,
      available: results.filter(r => r.status === 'available').length,
      taken: results.filter(r => r.status === 'taken').length,
      unknown: results.filter(r => r.status === 'unknown').length
    });

  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({ 
      error: 'Internal server error while checking username',
      details: error.message 
    });
  }
});

// Serve frontend for production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend will be served from http://localhost:${PORT}`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
});
