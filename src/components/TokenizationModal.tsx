import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface TokenizationModalProps {
  children: React.ReactNode;
}

export const TokenizationModal = ({ children }: TokenizationModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Why Over-Compression Doesn't Help: The Tokenization Trap
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* The Problem */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              The Problem: Unknown Tokens
            </h3>
            <p className="text-red-700 text-sm mb-3">
              OpenAI's tokenizer segments text into subword units based on patterns learned from its training data. Excessive or nonstandard abbreviations can result in <strong>unknown token sequences</strong> that the tokenizer does not recognize, often increasing rather than reducing token count.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-red-800 mb-2">Problematic Compression Patterns</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono">government → gvmt</span>
                    <div className="text-red-600">Creates unfamiliar consonant cluster: <Badge variant="destructive">gv-mt</Badge> (2+ tokens)</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono">thinking → thinkn</span>
                    <div className="text-red-600">Unknown ending: <Badge variant="destructive">think-n</Badge> (2+ tokens)</div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono">happened → hppnd</span>
                    <div className="text-red-600">Uncommon pattern: <Badge variant="destructive">h-pp-nd</Badge> (3+ tokens)</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-red-800 mb-2">Tokenization Example</h4>
                <div className="bg-white p-3 rounded border text-sm">
                  <div className="mb-2">
                    <strong>Original:</strong> "government" 
                    <Badge variant="secondary">1-2 tokens</Badge>
                  </div>
                  <div>
                    <strong>Compressed:</strong> "gvmt" 
                    <Badge variant="destructive">2-3 tokens</Badge>
                  </div>
                  <div className="text-red-600 mt-1 text-xs">
                    Results in more tokens than the original.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Solution */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              The Solution: Tokenizer-Aware Compression
            </h3>
            <p className="text-green-700 text-sm mb-3">
              Use only abbreviations that are <strong>single tokens</strong> in OpenAI's tokenizer. These are typically common abbreviations or acronyms that were present in the model's training data.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-800 mb-2">Effective Abbreviations</h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono">you → u</span>
                    <div className="text-green-600">Common abbreviation: <Badge variant="secondary">1 token</Badge></div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono">oh my god → omg</span>
                    <div className="text-green-600">Widely recognized: <Badge variant="secondary">1 token</Badge></div>
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <span className="font-mono">for real → fr</span>
                    <div className="text-green-600">Standard internet abbreviation: <Badge variant="secondary">1 token</Badge></div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-green-800 mb-2">Compression Example</h4>
                <div className="bg-white p-3 rounded border text-sm">
                  <div className="mb-2">
                    <strong>Original:</strong> "oh my god you are" 
                    <Badge variant="outline">4 tokens</Badge>
                  </div>
                  <div>
                    <strong>Compressed:</strong> "omg u are" 
                    <Badge variant="secondary">3 tokens</Badge>
                  </div>
                  <div className="text-green-600 mt-1 text-xs">
                    Demonstrates actual token reduction.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why This Happens */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Why Tokenizers Work This Way
            </h3>
            <div className="text-blue-700 text-sm space-y-2">
              <p>
                <strong>Training Data:</strong> The tokenizer was trained on large-scale internet text, including forums and social media, where common abbreviations (e.g., "omg", "u", "tbh") are frequent and thus recognized as single tokens.
              </p>
              <p>
                <strong>Subword Units:</strong> Unfamiliar or rare abbreviations are split into multiple subword tokens, which can increase token count and cost.
              </p>
              <p>
                <strong>Frequency Matters:</strong> Only abbreviations that appeared frequently in the training data are likely to be single tokens.
              </p>
            </div>
          </div>

          {/* Our Approach */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-3">Our Two-Level Approach</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-purple-800 mb-2">Level 1: Effective Compression</h4>
                <p className="text-sm text-purple-700 mb-2">
                  Uses only proven single-token abbreviations that reliably reduce OpenAI token usage.
                </p>
                <div className="text-xs text-purple-600">
                  Examples: u, ur, omg, btw, fr, ngl, tbh, 2, 4, &, w/, b4, bc
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-purple-800 mb-2">Level 2: Aggressive Compression</h4>
                <p className="text-sm text-purple-700 mb-2">
                  Demonstrates the risks of over-compression, such as aggressive vowel removal and nonstandard patterns, which often increase token count.
                </p>
                <div className="text-xs text-purple-600">
                  Examples: gvmt, hppnd, thinkn, ths, tht (may increase tokens)
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Use only common abbreviations that are recognized as single tokens by the tokenizer.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span>Avoid aggressive abbreviation strategies that create unfamiliar token patterns.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>Always verify compression results using actual token counts, not just character counts.</span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>For reliable savings, use Level 1 Effective Compression.</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};