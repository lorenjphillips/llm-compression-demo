const axios = require('axios');

// Map UI model names to OpenAI API model names
const modelMapping = {
  'gpt-4.1': 'gpt-4o',
  'gpt-4.1-mini': 'gpt-4o-mini',
  'gpt-4.1-nano': 'gpt-4o-mini', // Use 4o-mini as closest equivalent
  'o3': 'gpt-4o', // Use 4o as closest equivalent for now
  'o4-mini': 'gpt-4o-mini' // Use 4o-mini as closest equivalent
};

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

  const { messages, model = 'gpt-4.1-mini', ...rest } = req.body;
  
  if (!messages) {
    return res.status(400).json({ error: 'Missing messages' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
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

    res.json(response.data);
  } catch (err) {
    console.error('OpenAI API Error:', err.response?.data || err.message);
    
    if (err.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again.' });
    }
    
    res.status(500).json({ error: err.response?.data || err.message });
  }
}