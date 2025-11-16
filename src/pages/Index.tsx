import { useState } from "react";
import { Header } from "@/components/Header";
import { TokenCounter } from "@/components/TokenCounter";
import { ModelSelector } from "@/components/ModelSelector";
import { ResultCard } from "@/components/ResultCard";
import { SavingsBanner } from "@/components/SavingsBanner";
import { CompressionPatterns } from "@/components/CompressionPatterns";
import { TokenizationModal } from "@/components/TokenizationModal";
import { CompressionPipeline } from "@/components/CompressionPipeline";
import { ProcessingSteps } from "@/components/ProcessingSteps";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Zap, RotateCcw, HelpCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { compressText, type CompressionResult, llmTokenOptimize, analyzeCompression } from "@/lib/textCompression";
import { WavyBackground } from "@/components/WavyBackground";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const EXAMPLES = [
  
  "However, the results of our experiment were not as expected. Therefore, we decided to try a different approach. The team worked together, brainstorming ideas late into the night. In the end, we found a solution that was both effective and innovative. Thank you all for your hard work and dedication!",
  
  "Yo, last night was wild! We literally stayed up till 3am grinding on this project, but honestly, it paid off. Big shoutout to the squad for keeping the vibes high and the snacks coming. Wouldn't have made it without you all!",
  
  "Summarize the following: The quick brown fox jumps over the lazy dog. Despite several obstacles, the fox remains determined and agile, while the dog is content to observe. What can we learn from their behavior?",
  
  "In accordance with the latest research, the implementation of transformer-based architectures has significantly improved the performance of natural language processing models. Further experimentation is required to optimize hyperparameters and reduce computational costs.",
];

const DEFAULT_EXAMPLE = EXAMPLES[0];

const getOpenAITokenCount = async (text: string) => {
  
  try {
    const res = await fetch("/api/tokenize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to get token count");
    const data = await res.json();
    return data.tokens || 0;
  } catch (error) {
    
    return Math.ceil((text?.length || 0) / 4);
  }
};

const LlmCompressionAnalysis = ({ original, optimized }: { original: string; optimized: string }) => {
  const analysis = analyzeCompression(original, optimized);
  return (
    <Card className="terminal-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm uppercase tracking-wider text-success flex items-center gap-2">
          <span className="text-success">[✓]</span> LLM_Optimized
        </CardTitle>
        <div className="flex flex-col gap-1 text-xs font-mono text-foreground/70 mt-2">
          <span>tokens_saved: <strong className="text-success">{analysis.tokenSavings}</strong></span>
          <span>reduction: <strong className="text-success">{(analysis.efficiency * 100).toFixed(1)}%</strong></span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-foreground/70">
          Removes stopwords and transition words to reduce tokens.
        </div>
      </CardContent>
    </Card>
  );
};

