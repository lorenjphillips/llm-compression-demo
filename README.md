# Kobi Compression: Regex-Based Slang & Abbreviation System

## 🚀 Getting Started: Development & Deployment

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
Create a text compression algorithm that uses regex patterns to transform standard English into compact texting/millennial slang while preserving semantic meaning for LLM comprehension. The goal is maximum size reduction with minimal information loss.

## Core Principles

### 1. Semantic Preservation
- Maintain sentence structure and grammar
- Preserve key information words (nouns, verbs, adjectives)
- Keep punctuation that affects meaning
- Ensure LLM can still parse intent and context

### 2. Compression Priorities (in order)
1. **Popular texting abbreviations** (u, ur, 2, 4, etc.)
2. **Vowel reduction** in non-critical words
3. **Common word substitutions** (and → &, with → w/, etc.)
4. **Number-letter substitutions** (to → 2, for → 4, ate → 8)
5. **Contraction expansion** then re-compression

## Implementation Strategy

### Phase 1: Pre-processing
- Convert to lowercase (preserve proper nouns)
- Tokenize while preserving punctuation
- Identify word boundaries and sentence structure

### Phase 2: Primary Transformations (Regex Patterns)

#### A. Essential Word Replacements
```
you → u
your → ur  
you're → ur
to → 2
too → 2
for → 4
before → b4
because → bc
and → &
with → w/
without → w/o
about → abt
something → smth
nothing → nthn
```

#### B. Number-Letter Phonetic Substitutions
```
great → gr8
late → l8
wait → w8
mate → m8
create → cr8
ate/eat → 8
tonight → 2nite
today → 2day
tomorrow → 2morrow
```

#### C. Common Abbreviations
```
probably → prob
definitely → def
obviously → obv
literally → lit
actually → acc
seriously → srsly
especially → esp
```

#### D. Vowel Reduction (Secondary Priority)
```
Apply to words >4 letters:
- Remove vowels from middle of words
- Keep first and last letters
- Preserve double consonants
- Examples: between → btwn, through → thru
```

### Phase 3: Advanced Optimizations

#### A. Contraction Handling
- can't → cant
- won't → wont  
- shouldn't → shldnt
- would've → wldve

#### B. Article and Preposition Reduction
```
the → th (in non-critical contexts)
this → ths
that → tht
from → frm
them → thm
```

#### C. Ending Simplifications
```
-ing → -n (when unambiguous)
-tion → -shn
-ed → -d (when phonetically clear)
```

## Pattern Implementation Guidelines

### Regex Construction Rules
1. **Word boundary anchoring**: Use `\b` to ensure whole-word matches
2. **Case sensitivity**: Handle both cases or normalize first
3. **Context awareness**: Avoid replacements that create ambiguity
4. **Ordering matters**: Apply transformations in priority order

### Example Pattern Structure
```
# Replace "you" with "u" (word boundaries)
\byou\b → u

# Replace "great" with "gr8" 
\bgreat\b → gr8

# Vowel reduction for longer words
\b([bcdfghjklmnpqrstvwxyz])([aeiou])([bcdfghjklmnpqrstvwxyz]{2,})([aeiou])([bcdfghjklmnpqrstvwxyz])\b
→ $1$3$5
```

## Compression Dictionary Structure

### Primary Dictionary (Highest Impact)
- Single character replacements: you→u, and→&
- Number substitutions: to→2, for→4, great→gr8
- Common texting: because→bc, with→w/, about→abt

### Secondary Dictionary (Moderate Impact)  
- Vowel reductions: between→btwn, through→thru
- Abbreviations: probably→prob, definitely→def
- Contractions: can't→cant, won't→wont

### Tertiary Dictionary (Fine-tuning)
- Article reductions: the→th (context-dependent)
- Ending modifications: -ing→-n, -tion→-shn

## Quality Assurance Measures

### Reversibility Testing
- Maintain reverse mapping dictionary
- Test decompression accuracy
- Verify LLM comprehension on samples

### Semantic Validation
- Compare LLM responses to compressed vs original text
- Measure information retention rates
- Test on various text types (formal, casual, technical)

### Compression Metrics
- Character reduction percentage
- Word count reduction
- Readability preservation score

## Implementation Workflow

1. **Build comprehensive regex pattern library**
2. **Create ordered transformation pipeline**
3. **Implement conflict resolution** (when multiple patterns match)
4. **Add context-awareness logic**
5. **Test and refine** with diverse text samples
6. **Optimize pattern ordering** for maximum compression

## New Level 4: Ultra Features 🚀

### Peak Millennial Slang
- **Internet classics**: omg, lol, rofl, btw, fr, ngl, tbh, imo, idk, wtf, smh
- **Gen Z favorites**: nocap, deds (deadass), nw (no worries), wtv (whatever)
- **Text shortcuts**: ttyl, cyl, gn, gm, gl, hf, hbd, grtz

### Extreme Number/Letter Substitutions
- **8-series**: ate→8, eat→8, str8, f8, d8, g8, h8, r8, st8, upd8, celebr8
- **1-series**: once→1ce, won→1, one→1, any1, sum1, every1, no1

### Aggressive Vowel Destruction
- **Smart vowel nuking**: Keeps first letter, essential consonants, last letter
- **Examples**: computer→cmptr, internet→intrnt, government→gvrnmt
- **Multi-pattern vowel reduction** for maximum compression

### Enhanced Features
- **Proper noun preservation**: Protects names and important terms
- **Smart pattern ordering**: Prevents conflicts between rules
- **Readability scoring**: Balances compression vs. comprehension
- **Demo function**: Test all levels at once

## Compression Targets by Level

- **Level 1**: 10-15% reduction (conservative)
- **Level 2**: 20-30% reduction (balanced)
- **Level 3**: 35-50% reduction (aggressive)
- **Level 4**: 50-70%+ reduction (ULTRA 🔥)

## Expected Outcomes
- Up to 70%+ character reduction with Level 4 Ultra
- 10-60% word count reduction depending on level
- High LLM comprehension retention (>95%)
- Fast processing speed due to regex efficiency

## Special Considerations
- Preserve technical terms and proper nouns
- Handle edge cases (URLs, emails, code)
- Maintain readability for human verification
- Consider domain-specific abbreviations
- Plan for pattern updates and refinements 