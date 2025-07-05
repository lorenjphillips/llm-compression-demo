# KobiCompression Backend

This is a minimal Express backend for proxying OpenAI ChatGPT API calls and logging request/response history.

## Features
- Securely proxies chat requests to OpenAI (API key not exposed to frontend)
- Logs all requests and responses (including token usage) to a JSON file
- CORS enabled for local development

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create your `.env` file:**
   Copy `.env.example` to `.env` and fill in your OpenAI API key:
   ```bash
   cp .env.example .env
   # Edit .env to add your OpenAI API key
   ```

3. **Run the server:**
   ```bash
   npm start
   # or
   node index.js
   ```

## Environment Variables
- `OPENAI_API_KEY` — Your OpenAI API key (required)
- `LOG_FILE` — Path to the log file (default: `log.json`)
- `PORT` — Port to run the server on (default: 3001)

## API Endpoints

### `POST /api/chat`
Proxy endpoint for OpenAI chat completions.
- **Body:** `{ messages: [...], model?: string, ... }`
- **Returns:** OpenAI API response, including `usage` field

### `GET /api/logs`
Returns all logged requests/responses (for development/testing).

---

**Note:** This backend is for development and prototyping. For production, consider using a database for logging and adding authentication/rate limiting. 