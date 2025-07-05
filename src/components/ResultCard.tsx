import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenCounter } from "./TokenCounter";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultCardProps {
  title: string;
  content: string;
  isLoading?: boolean;
  type?: "prompt" | "response";
  tokenCount?: number;
}

export const ResultCard = ({ title, content, isLoading = false, type = "prompt", tokenCount }: ResultCardProps) => {
  if (isLoading) {
    return (
      <Card className="oval-card animate-pulse">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <div className="h-4 bg-muted rounded w-24"></div>
        </CardFooter>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className="oval-card opacity-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            {type === "prompt" ? "Compressed prompt will appear here" : "AI response will appear here"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="oval-card animate-fade-up">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] w-full rounded-md">
          <div className="whitespace-pre-wrap text-sm leading-relaxed pr-4">
            {content}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <TokenCounter text={content} tokenCount={tokenCount} />
      </CardFooter>
    </Card>
  );
};
