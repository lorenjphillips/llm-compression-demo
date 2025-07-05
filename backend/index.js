const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const LOG_FILE = process.env.LOG_FILE || 'log.json';

app.use(cors());
app.use(express.json());

// Rate limiter: 10 requests per minute per IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'Too many requests, please try again later.' },
});

// Helper: Append log entry to file
function logRequest(data) {
  const logPath = path.join(__dirname, LOG_FILE);
  let logs = [];
  if (fs.existsSync(logPath)) {
    try {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    } catch (e) {
      logs = [];
    }
  }
  logs.push(data);
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
}

// Map UI model names to OpenAI API model names
const modelMapping = {
  'gpt-4.1': 'gpt-4o',
  'gpt-4.1-mini': 'gpt-4o-mini',
  'gpt-4.1-nano': 'gpt-4o-mini', // Use 4o-mini as closest equivalent
  'o3': 'gpt-4o', // Use 4o as closest equivalent for now
  'o4-mini': 'gpt-4o-mini' // Use 4o-mini as closest equivalent
};

// POST /api/chat: Proxy to OpenAI
app.post('/api/chat', chatLimiter, async (req, res) => {
  const { messages, model = 'gpt-4.1-mini', ...rest } = req.body;
  if (!messages) {
    return res.status(400).json({ error: 'Missing messages' });
  }
  try {
    // Map UI model name to actual OpenAI model name
    const actualModel = modelMapping[model] || model;
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: actualModel,
        messages,
        ...rest
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    // Log input/output and usage
    logRequest({
      timestamp: new Date().toISOString(),
      request: { messages, model: actualModel, originalModel: model, ...rest },
      response: {
        choices: response.data.choices,
        usage: response.data.usage
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// POST /api/tokenize: Get token count for text
app.post('/api/tokenize', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Missing text' });
  }
  
  // Check if OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }
  
  try {
    // Use a minimal OpenAI completion request to get token count
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini', // Use cheapest model for token counting
        messages: [{ role: 'user', content: text }],
        max_tokens: 1, // Minimize output tokens
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    // Return the input token count from usage
    res.json({ 
      tokens: response.data.usage.prompt_tokens,
      usage: response.data.usage
    });
  } catch (err) {
    // Handle different types of errors
    if (err.response) {
      // OpenAI API error response
      const status = err.response.status;
      const errorData = err.response.data;
      
      if (status === 401) {
        res.status(500).json({ error: 'Invalid OpenAI API key' });
      } else if (status === 429) {
        res.status(429).json({ error: 'OpenAI rate limit exceeded' });
      } else {
        res.status(500).json({ error: errorData || 'OpenAI API error' });
      }
    } else if (err.code === 'ECONNABORTED') {
      res.status(500).json({ error: 'Request timeout' });
    } else {
      res.status(500).json({ error: 'Network error or server issue' });
    }
  }
});

// GET /api/logs: Return all logs (for dev/testing)
app.get('/api/logs', (req, res) => {
  const logPath = path.join(__dirname, LOG_FILE);
  if (!fs.existsSync(logPath)) return res.json([]);
  const logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  res.json(logs);
});

// Global error handlers to prevent server crashes
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 