import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

interface CompressionPatternsProps {
  patterns: string[];
  compressionRatio: number;
  tokensSaved: number;
}

export const CompressionPatterns = ({ patterns, compressionRatio, tokensSaved }: CompressionPatternsProps) => {
  if (patterns.length === 0) {
    return null;
  }

  return (
    <Card className="bg-content1 border-1 shadow-sm rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-4 w-4 text-primary" />
          Compression Analysis
        </CardTitle>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Tokens saved: <strong className="text-primary">{tokensSaved}</strong></span>
          <span>Reduction: <strong className="text-primary">{compressionRatio.toFixed(1)}%</strong></span>
          <span>Patterns used: <strong className="text-primary">{patterns.length}</strong></span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32">
          <div className="flex flex-wrap gap-2">
            {patterns.map((pattern, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {pattern}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};