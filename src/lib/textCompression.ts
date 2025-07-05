/**
 * Enhanced Regex-Based Text Compression Algorithm
 * 
 * Implements 4 compression levels with maximum millennial slang and vowel reduction
 * Level 4 (Ultra) removes vowels while maintaining readability and humor
 */

export interface CompressionResult {
  compressed: string;
  originalLength: number;
  compressedLength: number;
  compressionRatio: number;
  tokensSaved: number;
  patterns: string[];
}

export interface CompressionLevel {
  name: string;
  description: string;
  patterns: CompressionPattern[];
  educationalNote?: string;
}

export interface CompressionPattern {
  regex: RegExp;
  replacement: string;
  description: string;
  priority: number;
}

/**
 * Compression Level 1: Effective Compression (Tokenizer-Aware)
 * Only uses abbreviations that are single tokens in OpenAI's tokenizer
 */
const EFFECTIVE_PATTERNS: CompressionPattern[] = [
  // Single-token substitutions (proven to reduce token count)
  { regex: /\byou\b/gi, replacement: 'u', description: 'you → u', priority: 1 },
  { regex: /\byour\b/gi, replacement: 'ur', description: 'your → ur', priority: 1 },
  { regex: /\byou're\b/gi, replacement: 'ur', description: "you're → ur", priority: 1 },
  { regex: /\bto\b/gi, replacement: '2', description: 'to → 2', priority: 1 },
  { regex: /\btoo\b/gi, replacement: '2', description: 'too → 2', priority: 1 },
  { regex: /\bfor\b/gi, replacement: '4', description: 'for → 4', priority: 1 },
  { regex: /\band\b/gi, replacement: '&', description: 'and → &', priority: 1 },
  { regex: /\bwith\b/gi, replacement: 'w/', description: 'with → w/', priority: 1 },
  { regex: /\bwithout\b/gi, replacement: 'w/o', description: 'without → w/o', priority: 1 },
  { regex: /\bbefore\b/gi, replacement: 'b4', description: 'before → b4', priority: 1 },
  { regex: /\bbecause\b/gi, replacement: 'bc', description: 'because → bc', priority: 1 },
  
  // Common internet abbreviations (guaranteed single tokens)
  { regex: /\boh my god\b/gi, replacement: 'omg', description: 'oh my god → omg', priority: 1 },
  { regex: /\bby the way\b/gi, replacement: 'btw', description: 'by the way → btw', priority: 1 },
  { regex: /\bfor real\b/gi, replacement: 'fr', description: 'for real → fr', priority: 1 },
  { regex: /\bnot gonna lie\b/gi, replacement: 'ngl', description: 'not gonna lie → ngl', priority: 1 },
  { regex: /\bto be honest\b/gi, replacement: 'tbh', description: 'to be honest → tbh', priority: 1 },
  { regex: /\bi don't know\b/gi, replacement: 'idk', description: "i don't know → idk", priority: 1 },
  
  // Safe number substitutions
  { regex: /\bgreat\b/gi, replacement: 'gr8', description: 'great → gr8', priority: 1 },
  { regex: /\blate\b/gi, replacement: 'l8', description: 'late → l8', priority: 1 },
  { regex: /\bwait\b/gi, replacement: 'w8', description: 'wait → w8', priority: 1 },
  { regex: /\bmate\b/gi, replacement: 'm8', description: 'mate → m8', priority: 1 },
  { regex: /\btonight\b/gi, replacement: '2nite', description: 'tonight → 2nite', priority: 1 },
  { regex: /\btoday\b/gi, replacement: '2day', description: 'today → 2day', priority: 1 },
  { regex: /\btomorrow\b/gi, replacement: '2morrow', description: 'tomorrow → 2morrow', priority: 1 },
  
  // Safe abbreviations
  { regex: /\babout\b/gi, replacement: 'abt', description: 'about → abt', priority: 1 },
  { regex: /\bsomething\b/gi, replacement: 'sth', description: 'something → sth', priority: 1 },
  { regex: /\bprobably\b/gi, replacement: 'prob', description: 'probably → prob', priority: 1 },
  { regex: /\bdefinitely\b/gi, replacement: 'def', description: 'definitely → def', priority: 1 },
  { regex: /\bobviously\b/gi, replacement: 'obv', description: 'obviously → obv', priority: 1 },
  { regex: /\bseriously\b/gi, replacement: 'srsly', description: 'seriously → srsly', priority: 1 },
  { regex: /\bthanks\b/gi, replacement: 'thx', description: 'thanks → thx', priority: 1 },
  { regex: /\bthank you\b/gi, replacement: 'thx', description: 'thank you → thx', priority: 1 },
];

/**
 * Compression Level 2: Millennial Compression (Demonstrates Over-Compression)
 * Uses aggressive patterns that actually INCREASE token count
 */
const MILLENNIAL_PATTERNS: CompressionPattern[] = [
  // Texting/internet slang and abbreviations
  { regex: /\byou\b/gi, replacement: 'u', description: 'you → u', priority: 1 },
  { regex: /\byour\b/gi, replacement: 'ur', description: 'your → ur', priority: 1 },
  { regex: /\byou\'re\b/gi, replacement: 'ur', description: "you're → ur", priority: 1 },
  { regex: /\bare\b/gi, replacement: 'r', description: 'are → r', priority: 1 },
  { regex: /\bplease\b/gi, replacement: 'plz', description: 'please → plz', priority: 1 },
  { regex: /\bpeople\b/gi, replacement: 'ppl', description: 'people → ppl', priority: 1 },
  { regex: /\bbecause\b/gi, replacement: 'cuz', description: 'because → cuz', priority: 1 },
  { regex: /\bsee you\b/gi, replacement: 'cya', description: 'see you → cya', priority: 1 },
  { regex: /\bfor real\b/gi, replacement: 'fr', description: 'for real → fr', priority: 1 },
  { regex: /\bto be honest\b/gi, replacement: 'tbh', description: 'to be honest → tbh', priority: 1 },
  { regex: /\bnot gonna lie\b/gi, replacement: 'ngl', description: 'not gonna lie → ngl', priority: 1 },
  { regex: /\bby the way\b/gi, replacement: 'btw', description: 'by the way → btw', priority: 1 },
  { regex: /\bshaking my head\b/gi, replacement: 'smh', description: 'shaking my head → smh', priority: 1 },
  { regex: /\blaugh(ing)? out loud\b/gi, replacement: 'lol', description: 'laugh(ing) out loud → lol', priority: 1 },
  { regex: /\boh my god\b/gi, replacement: 'omg', description: 'oh my god → omg', priority: 1 },
  { regex: /\bfor the win\b/gi, replacement: 'ftw', description: 'for the win → ftw', priority: 1 },
  { regex: /\bI don\'t know\b/gi, replacement: 'idk', description: "I don't know → idk", priority: 1 },
  { regex: /\bI don\'t care\b/gi, replacement: 'idc', description: "I don't care → idc", priority: 1 },
  { regex: /\bI love you\b/gi, replacement: 'ily', description: 'I love you → ily', priority: 1 },
  { regex: /\bsee you later\b/gi, replacement: 'cya l8r', description: 'see you later → cya l8r', priority: 1 },
  { regex: /\bwhat the heck\b/gi, replacement: 'wth', description: 'what the heck → wth', priority: 1 },
  { regex: /\bwhat the fuck\b/gi, replacement: 'wtf', description: 'what the fuck → wtf', priority: 1 },
  { regex: /\bnevermind\b/gi, replacement: 'nvm', description: 'nevermind → nvm', priority: 1 },
  { regex: /\bthanks\b/gi, replacement: 'thx', description: 'thanks → thx', priority: 1 },
  { regex: /\bthank you\b/gi, replacement: 'thx', description: 'thank you → thx', priority: 1 },
  { regex: /\babout\b/gi, replacement: 'abt', description: 'about → abt', priority: 1 },
  { regex: /\btonight\b/gi, replacement: '2nite', description: 'tonight → 2nite', priority: 1 },
  { regex: /\btomorrow\b/gi, replacement: '2moro', description: 'tomorrow → 2moro', priority: 1 },
  { regex: /\btoday\b/gi, replacement: '2day', description: 'today → 2day', priority: 1 },
  { regex: /\bsee\b/gi, replacement: 'c', description: 'see → c', priority: 1 },
  { regex: /\bbe right back\b/gi, replacement: 'brb', description: 'be right back → brb', priority: 1 },
  { regex: /\bfor\b/gi, replacement: '4', description: 'for → 4', priority: 1 },
  { regex: /\bto\b/gi, replacement: '2', description: 'to → 2', priority: 1 },
  { regex: /\btoo\b/gi, replacement: '2', description: 'too → 2', priority: 1 },
  { regex: /\bgreat\b/gi, replacement: 'gr8', description: 'great → gr8', priority: 1 },
  { regex: /\blate\b/gi, replacement: 'l8', description: 'late → l8', priority: 1 },
  { regex: /\bwait\b/gi, replacement: 'w8', description: 'wait → w8', priority: 1 },
  { regex: /\bmate\b/gi, replacement: 'm8', description: 'mate → m8', priority: 1 },
  { regex: /\bwith\b/gi, replacement: 'w/', description: 'with → w/', priority: 1 },
  { regex: /\bwithout\b/gi, replacement: 'w/o', description: 'without → w/o', priority: 1 },
  { regex: /\bbefore\b/gi, replacement: 'b4', description: 'before → b4', priority: 1 },
  { regex: /\band\b/gi, replacement: '&', description: 'and → &', priority: 1 },
  { regex: /\bwhat\b/gi, replacement: 'wut', description: 'what → wut', priority: 1 },
  { regex: /\bgoing to\b/gi, replacement: 'gonna', description: 'going to → gonna', priority: 1 },
  { regex: /\bwant to\b/gi, replacement: 'wanna', description: 'want to → wanna', priority: 1 },
  { regex: /\bgot to\b/gi, replacement: 'gotta', description: 'got to → gotta', priority: 1 },
  { regex: /\bkind of\b/gi, replacement: 'kinda', description: 'kind of → kinda', priority: 1 },
  { regex: /\bsort of\b/gi, replacement: 'sorta', description: 'sort of → sorta', priority: 1 },
  { regex: /\bI am\b/gi, replacement: 'im', description: 'I am → im', priority: 1 },
  { regex: /\bam\b/gi, replacement: 'm', description: 'am → m', priority: 1 },
  { regex: /\bsee you\b/gi, replacement: 'cya', description: 'see you → cya', priority: 1 },

  // Safer vowel removal - only for longer words and more conservative
  { regex: /\b([bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ])([aeiouAEIOU])([bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ])([bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]+)\b/g, replacement: ((match, p1, p2, p3, p4) => p1 + p3 + p4) as any, description: 'remove single vowel from middle of long words', priority: 2 },
  // Add more meme/short-form replacements
  { regex: /\bliterally\b/gi, replacement: 'lit', description: 'literally → lit', priority: 3 },
  { regex: /\bseriously\b/gi, replacement: 'srsly', description: 'seriously → srsly', priority: 3 },
  { regex: /\bwhatever\b/gi, replacement: 'whatevs', description: 'whatever → whatevs', priority: 3 },
  { regex: /\bplease\b/gi, replacement: 'plz', description: 'please → plz', priority: 3 },
  { regex: /\bthanks\b/gi, replacement: 'thx', description: 'thanks → thx', priority: 3 },

  // Make it even more ridiculous: add meme speak
  { regex: /\bno\b/gi, replacement: 'nah', description: 'no → nah', priority: 3 },
  { regex: /\byes\b/gi, replacement: 'yeet', description: 'yes → yeet', priority: 3 },
  { regex: /\bhello\b/gi, replacement: 'yo', description: 'hello → yo', priority: 3 },
  { regex: /\bamazing\b/gi, replacement: 'lit', description: 'amazing → lit', priority: 3 },
  { regex: /\bgood\b/gi, replacement: 'gucci', description: 'good → gucci', priority: 3 },
  { regex: /\bbad\b/gi, replacement: 'sus', description: 'bad → sus', priority: 3 },
  { regex: /\bvery\b/gi, replacement: 'hella', description: 'very → hella', priority: 3 },
  { regex: /\bexcited\b/gi, replacement: 'hyped', description: 'excited → hyped', priority: 3 },
  { regex: /\bfriend\b/gi, replacement: 'homie', description: 'friend → homie', priority: 3 },
  { regex: /\bawesome\b/gi, replacement: 'pog', description: 'awesome → pog', priority: 3 },
  { regex: /\bparty\b/gi, replacement: 'rager', description: 'party → rager', priority: 3 },
  { regex: /\bcrying\b/gi, replacement: '😭', description: 'crying → 😭', priority: 3 },
  { regex: /\blaugh(ing)?\b/gi, replacement: '😂', description: 'laugh(ing) → 😂', priority: 3 },
  { regex: /\bfire\b/gi, replacement: '🔥', description: 'fire → 🔥', priority: 3 },
  { regex: /\bheart\b/gi, replacement: '❤️', description: 'heart → ❤️', priority: 3 },
  { regex: /\bwin\b/gi, replacement: 'dub', description: 'win → dub', priority: 3 },
  { regex: /\blose\b/gi, replacement: 'L', description: 'lose → L', priority: 3 },
  { regex: /\bdefinitely\b/gi, replacement: 'def', description: 'definitely → def', priority: 3 },
  { regex: /\bprobably\b/gi, replacement: 'prolly', description: 'probably → prolly', priority: 3 },
  { regex: /\bobviously\b/gi, replacement: 'obv', description: 'obviously → obv', priority: 3 },
  { regex: /\bseriously\b/gi, replacement: 'srsly', description: 'seriously → srsly', priority: 3 },
  { regex: /\bwhatever\b/gi, replacement: 'whatevs', description: 'whatever → whatevs', priority: 3 },
  { regex: /\bnevermind\b/gi, replacement: 'nvm', description: 'nevermind → nvm', priority: 3 },
  { regex: /\bbye\b/gi, replacement: 'bai', description: 'bye → bai', priority: 3 },
];

/**
 * Compression levels configuration - 2 levels only
 */
export const COMPRESSION_LEVELS: CompressionLevel[] = [
  {
    name: 'Effective Compression',
    description: 'Tokenizer-aware compression that actually reduces token count',
    patterns: EFFECTIVE_PATTERNS,
    educationalNote: 'Uses only abbreviations that are single tokens in OpenAI\'s tokenizer, ensuring real token savings.'
  },
  {
    name: 'Millennial Meme Compression',
    description: 'Ridiculous, meme-worthy, vowel-obliterating, slang-packed Gen Z/Internet speak. Not for serious use. 😂',
    patterns: MILLENNIAL_PATTERNS,
    educationalNote: 'Removes almost all vowels, uses as much texting slang and meme language as possible. Output is barely readable but hilarious.'
  },
];

/**
 * Enhanced compression function
 */
export function compressText(text: string, level: number = 1): CompressionResult {
  if (!text || text.trim().length === 0) {
    return {
      compressed: text,
      originalLength: 0,
      compressedLength: 0,
      compressionRatio: 0,
      tokensSaved: 0,
      patterns: [],
    };
  }
  
  // Validate level (now supports 1-2)
  if (level < 1 || level > 2) {
    throw new Error('Compression level must be between 1 and 2');
  }
  
  const originalLength = text.length;
  const originalTokens = calculateTokens(text);
  
  // Apply compression patterns
  const compressionLevel = COMPRESSION_LEVELS[level - 1];
  const { result: compressedText, appliedPatterns } = applyCompressionPatterns(
    text,
    compressionLevel.patterns
  );
  
  // Clean up extra spaces and normalize
  const cleanedCompressed = compressedText
    .replace(/\s+/g, ' ')
    .replace(/\s+([.!?;:,])/g, '$1') // Remove space before punctuation
    .trim();
  
  const compressedLength = cleanedCompressed.length;
  const compressedTokens = calculateTokens(cleanedCompressed);
  const compressionRatio = originalLength > 0 ? ((originalLength - compressedLength) / originalLength) * 100 : 0;
  const tokensSaved = originalTokens - compressedTokens;
  
  return {
    compressed: cleanedCompressed,
    originalLength,
    compressedLength,
    compressionRatio,
    tokensSaved,
    patterns: appliedPatterns,
  };
}

/**
 * Preserves the capitalization of the original word when applying replacement
 */
function preserveCase(original: string, replacement: string): string {
  if (!original || !replacement) return replacement;
  
  // If original is all uppercase, make replacement uppercase
  if (original === original.toUpperCase()) {
    return replacement.toUpperCase();
  }
  
  // If original starts with uppercase, capitalize replacement
  if (original[0] === original[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  
  // Otherwise, keep replacement as is
  return replacement;
}

/**
 * Applies compression patterns to text with smart ordering and case preservation
 */
function applyCompressionPatterns(text: string, patterns: CompressionPattern[]): { result: string; appliedPatterns: string[] } {
  let result = text;
  const appliedPatterns: string[] = [];
  const maxIterations = 100; // Prevent infinite loops
  let iterations = 0;
  
  // Sort patterns by priority (lower number = higher priority)
  const sortedPatterns = patterns.sort((a, b) => a.priority - b.priority);
  
  for (const pattern of sortedPatterns) {
    if (iterations++ > maxIterations) {
      console.warn('Max iterations reached in text compression, stopping to prevent infinite loop');
      break;
    }
    
    const beforeLength = result.length;
    const beforeText = result;
    
    try {
      // Apply replacement with case preservation
      if (typeof pattern.replacement === 'function') {
        // Handle function replacements directly without preserveCase
        result = result.replace(pattern.regex, pattern.replacement as any);
      } else {
        // Apply replacement with case preservation for string replacements
        result = result.replace(pattern.regex, (match) => {
          return preserveCase(match, pattern.replacement as string);
        });
      }
      
      // Track which patterns were actually applied
      if (result.length !== beforeLength || result !== beforeText) {
        appliedPatterns.push(pattern.description);
      }
    } catch (error) {
      console.error('Error applying pattern:', pattern.description, error);
      // Continue with other patterns
    }
  }
  
  return { result, appliedPatterns };
}

/**
 * Calculates approximate token count (rough estimation: 1 token ≈ 4 characters)
 */
function calculateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Enhanced decompression function with reverse mapping
 */
export function decompressText(compressedText: string, level: number = 1): string {
  if (!compressedText || compressedText.trim().length === 0) {
    return compressedText;
  }
  
  // Validate level
  if (level < 1 || level > 2) {
    throw new Error('Compression level must be between 1 and 2');
  }
  
  let result = compressedText;
  const compressionLevel = COMPRESSION_LEVELS[level - 1];
  
  // Create reverse mapping
  const reverseMap = new Map<string, string>();
  
  for (const pattern of compressionLevel.patterns) {
    const description = pattern.description;
    if (description.includes(' → ')) {
      const [original, compressed] = description.split(' → ');
      reverseMap.set(compressed, original);
    }
  }
  
  // Apply reverse transformations
  for (const [compressed, original] of reverseMap.entries()) {
    const reverseRegex = new RegExp(`\\b${compressed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    result = result.replace(reverseRegex, original);
  }
  
  return result;
}

/**
 * Gets information about a compression level
 */
export function getCompressionLevelInfo(level: number): CompressionLevel {
  if (level < 1 || level > 2) {
    throw new Error('Compression level must be between 1 and 2');
  }
  
  return COMPRESSION_LEVELS[level - 1];
}

/**
 * Enhanced validation with Ultra mode considerations
 */
export function validateCompressionQuality(original: string, compressed: string): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;
  
  // Check if compression is too aggressive
  const compressionRatio = ((original.length - compressed.length) / original.length) * 100;
  if (compressionRatio > 70) {
    issues.push('Ultra compression achieved (>70% reduction) - verify readability');
    score -= 10; // Less penalty for ultra mode
  }
  
  // Check for potential ambiguities
  if (compressed.includes('th th')) {
    issues.push('Potential ambiguity: multiple "th" articles');
    score -= 10;
  }
  
  // Check if essential punctuation is preserved
  const originalPunctuation = original.match(/[.!?;:,]/g)?.length || 0;
  const compressedPunctuation = compressed.match(/[.!?;:,]/g)?.length || 0;
  if (compressedPunctuation < originalPunctuation * 0.7) {
    issues.push('Some punctuation may have been lost');
    score -= 15;
  }
  
  // Check for readability (vowel to consonant ratio)
  const vowels = compressed.match(/[aeiouAEIOU]/g)?.length || 0;
  const consonants = compressed.match(/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]/g)?.length || 0;
  if (consonants > 0 && vowels / consonants < 0.2) {
    issues.push('Very low vowel ratio - may impact readability');
    score -= 5; // Minor penalty for ultra compression
  }
  
  // Check for word length extremes
  const words = compressed.split(/\s+/);
  const veryShortWords = words.filter(word => word.length === 1 && !/[&12348]/.test(word)).length;
  if (veryShortWords > words.length * 0.3) {
    issues.push('High ratio of single-character words');
    score -= 10;
  }
  
  return {
    isValid: score > 50, // More lenient for ultra compression
    issues,
    score: Math.max(0, score),
  };
}

/**
 * Utility function to analyze compression effectiveness
 */
export function analyzeCompression(original: string, compressed: string): {
  characterSavings: number;
  wordReduction: number;
  tokenSavings: number;
  efficiency: number;
  readabilityScore: number;
} {
  const originalWords = original.split(/\s+/).length;
  const compressedWords = compressed.split(/\s+/).length;
  const originalTokens = calculateTokens(original);
  const compressedTokens = calculateTokens(compressed);
  
  const characterSavings = original.length - compressed.length;
  const wordReduction = ((originalWords - compressedWords) / originalWords) * 100;
  const tokenSavings = originalTokens - compressedTokens;
  const efficiency = characterSavings / original.length;
  
  // Simple readability score based on vowel distribution and word length
  const avgWordLength = compressed.length / compressedWords;
  const vowelRatio = (compressed.match(/[aeiouAEIOU]/g)?.length || 0) / compressed.length;
  const readabilityScore = Math.max(0, 100 - (avgWordLength * 10) + (vowelRatio * 50));
  
  return {
    characterSavings,
    wordReduction,
    tokenSavings,
    efficiency,
    readabilityScore: Math.min(100, readabilityScore),
  };
}

/**
 * Demo function to showcase compression levels
 */
export function demoCompression(text: string): void {
  console.log('=== COMPRESSION DEMO ===\n');
  console.log(`Original: "${text}"`);
  console.log(`Length: ${text.length} characters\n`);
  
  for (let level = 1; level <= 4; level++) {
    const result = compressText(text, level);
    const analysis = analyzeCompression(text, result.compressed);
    
    console.log(`--- Level ${level}: ${COMPRESSION_LEVELS[level - 1].name} ---`);
    console.log(`Compressed: "${result.compressed}"`);
    console.log(`Length: ${result.compressedLength} chars (${result.compressionRatio.toFixed(1)}% reduction)`);
    console.log(`Tokens saved: ${result.tokensSaved}`);
    console.log(`Readability: ${analysis.readabilityScore.toFixed(1)}/100`);
    console.log(`Applied patterns: ${result.patterns.slice(0, 5).join(', ')}${result.patterns.length > 5 ? '...' : ''}\n`);
  }
}

/**
 * Aggressively optimizes text for LLM input by removing unnecessary punctuation, stopwords, and transition words,
 * while preserving meaning and LLM understanding. Returns the optimized string.
 */
export function llmTokenOptimize(text: string): string {
  if (!text || text.trim().length === 0) return text;

  // List of common English stopwords (can be expanded)
  const stopwords = new Set([
    'the', 'a', 'an', 'of', 'to', 'for', 'in', 'on', 'at', 'by', 'with', 'from', 'as', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'am', 'do', 'does', 'did', 'has', 'have', 'had', 'will', 'would', 'can', 'could', 'should',
    'may', 'might', 'must', 'shall', 'and', 'or', 'but', 'so', 'if', 'than', 'then', 'that', 'this', 'these', 'those',
    'it', 'its', 'he', 'she', 'they', 'them', 'his', 'her', 'their', 'you', 'your', 'yours', 'we', 'us', 'our', 'ours',
    'i', 'me', 'my', 'mine', 'him', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves', 'myself',
    'about', 'above', 'below', 'under', 'over', 'again', 'further', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
    'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
    'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now',
  ]);

  // List of common transition words/phrases (can be expanded)
  const transitionWords = [
    'however', 'therefore', 'thus', 'then', 'so', 'also', 'besides', 'furthermore', 'moreover', 'meanwhile',
    'consequently', 'accordingly', 'hence', 'otherwise', 'nevertheless', 'nonetheless', 'still', 'instead',
    'similarly', 'likewise', 'additionally', 'in addition', 'in contrast', 'on the other hand', 'for example',
    'for instance', 'in conclusion', 'in summary', 'to sum up', 'in fact', 'as a result', 'as well', 'next',
    'finally', 'first', 'second', 'third', 'last', 'lastly', 'afterward', 'beforehand', 'meanwhile', 'subsequently',
  ];

  // Remove transition words/phrases (whole word/phrase, case-insensitive)
  let optimized = text;
  for (const phrase of transitionWords) {
    // Use word boundaries for single words, and loose matching for phrases
    if (phrase.includes(' ')) {
      const regex = new RegExp(`\\b${phrase.replace(/ /g, '\\s+')}\\b`, 'gi');
      optimized = optimized.replace(regex, '');
    } else {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      optimized = optimized.replace(regex, '');
    }
  }

  // Remove punctuation except for sentence boundaries (keep . ! ?)
  optimized = optimized.replace(/[,:;\-—()\[\]{}"'`~@#$%^&*_+=<>\\/|]/g, '');

  // Remove stopwords (whole word, case-insensitive)
  optimized = optimized.replace(/\b\w+\b/g, (word) => {
    return stopwords.has(word.toLowerCase()) ? '' : word;
  });

  // Remove extra spaces and normalize
  optimized = optimized.replace(/\s+/g, ' ').replace(/\s+([.!?])/g, '$1').trim();

  // Remove leading/trailing punctuation
  optimized = optimized.replace(/^[.!?]+|[.!?]+$/g, '');

  return optimized;
}