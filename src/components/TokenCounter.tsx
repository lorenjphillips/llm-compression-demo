import { useState, useEffect } from 'react';

interface TokenCounterProps {
  text: string;
  className?: string;
  tokenCount?: number;
}

export const TokenCounter = ({ text, className = "", tokenCount }: TokenCounterProps) => {
  const [estimatedTokenCount, setEstimatedTokenCount] = useState(0);

  useEffect(() => {
    // Simple token estimation (more accurate would use tiktoken)
    // Roughly 4 characters per token on average
    const estimatedTokens = Math.ceil(text.length / 4);
    setEstimatedTokenCount(estimatedTokens);
  }, [text]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const isActual = tokenCount !== undefined && tokenCount !== null;
  const displayCount = isActual ? tokenCount : estimatedTokenCount;

  return (
    <div className={`flex items-center gap-2 text-sm ${isActual ? 'text-green-800' : 'text-muted-foreground'} ${className}`}>
      <span>🪙</span>
      <span>
        {isActual ? 'Tokens:' : 'Estimated Tokens:'} <span className={`font-medium ${isActual ? 'text-green-900' : 'text-foreground'}`}>{formatNumber(displayCount)}</span>
      </span>
    </div>
  );
};
