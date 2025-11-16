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

  
  const hasMillennialSavings = millennialSaved > 0;
  const hasLlmSavings = llmSaved > 0;

  const message = (
    <div className="flex flex-row items-center gap-4 text-sm font-mono text-foreground">
      {hasLlmSavings ? (
        <CheckCircle className="h-4 w-4 text-success" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-warning" />
      )}
      <span className="uppercase tracking-wider text-primary">&gt; Token Comparison:</span>
      <span className="flex flex-row gap-3 text-xs">
        <span>
          <span className="text-muted-foreground">baseline:</span> {originalTokens.toLocaleString()}
        </span>
        <span className="text-border">|</span>
        <span className={hasMillennialSavings ? "text-warning" : "text-destructive"}>
          millennial: {millennialTokens.toLocaleString()} ({millennialSaved > 0 ? '-' : '+'}{Math.abs(millennialSaved).toLocaleString()})
        </span>
        <span className="text-border">|</span>
        <span className={hasLlmSavings ? "text-success" : "text-muted-foreground"}>
          llm_opt: {llmOptimizedTokens.toLocaleString()} ({llmSaved > 0 ? '-' : '+'}{Math.abs(llmSaved).toLocaleString()})
        </span>
      </span>
    </div>
  );

  
  let note = null;
  if (millennialTokens > originalTokens) {
    
    note = (
      <div className="flex flex-row items-center justify-center gap-3 mt-4 text-sm font-mono w-full text-center text-destructive">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <span>
          [!] Character-based compression increased tokens by {Math.abs(millennialSaved).toLocaleString()}. Token-aware compression saves {llmSaved.toLocaleString()} tokens.
        </span>
      </div>
    );
  } else if (llmSaved > millennialSaved && llmSaved > 0) {
    
    note = (
      <div className="flex flex-row items-center justify-center gap-3 mt-4 text-sm font-mono w-full text-center text-success">
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <span>
          [✓] Token-aware compression saves {llmPercent}% ({llmSaved.toLocaleString()} tokens) vs {millennialPercent}% for character-based.
        </span>
      </div>
    );
  } else if (llmSaved > 0) {
    
    note = (
      <div className="flex flex-row items-center justify-center gap-3 mt-4 text-sm font-mono w-full text-center text-success">
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <span>
          [✓] Token-aware compression saved {llmSaved.toLocaleString()} tokens ({llmPercent}%).
        </span>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="terminal-card px-6 py-4 flex items-center justify-center gap-3 flex-col md:flex-row">
        {message}
      </div>
      <div className="w-full flex justify-center">
        {note}
      </div>
    </div>
  );
};
