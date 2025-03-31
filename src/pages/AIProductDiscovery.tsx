
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Sparkles,
  Lightbulb,
  Target,
  ShoppingCart,
  Zap,
  TrendingUp,
  Share2,
  Loader2
} from "lucide-react";
import { AIProductPromptGenerator } from "@/components/ai-discovery/AIProductPromptGenerator";
import { PersonalizedProductFeed } from "@/components/ai-discovery/PersonalizedProductFeed";
import { ProductInsightCard } from "@/components/ai-discovery/ProductInsightCard";

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
  similarityScore?: number;
}

export default function AIProductDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState("personalized");
  const { toast } = useToast();

  // Function to fetch personalized recommendations
  const fetchPersonalizedRecommendations = async () => {
    setLoading(true);
    try {
      const { data: recommendations, error } = await supabase.functions.invoke('personalized-recommendations', {
        body: { search: searchQuery }
      });

      if (error) throw error;

      setGeneratedProducts(recommendations.recommendations || []);
      
      toast({
        title: recommendations.personalized 
          ? "Personalized recommendations loaded" 
          : "Trending products loaded",
        description: recommendations.message,
      });
    } catch (error) {
      console.error("Error fetching personalized recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to load personalized recommendations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Import a product to your store
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

  // Initial load of recommendations
  useEffect(() => {
    fetchPersonalizedRecommendations();
  }, []);

  // Handle search query submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPersonalizedRecommendations();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">AI Product Discovery</h1>
          <p className="text-muted-foreground text-lg">
            Use AI to discover profitable dropshipping products tailored to your preferences
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Find Products
              </>
            )}
          </Button>
        </form>

        <Tabs defaultValue="personalized" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="personalized">
              <Target className="mr-2 h-4 w-4" />
              Personalized For You
            </TabsTrigger>
            <TabsTrigger value="ai-generator">
              <Lightbulb className="mr-2 h-4 w-4" />
              AI Product Ideas
            </TabsTrigger>
            <TabsTrigger value="market-insights">
              <TrendingUp className="mr-2 h-4 w-4" />
              Market Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personalized" className="space-y-4">
            <PersonalizedProductFeed 
              products={generatedProducts} 
              loading={loading} 
              onImport={handleImportProduct}
            />
          </TabsContent>
          
          <TabsContent value="ai-generator" className="space-y-4">
            <AIProductPromptGenerator />
          </TabsContent>
          
          <TabsContent value="market-insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Insights & Trends</CardTitle>
                <CardDescription>
                  AI-powered insights about current market trends and profitable niches
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ProductInsightCard 
                    title="Eco-Friendly Products"
                    description="Sustainability-focused products are seeing 32% YoY growth"
                    trend="upward"
                    confidence={85}
                    tags={["sustainability", "eco-friendly", "green"]}
                  />
                  
                  <ProductInsightCard 
                    title="Home Fitness Equipment"
                    description="Post-pandemic interest remains strong with 18% growth"
                    trend="upward"
                    confidence={78}
                    tags={["fitness", "home workout", "exercise"]}
                  />
                  
                  <ProductInsightCard 
                    title="Smart Home Devices"
                    description="Integration products see continued adoption, 25% growth"
                    trend="upward"
                    confidence={82}
                    tags={["tech", "smart home", "gadgets"]}
                  />
                  
                  <ProductInsightCard 
                    title="Fast Fashion"
                    description="Consumer interest decreasing as sustainability rises"
                    trend="downward"
                    confidence={67}
                    tags={["fashion", "clothing", "apparel"]}
                  />
                  
                  <ProductInsightCard 
                    title="Portable Electronics"
                    description="Travel-friendly tech on the rise with remote work trends"
                    trend="upward"
                    confidence={75}
                    tags={["electronics", "travel", "portable"]}
                  />
                  
                  <ProductInsightCard 
                    title="Pet Accessories"
                    description="Premium pet products growing at 22% annually"
                    trend="upward"
                    confidence={88}
                    tags={["pets", "animals", "accessories"]}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
