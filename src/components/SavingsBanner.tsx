import { CheckCircle, AlertTriangle } from "lucide-react";

interface SavingsBannerProps {
  originalTokens: number;
  millennialTokens: number;
  llmOptimizedTokens: number;
  show: boolean;
  isActualOpenAIStats?: boolean;
}

export const SavingsBanner = ({ originalTokens, millennialTokens, llmOptimizedTokens, show, isActualOpenAIStats = false }: SavingsBannerProps) => {
  if (!show || originalTokens === 0) return null;

  const millennialSaved = originalTokens - millennialTokens;
  const millennialPercent = Math.round((millennialSaved / originalTokens) * 100);
  const llmSaved = originalTokens - llmOptimizedTokens;
  const llmPercent = Math.round((llmSaved / originalTokens) * 100);

  let message = (
    <div className={`flex flex-row items-center gap-4 text-base font-medium ${isActualOpenAIStats ? 'text-green-900' : 'text-success-foreground'}`}>
      <CheckCircle className="h-5 w-5" />
      <span>{isActualOpenAIStats ? 'Actual OpenAI token savings:' : 'Token savings:'}</span>
      <span className="flex flex-row gap-2">
        <span><span className="font-semibold">Millennial:</span> {millennialPercent}% ({millennialSaved.toLocaleString()} tokens)</span>
        <span className="text-muted-foreground">|</span>
        <span><span className="font-semibold">LLM-Optimized:</span> {llmPercent}% ({llmSaved.toLocaleString()} tokens)</span>
      </span>
    </div>
  );

  // Educational note
  let note = null;
  if (millennialTokens < originalTokens && millennialTokens > llmOptimizedTokens) {
    note = (
      <div className="flex flex-row items-center justify-center gap-3 text-yellow-800 mt-4 text-base font-medium w-full text-center">
        <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
        <span>
          Millennial-style over-compression can sometimes <b>increase</b> token count or reduce readability. For real savings, use <b>LLM-optimized</b> or <b>tokenizer-aware</b> compression.
        </span>
      </div>
    );
  } else if (millennialTokens > originalTokens) {
    note = (
      <div className="flex flex-row items-center justify-center gap-3 text-red-800 mt-4 text-base font-medium w-full text-center">
        <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
        <span>
          Over-compression <b>increased</b> your token count compared to the original!<br />
          <span className="block mt-1 text-sm font-normal">
            <b>Original:</b> {originalTokens.toLocaleString()} tokens &nbsp;|&nbsp; <b>Millennial:</b> {millennialTokens.toLocaleString()} tokens &nbsp;|&nbsp; <b>LLM-Optimized:</b> {llmOptimizedTokens.toLocaleString()} tokens
          </span>
          <br />For best results, use proven abbreviations or <b>LLM-optimized</b> compression, which actually reduces tokens.
        </span>
      </div>
    );
  } else {
    note = (
      <div className="flex flex-row items-center justify-center gap-3 text-green-800 mt-4 text-base font-medium w-full text-center">
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
        <span>
          LLM-optimized compression reliably reduces tokens and cost while preserving meaning and readability.
        </span>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className={`bg-success text-success-foreground rounded-xl px-6 py-4 flex items-center justify-center gap-3 shadow-sm flex-col md:flex-row`}>
        {message}
      </div>
      <div className="w-full flex justify-center">
        {note}
      </div>
    </div>
  );
};
