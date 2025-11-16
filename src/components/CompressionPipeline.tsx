interface CompressionPipelineProps {
  isActive: boolean;
  currentMethod?: "baseline" | "millennial" | "llm-optimized";
}

export const CompressionPipeline = ({ isActive, currentMethod }: CompressionPipelineProps) => {
  const methods = [
    {
      id: "baseline",
      number: 1,
      label: "Baseline",
      description: "no compression",
      color: "text-muted-foreground",
    },
    {
      id: "millennial",
      number: 2,
      label: "Millennial",
      description: "char-based",
      color: "text-warning",
    },
    {
      id: "llm-optimized",
      number: 3,
      label: "LLM-Optimized",
      description: "token-aware",
      color: "text-success",
    },
  ];

  return (
    <div className="my-6 px-4">

      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary" />
        <span className="text-sm font-mono text-primary uppercase tracking-wider">
          Input_Text
        </span>
      </div>

      <div className="relative ml-6">

        <div className="absolute left-0 top-0 bottom-0 w-px bg-primary/25" />

        {methods.map((method, index) => {
          const isActive = currentMethod === method.id;
          const isLast = index === methods.length - 1;

          return (
            <div
              key={method.id}
              className="relative flex items-center gap-3 py-3"
            >

              <div className="absolute left-0 w-6 h-px bg-primary/25" />

              <div
                className={`
                  relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center
                  bg-background transition-all duration-300
                  ${isActive
                    ? 'branch-active border-primary text-primary'
                    : 'border-primary/30 text-primary/50'}
                `}
              >
                <span className="text-xs font-mono font-semibold">
                  {method.number}
                </span>
              </div>

              <div className="flex-1 ml-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm font-mono font-semibold ${method.color} ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {method.label}
                  </span>
                  <span className="text-xs font-mono text-foreground/50">
                    ({method.description})
                  </span>
                </div>
              </div>

              {isActive && (
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {isActive && (
        <div className="mt-4 text-xs font-mono text-primary/60 text-center animate-pulse">
          &gt; processing pipeline active...
        </div>
      )}
    </div>
  );
};
