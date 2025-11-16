import { Check } from "lucide-react";

type ProcessingStep = "compress" | "tokenize" | "query_openai" | null;

interface ProcessingStepsProps {
  currentStep: ProcessingStep;
}

export const ProcessingSteps = ({ currentStep }: ProcessingStepsProps) => {
  const steps = [
    { id: "compress", label: "compress_text" },
    { id: "tokenize", label: "tokenize_prompts" },
    { id: "query_openai", label: "query_openai" },
  ] as const;

  const getStepIndex = (step: ProcessingStep): number => {
    if (!step) return -1;
    return steps.findIndex((s) => s.id === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span className="text-primary animate-pulse">⚡</span>
      <div className="flex items-center gap-3">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center gap-1.5">

              <span className="flex items-center gap-1">
                {isCompleted && (
                  <Check className="h-3 w-3 text-success" />
                )}
                {isCurrent && (
                  <span className="text-primary animate-pulse">⚡</span>
                )}
                {isPending && (
                  <span className="text-muted-foreground">•</span>
                )}

                <span
                  className={`
                    ${isCompleted && "text-success/70"}
                    ${isCurrent && "text-primary"}
                    ${isPending && "text-muted-foreground/50"}
                  `}
                >
                  {step.label}
                </span>
              </span>

              {index < steps.length - 1 && (
                <span className="text-border mx-1">→</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
