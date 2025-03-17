
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  Sparkles, 
  Loader2,
  Search,
  ArrowRight,
  TrendingUp,
  Zap,
  Leaf,
  Radio,
  Gift,
  Smartphone,
  PenTool
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
  const [currentCategory, setCurrentCategory] = useState("market-trends");
  const { toast } = useToast();

  const promptExamples = {
    "market-trends": [
      "Products trending among tech-savvy millennials in 2023",
      "Eco-friendly kitchen gadgets with high growth potential",
      "Health and wellness products gaining popularity post-pandemic",
      "Emerging trends in home office equipment for remote workers",
      "Products with growing demand in the sustainable fashion market"
    ],
    "innovation": [
      "Smart home devices that solve common household problems",
      "AI-powered gadgets for productivity enhancement",
      "Wearable technology with unique value propositions",
      "Products combining sustainability with cutting-edge technology",
      "Innovative solutions for urban apartment living"
    ],
    "sustainability": [
      "Zero-waste alternatives to common household products",
      "Eco-friendly packaging solutions for e-commerce businesses",
      "Sustainable fashion accessories made from recycled materials",
      "Energy-efficient gadgets for environmentally conscious consumers",
      "Products that help reduce carbon footprint in daily life"
    ],
    "personalization": [
      "Customizable products with high market demand",
      "Personalized gift items with good profit margins",
      "Products that can be tailored to customer preferences",
      "Subscription box ideas with personalization options",
      "Custom home decor items trending on social media"
    ],
    "digital": [
      "Digital products with passive income potential",
      "Software tools for small business owners",
      "Educational content packages with market demand",
      "Digital services that can be automated with AI",
      "Downloadable resources for specific professional niches"
    ]
  };

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
      // Enhance the prompt with category context
      let enhancedPrompt = prompt;
      if (currentCategory === "market-trends") {
        enhancedPrompt = `Analyze current market trends and find products related to: ${prompt}`;
      } else if (currentCategory === "innovation") {
        enhancedPrompt = `Find innovative and smart product ideas related to: ${prompt}`;
      } else if (currentCategory === "sustainability") {
        enhancedPrompt = `Find eco-friendly and sustainable product ideas related to: ${prompt}`;
      } else if (currentCategory === "personalization") {
        enhancedPrompt = `Find customizable and personalized product ideas related to: ${prompt}`;
      } else if (currentCategory === "digital") {
        enhancedPrompt = `Find digital product and software ideas related to: ${prompt}`;
      }

      // Call the web-scraper function with the enhanced prompt as search query
      const { data, error } = await supabase.functions.invoke('web-scraper', {
        body: { 
          source: "AI Generated",
          searchQuery: enhancedPrompt,
          limit: 6,
          category: currentCategory
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

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "market-trends": return <TrendingUp className="h-4 w-4" />;
      case "innovation": return <Zap className="h-4 w-4" />;
      case "sustainability": return <Leaf className="h-4 w-4" />;
      case "personalization": return <PenTool className="h-4 w-4" />;
      case "digital": return <Smartphone className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch(category) {
      case "market-trends": return "Market Research & Trends";
      case "innovation": return "Innovative Smart Products";
      case "sustainability": return "Eco-Friendly Products";
      case "personalization": return "Customizable Products";
      case "digital": return "Digital Products & Services";
      default: return "Product Ideas";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          AI Product Idea Generator
        </CardTitle>
        <CardDescription>
          Generate innovative product ideas with AI based on market trends, customer preferences, and business goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs value={currentCategory} onValueChange={setCurrentCategory} className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="market-trends" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Market Trends</span>
              </TabsTrigger>
              <TabsTrigger value="innovation" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Smart Products</span>
              </TabsTrigger>
              <TabsTrigger value="sustainability" className="flex items-center gap-1">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Eco-Friendly</span>
              </TabsTrigger>
              <TabsTrigger value="personalization" className="flex items-center gap-1">
                <PenTool className="h-4 w-4" />
                <span className="hidden sm:inline">Customizable</span>
              </TabsTrigger>
              <TabsTrigger value="digital" className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Digital</span>
              </TabsTrigger>
            </TabsList>

            {Object.keys(promptExamples).map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {getCategoryTitle(category)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category === "market-trends" && "Discover products with high market demand based on current trends and customer preferences."}
                    {category === "innovation" && "Generate ideas for innovative smart products that leverage AI and IoT technologies."}
                    {category === "sustainability" && "Find eco-friendly product ideas that appeal to environmentally conscious consumers."}
                    {category === "personalization" && "Explore customizable products that can be tailored to individual customer preferences."}
                    {category === "digital" && "Discover digital products and services with scalable business potential."}
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
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
            {promptExamples[currentCategory as keyof typeof promptExamples].map((example, i) => (
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
                {getCategoryIcon(currentCategory)}
                <span className="ml-2">Generate {getCategoryTitle(currentCategory)}</span>
              </>
            )}
          </Button>
          
          {generatedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Generated Product Ideas
              </h3>
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
