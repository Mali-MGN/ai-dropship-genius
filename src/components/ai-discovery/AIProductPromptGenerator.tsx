
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  RotateCw, 
  Check, 
  Clipboard,
  Lightbulb,
  Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function AIProductPromptGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Example product idea generators
      const productIdeas = [
        "Sustainable bamboo utensil set with travel case for eco-conscious consumers.",
        "Smart yoga mat with posture detection and integrated fitness tracking app.",
        "Portable UV water purifier bottle for travelers and outdoor enthusiasts.",
        "Collapsible food storage containers made from silicone for space-saving kitchen storage.",
        "Solar-powered portable charger with multiple device compatibility.",
        "Self-cleaning water bottle with UV sterilization technology.",
        "Noise-cancelling sleep headphones built into a comfortable eye mask.",
        "Plant-based, biodegradable phone case with embedded wildflower seeds.",
        "Smart indoor garden system with automated watering and light cycles.",
        "Multifunctional desk organizer with wireless charging capabilities."
      ];
      
      // Pick a random product idea or use the prompt to generate something more specific
      const generatedIdea = prompt.trim() 
        ? `${prompt} - Consider creating a ${productIdeas[Math.floor(Math.random() * productIdeas.length)].toLowerCase()}`
        : productIdeas[Math.floor(Math.random() * productIdeas.length)];
        
      setGeneratedPrompt(generatedIdea);
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your product idea.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Product idea copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPrompt("");
    setGeneratedPrompt("");
  };

  const promptExamples = [
    "eco-friendly kitchen products", 
    "tech gadgets for students", 
    "travel accessories for minimalists",
    "fitness equipment for small spaces"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Product Idea Generator</CardTitle>
        <CardDescription>
          Generate creative product ideas for your dropshipping store using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="prompt" className="text-sm font-medium block mb-2">
            Your product niche or idea (optional)
          </label>
          <Textarea
            id="prompt"
            placeholder="e.g., eco-friendly products for kitchen, tech gadgets for travel..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground pt-1">Examples:</span>
          {promptExamples.map((example, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-secondary"
              onClick={() => setPrompt(example)}
            >
              {example}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Product Idea
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={loading || (!prompt && !generatedPrompt)}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        
        {generatedPrompt && (
          <div className="mt-4 bg-muted p-4 rounded-md relative">
            <div className="absolute -top-3 left-3 bg-primary text-primary-foreground text-xs py-0.5 px-2 rounded-full">
              <Lightbulb className="h-3.5 w-3.5 inline-block mr-1" />
              AI Generated Idea
            </div>
            <p className="text-sm mt-2 mb-4">{generatedPrompt}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
