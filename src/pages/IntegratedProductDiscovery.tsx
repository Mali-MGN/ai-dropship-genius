
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp,
  Loader2,
  ArrowUpDown,
  Star,
  DollarSign,
  Tag,
  SlidersHorizontal,
  Download,
  CalendarClock
} from "lucide-react";

import { AIProductPromptGenerator } from "@/components/ai-discovery/AIProductPromptGenerator";
import { PersonalizedProductFeed } from "@/components/ai-discovery/PersonalizedProductFeed";
import { ProductInsightCard } from "@/components/ai-discovery/ProductInsightCard";
import { RetailerGrid } from "@/components/product-discovery/RetailerGrid";
import { IntegrationStatus } from "@/components/product-discovery/IntegrationStatus";
import { ProductFilters } from "@/components/product-discovery/ProductFilters";
import { ProductGrid } from "@/components/product-discovery/ProductGrid";
import { AIRecommendedProducts } from "@/components/product-discovery/AIRecommendedProducts";
import { useProductDiscovery } from "@/hooks/useProductDiscovery";
import { retailers } from "@/data/retailers";

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

export default function IntegratedProductDiscovery() {
  const [mainTab, setMainTab] = useState("personalized");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  // Product Discovery hook
  const {
    filteredProducts,
    aiRecommendedProducts,
    topSellingProducts,
    projectedTrends,
    loading: pdLoading,
    aiLoading,
    searchQuery: pdSearchQuery,
    currentTab,
    sortOrder,
    importing,
    exporting,
    selectedCategory,
    categories,
    selectedRetailer,
    exportFormat,
    setSelectedRetailer,
    setExportFormat,
    handleTabChange,
    handleSearch: pdHandleSearch,
    handleSort,
    handleCategoryChange,
    handleImport,
    handleExport
  } = useProductDiscovery();

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
  const handleAIImportProduct = async (productId: string) => {
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

  // Handle search query submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPersonalizedRecommendations();
  };

  // Initial load of recommendations
  useEffect(() => {
    fetchPersonalizedRecommendations();
  }, []);

  const hasSelectedRetailer = !!selectedRetailer;

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">AI Product Discovery</h1>
          <p className="text-muted-foreground text-lg">
            Discover profitable products and market insights with AI - Updated {todayDate}
          </p>
        </div>

        <Tabs defaultValue="personalized" value={mainTab} onValueChange={setMainTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="personalized">
              <Target className="mr-2 h-4 w-4" />
              AI Recommendations
            </TabsTrigger>
            <TabsTrigger value="market">
              <Lightbulb className="mr-2 h-4 w-4" />
              Market Insights
            </TabsTrigger>
            <TabsTrigger value="discovery">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Product Discovery
            </TabsTrigger>
          </TabsList>
          
          {/* AI Personalized Tab Content */}
          <TabsContent value="personalized" className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ProductInsightCard 
                title="Eco-Friendly Products"
                description="Sustainability-focused products are seeing 32% YoY growth"
                trend="upward"
                confidence={85}
                tags={["sustainability", "eco-friendly", "green"]}
              />
              <ProductInsightCard 
                title="Smart Home Devices"
                description="Integration products see continued adoption, 25% growth"
                trend="upward"
                confidence={82}
                tags={["tech", "smart home", "gadgets"]}
              />
              <ProductInsightCard 
                title="Premium Pet Products"
                description="Premium pet products growing at 22% annually"
                trend="upward"
                confidence={88}
                tags={["pets", "animals", "accessories"]}
              />
            </div>
            
            <PersonalizedProductFeed 
              products={generatedProducts} 
              loading={loading} 
              onImport={handleAIImportProduct}
            />
            
            <AIProductPromptGenerator />
          </TabsContent>
          
          {/* Market Insights Tab Content */}
          <TabsContent value="market" className="space-y-4">
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
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projected Trends</CardTitle>
                    <CardDescription>
                      Product categories expected to grow in popularity in the coming months
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                    <CalendarClock className="h-3.5 w-3.5 mr-1 text-blue-500" />
                    Future Insights
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {projectedTrends.map((trend, index) => (
                    <Card key={index} className="border-l-4" style={{ borderLeftColor: trend.color }}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{trend.category}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{trend.description}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className={`h-4 w-4 mr-1 text-${trend.color}`} />
                          <span className={`text-sm font-medium text-${trend.color}`}>
                            {trend.growthRate}% projected growth
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Product Discovery Tab Content */}
          <TabsContent value="discovery" className="space-y-4">
            {!hasSelectedRetailer && (
              <Card className="bg-amber-50 border-amber-200 mb-4">
                <CardContent className="pt-6">
                  <div className="flex gap-2">
                    <div className="text-amber-600">
                      <SlidersHorizontal className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-amber-800">Select a retailer</h3>
                      <p className="text-amber-700">
                        Please select a retailer below to start discovering products.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <RetailerGrid 
              retailers={retailers}
              selectedRetailer={selectedRetailer}
              onSelectRetailer={setSelectedRetailer}
            />
            
            {hasSelectedRetailer && (
              <IntegrationStatus />
            )}
            
            {hasSelectedRetailer && (
              <>
                <div className="grid grid-cols-1 gap-6">
                  <AIRecommendedProducts
                    title="Today's Trending Products"
                    description="Hot products trending right now based on market data and customer behavior"
                    products={aiRecommendedProducts}
                    loading={aiLoading}
                    onImport={handleImport}
                    onExport={handleExport}
                    importing={importing}
                    exporting={exporting}
                    selectedRetailer={selectedRetailer}
                    retailers={retailers}
                  />
                  
                  <AIRecommendedProducts
                    title="Top Selling Products"
                    description="Best performing products based on sales and reviews"
                    products={topSellingProducts}
                    loading={pdLoading}
                    onImport={handleImport}
                    onExport={handleExport}
                    importing={importing}
                    exporting={exporting}
                    selectedRetailer={selectedRetailer}
                    retailers={retailers}
                  />
                </div>
              
                <ProductFilters 
                  searchQuery={pdSearchQuery}
                  onSearchChange={pdHandleSearch}
                  onSortChange={handleSort}
                  onCategoryChange={handleCategoryChange}
                  sortOrder={sortOrder}
                  exportFormat={exportFormat}
                  selectedCategory={selectedCategory}
                  categories={categories}
                  onExportFormatChange={setExportFormat}
                />
                
                <Tabs defaultValue="trending" value={currentTab} onValueChange={handleTabChange}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="trending">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Trending Products
                    </TabsTrigger>
                    <TabsTrigger value="profit">
                      <DollarSign className="mr-2 h-4 w-4" />
                      High Profit Margin
                    </TabsTrigger>
                    <TabsTrigger value="competitors">
                      <BarChart4 className="mr-2 h-4 w-4" />
                      Competitor Insights
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="trending" className="space-y-4">
                    <ProductGrid
                      title="Trending Products"
                      description="Hot selling products that are trending right now. Updated daily."
                      products={filteredProducts}
                      loading={pdLoading}
                      onImport={handleImport}
                      onExport={handleExport}
                      importing={importing}
                      exporting={exporting}
                      selectedRetailer={selectedRetailer}
                      retailers={retailers}
                    />
                  </TabsContent>
                  
                  <TabsContent value="profit" className="space-y-4">
                    <ProductGrid
                      title="High Profit Margin Products"
                      description="Products with the highest profit potential for your store."
                      products={filteredProducts}
                      loading={pdLoading}
                      onImport={handleImport}
                      onExport={handleExport}
                      importing={importing}
                      exporting={exporting}
                      selectedRetailer={selectedRetailer}
                      retailers={retailers}
                    />
                  </TabsContent>
                  
                  <TabsContent value="competitors" className="space-y-4">
                    <ProductGrid
                      title="Competitor Insights"
                      description="Products that your competitors are selling successfully."
                      products={filteredProducts}
                      loading={pdLoading}
                      onImport={handleImport}
                      onExport={handleExport}
                      importing={importing}
                      exporting={exporting}
                      selectedRetailer={selectedRetailer}
                      retailers={retailers}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
