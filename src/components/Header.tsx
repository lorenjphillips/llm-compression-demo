import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="w-full px-4 sm:px-10 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <img src="/favicon.ico" alt="Logo" className="h-6 w-6 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-foreground">KobiCompression</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hidden sm:flex items-center gap-2">
              Prompt Compression Playground by Lo
              <Button
                asChild
                variant="link"
                size="sm"
                className="px-2 py-1 text-xs border border-[hsl(var(--secondary))] border-2"
              >
                <a href="https://www.loren.fyi" target="_blank" rel="noopener noreferrer">
                  www.loren.fyi
                </a>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
