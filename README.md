# Kobi Compression: Regex-Based Slang & Abbreviation System for Reducing Input Tokens

## Getting Started: Development & Deployment

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **bun** (for dependency management)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/coval-compression.git
cd coval-compression
```

### 3. Install Dependencies
#### For the frontend and backend (monorepo):
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```
*Or use `bun install` if you prefer bun.*

### 4. Environment Variables & API Keys
- Create a `.env` file in the root and/or `backend/` directory as needed.
- Example `.env` (adjust as required):
  ```env
  # For backend (if using external APIs)
  OPENAI_API_KEY=your_openai_key_here
  # Add other keys as needed
  ```
- **Note:** This project may not require API keys unless integrating with LLMs or external services.

### 5. Running in Development
#### Frontend:
```bash
npm run dev
# or
bun run dev
```

#### Backend:
```bash
cd backend
npm run dev
# or
bun run dev
```

### 6. Building for Production
#### Frontend:
```bash
npm run build
# or
bun run build
```

#### Backend:
```bash
cd backend
npm run build
# or
bun run build
```

### 7. Deployment

#### Vercel Deployment (Recommended)
This project is configured for Vercel deployment with serverless functions.

##### First-time Setup:
1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy with confirmation**:
   ```bash
   vercel --prod --yes
   ```

##### Environment Variables:
After deployment, you must configure the OpenAI API key:

1. Go to your Vercel project dashboard:
   - Visit: https://vercel.com/dashboard
   - Select your project (coval-compression)

2. Navigate to **Settings → Environment Variables**

3. Add the following variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-`)

4. **Redeploy** after adding the environment variable:
   ```bash
   vercel --prod --yes
   ```

##### Local Development with Vercel:
```bash
# Start local development server with serverless functions
vercel dev
```

Make sure you have a `.env.local` file with your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_key_here
```

#### Project Structure:
- Frontend: Built with Vite + React + TypeScript
- API Functions: `/api/chat.js` and `/api/tokenize.js` (serverless functions)
- Build Output: `dist/` directory
- Configuration: `vercel.json` handles build and function settings

---

# Text Compression Algorithm: Regex-Based Slang & Abbreviation System

## Overview
This project implements two text compression algorithms for reducing text size while preserving meaning for LLM comprehension:

1. **LLM-Optimized Compression**: Removes stopwords, transition words, and unnecessary punctuation for maximum token efficiency.
2. **Millennial Slang Compression**: Uses regex patterns to transform standard English into compact texting/millennial slang, abbreviations, and meme/emoji substitutions.

## Compression Modes

### 1. LLM-Optimized Compression
- **Function:** `llmTokenOptimize(text)`
- **Purpose:** Aggressively reduces token count for LLM input by:
  - Removing common English stopwords (e.g., the, a, of, to, for, etc.).
  - Removing transition words/phrases (e.g., however, therefore, in conclusion, etc.).
  - Removing most punctuation except sentence boundaries (keeps `.`, `!`, `?`).
  - Normalizing whitespace and trimming leading/trailing punctuation.
- **Result:** Highly compressed, information-dense text that is optimized for LLM tokenization, but may be less human-readable.

### 2. Millennial Slang Compression
- **Function:** `compressText(text, level)` (use `level = 2` for full effect)
- **Purpose:** Applies a prioritized set of regex-based patterns to:
  - Replace words/phrases with popular texting abbreviations (e.g., `you → u`, `for → 4`, `with → w/`).
  - Substitute number-letter phonetics (e.g., `great → gr8`, `tonight → 2nite`).
  - Add common internet slang and meme language (e.g., `omg`, `lol`, `tbh`, `idk`).
  - Reduce vowels in longer words (e.g., `between → btwn`).
  - Replace some words with emoji or meme terms (e.g., `crying → 😭`, `laugh → 😂`).
- **Result:** Text that is compact, slang-heavy, and meme-infused, balancing compression and human/LLM readability.

## Core Principles
- **Semantic Preservation:**
  - Maintains sentence structure and grammar.
  - Preserves key information words and essential punctuation.
  - Ensures LLMs can still parse intent and context.

## Usage
- **LLM-Optimized:**
  - `llmTokenOptimize(text)`
- **Millennial Slang:**
  - `compressText(text, 2)`
  - `decompressText(compressedText, 2)` (attempts to reverse slang compression for one-to-one mappings)

## Implementation Details
- **Pattern Application (Slang):**
  - Patterns are applied in order of priority.
  - Case is preserved for each replacement.
  - Extra spaces and spaces before punctuation are cleaned up after all replacements.
- **Decompression:**
  - There is a reverse mapping for decompression, but it is only as good as the one-to-one mappings in the pattern descriptions.
- **Quality Assurance:**
  - Functions exist to validate compression quality (readability, punctuation, etc.).
  - Character reduction percentage, word count reduction, and readability score are calculated.

## Examples
- **LLM-Optimized:**
  - Input: `"This is an example of how the compression works, and why it matters."`
  - Output: `example compression works matters.`
- **Millennial Slang:**
  - Input: `"Are you going to the party tonight?"`
  - Output: `u gonna rager 2nite?`

---

## Bonus: Future & Wild Ideas (Not Yet Implemented)

The following are ambitious or experimental features that may be added in the future:

- **Multiple Compression Levels:**
  - Ranging from conservative (tokenizer-aware) to ultra-aggressive (meme/emoji/Gen Z speak, extreme vowel destruction).
- **Context-Aware Reductions:**
  - Smarter handling of articles, prepositions, and contractions based on context.
- **Advanced Vowel Destruction:**
  - Multi-pattern vowel reduction for maximum compression, while preserving readability and essential consonants.
- **Proper Noun & Technical Term Preservation:**
  - Protecting names, technical terms, URLs, emails, and code from over-compression.
- **Readability Scoring & Balancing:**
  - Dynamically adjusting compression aggressiveness to balance size reduction and human/LLM comprehension.
- **Reversibility Testing:**
  - Maintain a reverse mapping dictionary and test decompression accuracy.
- **Domain-Specific Abbreviations:**
  - Custom slang/abbreviation sets for technical, medical, or other specialized domains.
- **Demo & Analytics Tools:**
  - Functions to showcase and compare all compression levels, analyze savings, and visualize readability.

*These features are not present in the current implementation, but are under consideration for future releases.* 