const BaselineAnalysis = ({ original, tokenCount }: { original: string; tokenCount: number }) => (
  <Card className="terminal-card">
    <CardHeader className="pb-3">
      <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <span className="text-muted-foreground">[•]</span> Baseline
      </CardTitle>
      <div className="flex flex-col gap-1 text-xs font-mono text-foreground/70 mt-2">
        <span>tokens: <strong className="text-muted-foreground">{tokenCount}</strong></span>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-sm text-foreground/70">
        Original, uncompressed prompt. Baseline for comparison.
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const [inputText, setInputText] = useState(DEFAULT_EXAMPLE);
  const [selectedModel, setSelectedModel] = useState("gpt-4.1-mini");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [millennialPrompt, setMillennialPrompt] = useState("");
  const [llmPrompt, setLlmPrompt] = useState("");
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [originalUsage, setOriginalUsage] = useState(null);
  const [millennialUsage, setMillennialUsage] = useState(null);
  const [llmUsage, setLlmUsage] = useState(null);
  const [originalResponse, setOriginalResponse] = useState("");
  const [millennialResponse, setMillennialResponse] = useState("");
  const [llmResponse, setLlmResponse] = useState("");
  const [originalResponseError, setOriginalResponseError] = useState("");
  const [millennialResponseError, setMillennialResponseError] = useState("");
  const [llmResponseError, setLlmResponseError] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an expert summarizer. Summarize the user's input in exactly 3 sentences. Output only the summary, starting with 'Summary of user input:'. Be concise and do not add any extra commentary."
  );
  const { toast } = useToast();
  const API_URL = "/api/chat";
  const [llmOptimizedPrompt, setLlmOptimizedPrompt] = useState("");
  const [originalTokenCount, setOriginalTokenCount] = useState(0);
  const [millennialTokenCount, setMillennialTokenCount] = useState(0);
  const [llmOptimizedTokenCount, setLlmOptimizedTokenCount] = useState(0);
  const [originalOutputTokenCount, setOriginalOutputTokenCount] = useState(0);
  const [millennialOutputTokenCount, setMillennialOutputTokenCount] = useState(0);
  const [llmOptimizedOutputTokenCount, setLlmOptimizedOutputTokenCount] = useState(0);
  const [processingStep, setProcessingStep] = useState<"compress" | "tokenize" | "query_openai" | null>(null);

  const handleCompress = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to compress.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setShowResults(true);
    setProcessingStep("compress");
    setOriginalResponseError("");
    setMillennialResponseError("");
    setLlmResponseError("");
    setOriginalUsage(null);
    setMillennialUsage(null);
    setLlmUsage(null);
    
    setOriginalPrompt(inputText);
    
    const millennialResult = compressText(inputText, 2);
    setMillennialPrompt(millennialResult.compressed);
    setCompressionResult(millennialResult);
    
    const llmOpt = llmTokenOptimize(inputText);
    setLlmOptimizedPrompt(llmOpt);
    
    setProcessingStep("tokenize");
    const [originalTokens, millennialTokens, llmOptimizedTokens] = await Promise.all([
      getOpenAITokenCount(inputText),
      getOpenAITokenCount(millennialResult.compressed),
      getOpenAITokenCount(llmOpt)
    ]);
    setOriginalTokenCount(originalTokens);
    setMillennialTokenCount(millennialTokens);
    setLlmOptimizedTokenCount(llmOptimizedTokens);
    
    setProcessingStep("query_openai");
    let originalAIResponse = "";
    let millennialAIResponse = "";
    let llmOptimizedAIResponse = "";
    
    try {
      const originalRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: inputText },
          ],
        }),
      });
      if (originalRes.status === 429) {
        const err = await originalRes.json();
        throw new Error(err.error || "Rate limit exceeded. Please wait and try again.");
      }
      if (!originalRes.ok) {
        let errMsg = "Failed to get original response.";
        if (originalRes.status === 404) errMsg = "API endpoint not found. Please check your backend configuration.";
        if (originalRes.status === 500) errMsg = "Server error. Please check your backend logs.";
        throw new Error(errMsg);
      }
      const originalData = await originalRes.json();
      originalAIResponse = originalData.choices?.[0]?.message?.content || "";
      setOriginalResponse(originalAIResponse);
      setOriginalUsage(originalData.usage || null);
      setOriginalOutputTokenCount(originalData.usage?.completion_tokens || 0);
    } catch (error) {
      setOriginalResponseError((error as Error).message || "Failed to get original response. Please check your API configuration.");
      setOriginalUsage(null);
      setOriginalOutputTokenCount(0);
    }
    
    try {
      const millennialRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: millennialResult.compressed },
          ],
        }),
      });
      if (millennialRes.status === 429) {
        const err = await millennialRes.json();
        throw new Error(err.error || "Rate limit exceeded. Please wait and try again.");
      }
      if (!millennialRes.ok) {
        let errMsg = "Failed to get millennial response.";
        if (millennialRes.status === 404) errMsg = "API endpoint not found. Please check your backend configuration.";
        if (millennialRes.status === 500) errMsg = "Server error. Please check your backend logs.";
        throw new Error(errMsg);
      }
      const millennialData = await millennialRes.json();
      millennialAIResponse = millennialData.choices?.[0]?.message?.content || "";
      setMillennialResponse(millennialAIResponse);
      setMillennialUsage(millennialData.usage || null);
      setMillennialOutputTokenCount(millennialData.usage?.completion_tokens || 0);
    } catch (error) {
      setMillennialResponseError((error as Error).message || "Failed to get millennial response. Please check your API configuration.");
      setMillennialUsage(null);
      setMillennialOutputTokenCount(0);
    }
    
    try {
      const llmOptRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: llmOpt },
          ],
        }),
      });
      if (llmOptRes.status === 429) {
        const err = await llmOptRes.json();
        throw new Error(err.error || "Rate limit exceeded. Please wait and try again.");
      }
      if (!llmOptRes.ok) {
        let errMsg = "Failed to get LLM Optimized response.";
        if (llmOptRes.status === 404) errMsg = "API endpoint not found. Please check your backend configuration.";
        if (llmOptRes.status === 500) errMsg = "Server error. Please check your backend logs.";
        throw new Error(errMsg);
      }
      const llmOptData = await llmOptRes.json();
      llmOptimizedAIResponse = llmOptData.choices?.[0]?.message?.content || "";
      setLlmResponse(llmOptimizedAIResponse);
      setLlmUsage(llmOptData.usage || null);
      setLlmOptimizedOutputTokenCount(llmOptData.usage?.completion_tokens || 0);
    } catch (error) {
      setLlmResponseError((error as Error).message || "Failed to get LLM Optimized response. Please check your API configuration.");
      setLlmUsage(null);
      setLlmOptimizedOutputTokenCount(0);
    }
    setProcessingStep(null);
    setIsLoading(false);
  };

  const handleReset = () => {
    setInputText("");
    setOriginalPrompt("");
    setMillennialPrompt("");
    setLlmPrompt("");
    setOriginalResponse("");
    setMillennialResponse("");
    setLlmResponse("");
    setShowResults(false);
    setCompressionResult(null);
    setOriginalUsage(null);
    setMillennialUsage(null);
    setLlmUsage(null);
    setOriginalResponseError("");
    setMillennialResponseError("");
    setLlmResponseError("");
  };

  const getTokenCount = (text: string) => {
    return Math.ceil((text?.length || 0) / 4);
  };

  return (
    <div className="relative w-full min-h-screen bg-background overflow-hidden">
      <WavyBackground />
      <Header />
      <main className="relative w-full px-4 sm:px-10 py-8 mx-auto z-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-primary uppercase tracking-tight" style={{ textShadow: '0 0 20px hsl(var(--primary) / 0.5)' }}>
            &gt; Shrink Prompts, Save Tokens
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Reduce OpenAI costs with compression algorithms
          </p>

          <Card className="terminal-card border-secondary/50 mt-6 max-w-3xl mx-auto">
            <CardContent className="p-4 text-sm font-mono">
              <div className="flex gap-3 items-start">
                <Info className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-secondary mb-2 uppercase tracking-wider">
                    [ℹ] Comparison Mode Active
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    Test <span className="text-primary font-semibold">3 methods</span> simultaneously:{" "}
                    <span className="text-muted-foreground">[1] Baseline</span>,{" "}
                    <span className="text-warning">[2] Millennial</span>,{" "}
                    <span className="text-success">[3] LLM-Optimized</span>.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-4">
            <TokenizationModal>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-secondary text-secondary hover:bg-secondary/10 hover:border-secondary/80"
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Why over-compression fails
              </Button>
            </TokenizationModal>
          </div>
        </div>
        <Card className="terminal-card p-6 md:p-8 mb-10">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary uppercase tracking-wider">&gt; Input_Text:</label>
                  <Textarea
                    placeholder="$ paste your text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onFocus={() => {
                      if (inputText === DEFAULT_EXAMPLE) setInputText("");
                    }}
                    className="min-h-[200px] resize-none bg-input border-border focus:border-primary/50 focus:ring-primary/50 font-mono"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {EXAMPLES.map((ex, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInputText(ex)}
                        className={
                          "px-3 py-1 rounded border text-xs transition font-mono " +
                          (inputText === ex
                            ? "bg-primary/20 text-primary border-primary"
                            : "bg-background border-border hover:bg-primary/10 hover:border-primary/50 text-foreground/70")
                        }
                      >
                        [ex{idx + 1}]
                      </button>
                    ))}
                  </div>
                  <TokenCounter text={inputText} />
                </div>
              </div>
              <div className="space-y-4">
                <ModelSelector
                  value={selectedModel}
                  onChange={setSelectedModel}
                />
                <div className="p-4 bg-background border border-border rounded">
                  <h4 className="font-medium mb-3 text-primary uppercase text-sm tracking-wider">&gt; Stats:</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between text-foreground/80">
                      <span>tokens_in:</span>
                      <span className="font-medium text-success">{getTokenCount(inputText).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-foreground/80">
                      <span>cost_est:</span>
                      <span className="font-medium text-warning">$0.{Math.ceil(inputText.length / 400).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleCompress}
                disabled={isLoading}
                className={cn(
                  "rounded uppercase tracking-wider font-semibold",
                  inputText.trim() && !isLoading ? "button-amber-glow" : "bg-primary/20 border border-primary/30"
                )}
              >
                {isLoading ? (
                  <ProcessingSteps currentStep={processingStep} />
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Compress
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline" disabled={isLoading} className="rounded border-border hover:border-primary/50 hover:bg-primary/10">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="w-full justify-between mt-4 bg-muted border border-gray-200 text-foreground hover:bg-gray-100 hover:border-gray-300 transition-colors"
                >
                  Advanced Settings
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border rounded-xl bg-background" 
                      defaultValue="0.7"
                      min="0"
                      max="2"
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Tokens</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border rounded-xl bg-background" 
                      defaultValue="150"
                      min="1"
                      max="4000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">System Prompt</label>
                  <Textarea
                    value={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                    className="w-full min-h-[80px] resize-none"
                  />
                  <div className="text-xs text-muted-foreground">
                    This prompt controls how the AI summarizes your input. Use strict instructions for output length and format.
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
        </Card>
        {showResults && (
          <div className="space-y-8">

            <div>
              <SectionHeader
                title=">> COMPRESSION_ANALYSIS"
                subtitle="[token efficiency comparison]"
                showArrows={true}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <BaselineAnalysis original={inputText} tokenCount={originalTokenCount} />

              {compressionResult && !isLoading ? (
                <Card className="terminal-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm uppercase tracking-wider text-warning flex items-center gap-2">
                      <span className="text-warning">[!]</span> Millennial
                    </CardTitle>
                    <div className="flex flex-col gap-1 text-xs font-mono text-foreground/70 mt-2">
                      <span>tokens_saved: <strong className="text-warning">{compressionResult.tokensSaved}</strong></span>
                      <span>reduction: <strong className="text-warning">{compressionResult.compressionRatio.toFixed(1)}%</strong></span>
                      <span>patterns: <strong className="text-warning">{compressionResult.patterns.length}</strong></span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <div className="flex flex-wrap gap-2">
                        {compressionResult.patterns.map((pattern, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : <div />}

                {llmOptimizedPrompt && !isLoading ? (
                  <LlmCompressionAnalysis original={inputText} optimized={llmOptimizedPrompt} />
                ) : <div />}
              </div>
            </div>

            <div>
              <SectionHeader
                title=">> COMPRESSED_PROMPTS"
                subtitle="[original vs compressed versions]"
                showArrows={true}
              />
              <div className="grid lg:grid-cols-3 gap-6">
              <ResultCard
                title="Original Prompt"
                content={originalPrompt}
                isLoading={isLoading}
                type="prompt"
                tokenCount={originalTokenCount}
                isOptimal={originalTokenCount > 0 && originalTokenCount <= millennialTokenCount && originalTokenCount <= llmOptimizedTokenCount}
                badge={{ number: 1, color: "text-muted-foreground" }}
              />
              <ResultCard
                title="Millennial Compression"
                content={millennialPrompt}
                isLoading={isLoading}
                type="prompt"
                tokenCount={millennialTokenCount}
                isOptimal={millennialTokenCount > 0 && millennialTokenCount < originalTokenCount && millennialTokenCount <= llmOptimizedTokenCount}
                badge={{ number: 2, color: "text-warning" }}
              />
              <ResultCard
                title="LLM Optimized Compression"
                content={llmOptimizedPrompt}
                isLoading={isLoading}
                type="prompt"
                tokenCount={llmOptimizedTokenCount}
                isOptimal={llmOptimizedTokenCount > 0 && llmOptimizedTokenCount < originalTokenCount && llmOptimizedTokenCount < millennialTokenCount}
                badge={{ number: 3, color: "text-success" }}
              />
              </div>
            </div>

            <SavingsBanner
              originalTokens={originalTokenCount}
              millennialTokens={millennialTokenCount}
              llmOptimizedTokens={llmOptimizedTokenCount}
              show={!isLoading && Boolean(originalPrompt && llmOptimizedPrompt)}
              isActualOpenAIStats={true}
            />

            <div>
              <SectionHeader
                title=">> AI_RESPONSES"
                subtitle="[quality comparison]"
                showArrows={true}
              />
              <div className="grid lg:grid-cols-3 gap-6">
              <ResultCard
                title="AI Response (Original)"
                content={originalResponseError ? originalResponseError : originalResponse}
                isLoading={isLoading && !originalResponseError && !originalResponse}
                type="response"
                tokenCount={originalOutputTokenCount}
              />
              <ResultCard
                title="AI Response (Millennial)"
                content={millennialResponseError ? millennialResponseError : millennialResponse}
                isLoading={isLoading && !millennialResponseError && !millennialResponse}
                type="response"
                tokenCount={millennialOutputTokenCount}
              />
              <ResultCard
                title="AI Response (LLM Optimized)"
                content={llmResponseError ? llmResponseError : llmResponse}
                isLoading={isLoading && !llmResponseError && !llmResponse}
                type="response"
                tokenCount={llmOptimizedOutputTokenCount}
              />
            </div>
          </div>

          <div className="terminal-card border-primary/30 rounded-lg px-6 py-4 flex items-center justify-center gap-3 mt-6">
            <span className="text-sm font-mono text-foreground/70">
              Compare the outputs yourself to see if the compression made an effect on AI's understanding of your original prompt
            </span>
          </div>
        </div>
        )}
        <footer className="mt-16 py-8 border-t text-center text-sm text-muted-foreground">
          <p>
            TokenWise demonstrates how different compression techniques affect LLM token usage.{" "}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="text-primary p-0 h-auto align-baseline">Learn more</Button>
              </DialogTrigger>
              <DialogContent className="max-w-xs text-center">
                <DialogHeader>
                  <DialogTitle>Just kidding</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-lg">😜 </div>
              </DialogContent>
            </Dialog>
          </p>
        </footer>
      </main>
    </div>
  );
};
export default Index;
