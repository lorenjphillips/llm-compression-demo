import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenCounter } from "./TokenCounter";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultCardProps {
  title: string;
  content: string;
  isLoading?: boolean;
  type?: "prompt" | "response";
  tokenCount?: number;
  isOptimal?: boolean;
  badge?: {
    number: number;
    color: string;
  };
}

export const ResultCard = ({ title, content, isLoading = false, type = "prompt", tokenCount, isOptimal = false, badge }: ResultCardProps) => {
  if (isLoading) {
    return (
      <Card className="terminal-card animate-pulse">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm uppercase tracking-wider text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-primary/10 rounded w-full"></div>
            <div className="h-4 bg-primary/10 rounded w-3/4"></div>
            <div className="h-4 bg-primary/10 rounded w-1/2"></div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t border-border">
          <div className="h-4 bg-primary/10 rounded w-24"></div>
        </CardFooter>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className="terminal-card opacity-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm uppercase tracking-wider text-muted">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            {type === "prompt" ? "$ waiting for compression..." : "$ waiting for response..."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`terminal-card ${isOptimal ? 'border-success' : ''} relative`}>

      {badge && (
        <div className={`
          absolute -top-3 -left-3 w-8 h-8 rounded-full border-2
          flex items-center justify-center bg-background
          font-mono font-semibold text-sm z-10
          ${badge.color} border-current shadow-lg
        `}>
          {badge.number}
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className={`text-sm uppercase tracking-wider ${isOptimal ? 'text-success' : 'text-primary'}`}>
          {isOptimal && <span className="text-success">[✓] </span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] w-full">
          <div className="whitespace-pre-wrap text-sm leading-relaxed pr-4 font-mono text-foreground/90">
            {content}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t border-border">
        <TokenCounter text={content} tokenCount={tokenCount} />
      </CardFooter>
    </Card>
  );
};
