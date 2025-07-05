import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    console.error('Tokenize API Error:', err.response?.data || err.message);
    
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
}