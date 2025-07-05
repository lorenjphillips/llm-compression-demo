
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const models = [
  { 
    id: "gpt-4.1", 
    name: "GPT-4.1", 
    description: "Smartest model for complex tasks",
    inputPrice: "$2.00",
    outputPrice: "$8.00",
    cachedInputPrice: "$0.50",
    displayPrice: "Input: $2.00/1M • Output: $8.00/1M"
  },
  { 
    id: "gpt-4.1-mini", 
    name: "GPT-4.1 Mini", 
    description: "Affordable model balancing speed and intelligence",
    inputPrice: "$0.40",
    outputPrice: "$1.60",
    cachedInputPrice: "$0.10",
    displayPrice: "Input: $0.40/1M • Output: $1.60/1M"
  },
  { 
    id: "gpt-4.1-nano", 
    name: "GPT-4.1 Nano", 
    description: "Fastest, most cost-effective model for low-latency tasks",
    inputPrice: "$0.10",
    outputPrice: "$0.40",
    cachedInputPrice: "$0.025",
    displayPrice: "Input: $0.10/1M • Output: $0.40/1M"
  },
  { 
    id: "o3", 
    name: "OpenAI o3", 
    description: "Most powerful reasoning model for coding, math, science",
    inputPrice: "$2.00",
    outputPrice: "$8.00",
    cachedInputPrice: "$0.50",
    displayPrice: "Input: $2.00/1M • Output: $8.00/1M"
  },
  { 
    id: "o4-mini", 
    name: "OpenAI o4-mini", 
    description: "Faster, cost-efficient reasoning model",
    inputPrice: "$1.10",
    outputPrice: "$4.40",
    cachedInputPrice: "$0.275",
    displayPrice: "Input: $1.10/1M • Output: $4.40/1M"
  }
];

export const ModelSelector = ({ value, onChange }: ModelSelectorProps) => {
  const selectedModel = models.find(m => m.id === value);
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">AI Model</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-auto min-h-[60px] py-3">
          <div className="flex flex-col items-start w-full">
            <span className="font-medium text-sm">
              {selectedModel?.name || "Select a model"}
            </span>
            {selectedModel && (
              <span className="text-xs text-muted-foreground mt-1">
                {selectedModel.displayPrice}
              </span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="w-full max-h-[400px]">
          {models.map((model) => (
            <SelectItem 
              key={model.id} 
              value={model.id} 
              className={`cursor-pointer py-3 pl-3 pr-3 h-auto focus:bg-accent data-[state=checked]:bg-blue-50 data-[state=checked]:border-l-4 data-[state=checked]:border-blue-500 [&>span.absolute]:hidden [&>span:first-child]:hidden`}
            >
              <div className="flex w-full">
                <div className="flex-1 flex flex-col space-y-1 min-w-0 pr-4">
                  <span className="font-medium text-sm">{model.name}</span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {model.description}
                  </span>
                </div>
                <div className="flex flex-col items-end space-y-1 min-w-[120px]">
                  <span className="text-xs text-green-600 font-semibold whitespace-nowrap">
                    {model.inputPrice}/1M
                  </span>
                  <span className="text-xs text-blue-600 font-semibold whitespace-nowrap">
                    Out: {model.outputPrice}/1M
                  </span>
                  <span className="text-xs text-purple-600 font-semibold whitespace-nowrap">
                    Cached: {model.cachedInputPrice}/1M
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
