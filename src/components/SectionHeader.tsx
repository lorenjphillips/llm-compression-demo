interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showArrows?: boolean;
}

export const SectionHeader = ({ title, subtitle, showArrows = true }: SectionHeaderProps) => {
  return (
    <div className="mb-6">

      <div className="border-b border-primary/30 pb-3">
        <h2 className="text-lg font-mono font-semibold text-primary uppercase tracking-wider">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm font-mono text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {showArrows && (
        <div className="flex justify-between mt-4 mb-2 px-4">
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Baseline</span>
            <span className="text-muted-foreground/30 text-lg">↓</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-mono text-warning uppercase tracking-wider">Millennial</span>
            <span className="text-warning/30 text-lg">↓</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-mono text-success uppercase tracking-wider">LLM Optimized</span>
            <span className="text-success/30 text-lg">↓</span>
          </div>
        </div>
      )}
    </div>
  );
};
