import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "> TOKENWISE";
  const [showCursor, setShowCursor] = useState(true);

  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/95 border-b border-primary/30">
      <div className="w-full px-4 sm:px-10 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-primary/20 border border-primary/50 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/10 animate-pulse" />
              <span className="text-primary text-lg font-bold relative z-10">&gt;</span>
            </div>
            <h1 className="text-xl font-bold text-primary tracking-tight uppercase">
              {displayedText}
              <span
                className={`inline-block ml-1 w-2 h-5 bg-primary ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ transition: 'opacity 0.1s' }}
              />
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hidden sm:flex items-center gap-2">
              <span className="text-foreground/60">$</span> by Lo
              <Button
                asChild
                variant="link"
                size="sm"
                className="px-2 py-1 text-xs border border-secondary/50 hover:border-secondary hover:bg-secondary/10 transition-all text-secondary hover:text-secondary"
              >
                <a href="https://www.loren.fyi" target="_blank" rel="noopener noreferrer">
                  loren.fyi
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
