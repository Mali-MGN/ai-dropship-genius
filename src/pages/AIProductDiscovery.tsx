
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  ShoppingCart, 
  Zap, 
  Sparkles,
  Archive,
  Users,
  RefreshCw,
  ShoppingBag,
  Star
} from "lucide-react";

// Define the product type
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
  description?: string;
  tags?: string[];
  trendingScore?: number;
}

const AIProductDiscovery = () => {
  const [selectedTab, setSelectedTab] = useState("ai-recommended");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [personalizedProducts, setPersonalizedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [competitorProducts, setCompetitorProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch personalized recommendations using our edge function
      const { data: personalizedData, error: personalizedError } = await supabase.functions.invoke('personalized-recommendations');
      
      if (personalizedError) throw personalizedError;
      
      if (personalizedData?.recommendations) {
        setPersonalizedProducts(personalizedData.recommendations);
      }
      
      // Fetch trending products from the database
      const { data: trendingData, error: trendingError } = await supabase
        .from('scraped_products')
        .select('*')
        .eq('is_trending', true)
        .order('trending_score', { ascending: false })
        .limit(10);
      
      if (trendingError) throw trendingError;
      
      if (trendingData) {
        setTrendingProducts(trendingData);
      }
      
      // For simplicity, let's use the same products as competitor products
      setCompetitorProducts(trendingData?.slice(0, 5) || []);
      
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportProduct = (id: string) => {
    toast({
      title: "Product Imported",
      description: "The product has been added to your store.",
    });
  };

  const handleBulkImport = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to import.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `${selectedProducts.length} Products Imported`,
      description: "The selected products have been added to your store.",
    });
    setSelectedProducts([]);
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(productId => productId !== id) 
        : [...prev, id]
    );
  };

  const handleScrapeProducts = async () => {
    setIsLoading(true);
    try {
      const sources = ['AliExpress', 'Amazon', 'eBay', 'Etsy'];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      
      const { data, error } = await supabase.functions.invoke('scrape-products', {
        body: {
          source: randomSource,
          limit: 10
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Products Scraped",
        description: data.message || "Successfully scraped new products.",
      });
      
      // Reload products to show the newly scraped ones
      loadProducts();
    } catch (error) {
      console.error('Error scraping products:', error);
      toast({
        title: "Error",
        description: "Failed to scrape products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ["Electronics", "Fashion", "Home Decor", "Beauty", "Sports", "Toys"];
  const sources = ["AliExpress", "Amazon", "eBay", "Etsy"];

  // Get the appropriate products based on the selected tab
  const getActiveProducts = () => {
    switch (selectedTab) {
      case "ai-recommended":
        return personalizedProducts;
      case "trending":
        return trendingProducts;
      case "competitors":
        return competitorProducts;
      default:
        return personalizedProducts;
    }
  };

  const activeProducts = getActiveProducts();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">AI Product Discovery</h1>
            <p className="text-muted-foreground text-lg">Find trending products to sell in your store with AI assistance</p>
          </div>
          <Button 
            onClick={handleScrapeProducts} 
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            {isLoading ? "Scraping..." : "Scrape New Products"}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                {sources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Advanced Filters Card */}
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-6">
                  <Slider 
                    defaultValue={[0, 1000]} 
                    max={1000} 
                    step={10} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex items-center justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Category Checkboxes */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.slice(0, 4).map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories(prev => [...prev, category]);
                          } else {
                            setSelectedCategories(prev => prev.filter(c => c !== category));
                          }
                        }}
                      />
                      <label 
                        htmlFor={`category-${category}`}
                        className="text-sm"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Source Checkboxes */}
              <div>
                <h3 className="font-medium mb-3">Sources</h3>
                <div className="space-y-2">
                  {sources.map(source => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`source-${source}`}
                        checked={selectedSources.includes(source)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSources(prev => [...prev, source]);
                          } else {
                            setSelectedSources(prev => prev.filter(s => s !== source));
                          }
                        }}
                      />
                      <label 
                        htmlFor={`source-${source}`}
                        className="text-sm"
                      >
                        {source}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Tabs */}
        <Tabs defaultValue="ai-recommended" onValueChange={setSelectedTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="ai-recommended" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Recommended
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="competitors" className="gap-2">
                <Users className="h-4 w-4" />
                Competitor Insights
              </TabsTrigger>
            </TabsList>
            {selectedProducts.length > 0 && (
              <Button onClick={handleBulkImport} className="gap-2">
                <Archive className="h-4 w-4" />
                Import Selected ({selectedProducts.length})
              </Button>
            )}
          </div>

          {/* Content for all tabs */}
          <TabsContent value="ai-recommended" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {isLoading ? (
                Array(8).fill(0).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))
              ) : activeProducts.length > 0 ? (
                activeProducts.map(product => (
                  <div key={product.id} className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </div>
                    {selectedTab === "ai-recommended" && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-primary/80 text-primary-foreground">
                          <Sparkles className="h-3 w-3 mr-1" /> AI Pick
                        </Badge>
                      </div>
                    )}
                    <ProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        comparePrice: product.comparePrice,
                        source: product.source,
                        rating: product.rating,
                        trending: product.trending,
                        profit: product.profit,
                        category: product.category
                      }}
                      onImport={() => handleImportProduct(product.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-muted-foreground">No products found. Try adjusting your filters or scrape new products.</p>
                  <Button 
                    variant="outline" 
                    onClick={handleScrapeProducts} 
                    className="mt-4"
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Scrape New Products
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-0">
            {/* This will show the same grid but with trending products */}
          </TabsContent>

          <TabsContent value="competitors" className="mt-0">
            {/* This will show the same grid but with competitor products */}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AIProductDiscovery;
