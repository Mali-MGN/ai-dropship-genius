
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Lightbulb, 
  Sparkles, 
  Loader2,
  Search,
  ArrowRight
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
  comparePrice?: number;
  source: string;
  rating?: number;
  trending?: boolean;
  profit?: number;
  category?: string;
}

export function AIProductPromptGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const promptExamples = [
    "Products for tech-savvy hikers and outdoor enthusiasts",
    "Eco-friendly kitchen gadgets under $30",
    "Trending home office accessories for remote workers",
    "Unique pet toys for small dogs that solve common problems",
    "Space-saving organization products for small apartments"
  ];

  const handleGenerateIdeas = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a product idea prompt",
        variant: "destructive",
      });
      return;
    }

    setGeneratingIdeas(true);
    setGeneratedProducts([]);

    try {
      // Call the web-scraper function with the prompt as search query
      const { data, error } = await supabase.functions.invoke('web-scraper', {
        body: { 
          source: "AI Generated",
          searchQuery: prompt,
          limit: 6
        }
      });

      if (error) throw error;

      if (data.products && data.products.length > 0) {
        // Transform the product data to match our interface
        const formattedProducts = data.products.map((product: any) => ({
          id: product.id || Math.random().toString(36).substring(2),
          name: product.name,
          image: product.image_url,
          price: product.price,
          comparePrice: product.compare_price,
          source: product.source,
          rating: product.rating,
          trending: product.is_trending,
          profit: product.profit_margin,
          category: product.category
        }));

        setGeneratedProducts(formattedProducts);
        
        toast({
          title: "Product ideas generated",
          description: `Generated ${formattedProducts.length} product ideas based on your prompt`,
        });
      } else {
        toast({
          title: "No products found",
          description: "Try a different prompt or add more details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating product ideas:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate product ideas. Try again later.",
        variant: "destructive",
      });
    } finally {
      setGeneratingIdeas(false);
    }
  };

  // Handle importing a product to the store
  const handleImportProduct = async (productId: string) => {
    try {
      const product = generatedProducts.find(p => p.id === productId);
      if (!product) return false;
      
      // Simulate adding to user's store
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Product Imported",
        description: `${product.name} has been added to your store.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error importing product:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the product.",
        variant: "destructive",
      });
      return false;
    }
  };

  const usePromptExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          AI Product Idea Generator
        </CardTitle>
        <CardDescription>
          Describe the types of products you're looking for and our AI will generate ideas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Describe the product niche or characteristics you're interested in..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center">Try:</span>
            {promptExamples.map((example, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="cursor-pointer hover:bg-accent"
                onClick={() => usePromptExample(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
          
          <Button 
            onClick={handleGenerateIdeas} 
            className="w-full"
            disabled={generatingIdeas || !prompt.trim()}
          >
            {generatingIdeas ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating ideas...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Product Ideas
              </>
            )}
          </Button>
          
          {generatedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Generated Product Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onImport={handleImportProduct}
                    showImportButton={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
