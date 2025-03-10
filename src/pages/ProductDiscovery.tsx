
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  ShoppingCart, 
  Zap, 
  BarChart, 
  Archive,
  Users,
  ShoppingBag,
  Star,
  Eye,
  Import,
  RefreshCcw,
  Loader
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
  image_url?: string;
  is_trending?: boolean;
  compare_price?: number;
  review_count?: number;
  product_url?: string;
  competitors?: number;
}

const ProductDiscovery = () => {
  const [selectedTab, setSelectedTab] = useState("trending");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [competitorProducts, setCompetitorProducts] = useState<Product[]>([]);
  const [highProfitProducts, setHighProfitProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const categories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Toys & Games", "Sports & Outdoors", "Health & Personal Care"];
  const sources = ["AliExpress", "Amazon", "eBay", "Etsy", "Shopify"];
  
  useEffect(() => {
    // Load initial products
    fetchProducts();
    
    // Set up real-time subscription for new scraped products
    const productsChannel = supabase
      .channel('scraped-products-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'scraped_products'
      }, (payload) => {
        console.log('New product added:', payload);
        if (payload.new) {
          // Add the new product to the appropriate lists
          const newProduct = formatProduct(payload.new);
          
          if (newProduct.is_trending) {
            setTrendingProducts(prev => [newProduct, ...prev].slice(0, 20));
          }
          
          if (newProduct.profit && newProduct.profit > 15) {
            setHighProfitProducts(prev => [newProduct, ...prev.filter(p => p.id !== newProduct.id)].sort((a, b) => (b.profit || 0) - (a.profit || 0)).slice(0, 20));
          }
          
          if (newProduct.competitors && newProduct.competitors > 5) {
            setCompetitorProducts(prev => [newProduct, ...prev.filter(p => p.id !== newProduct.id)].slice(0, 20));
          }
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch scraped products from the database
      const { data: scrapedProducts, error } = await supabase
        .from('scraped_products')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      if (scrapedProducts && scrapedProducts.length > 0) {
        const formattedProducts = scrapedProducts.map(formatProduct);
        
        // Filter trending products
        const trending = formattedProducts.filter(p => p.is_trending).slice(0, 20);
        setTrendingProducts(trending);
        
        // Filter high profit products
        const highProfit = [...formattedProducts]
          .sort((a, b) => (b.profit || 0) - (a.profit || 0))
          .slice(0, 20);
        setHighProfitProducts(highProfit);
        
        // Filter competitor products
        const competitor = formattedProducts.filter(p => p.competitors && p.competitors > 5).slice(0, 20);
        setCompetitorProducts(competitor);
      } else {
        // If no products in database, generate initial products
        await fetchProductsFromWeb();
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error fetching products",
        description: "Failed to load products from the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatProduct = (product: any): Product => {
    return {
      id: product.id,
      name: product.name,
      image: product.image_url,
      price: product.price,
      comparePrice: product.compare_price,
      source: product.source,
      rating: product.rating,
      trending: product.is_trending,
      profit: product.profit_margin,
      category: product.category,
      image_url: product.image_url,
      is_trending: product.is_trending,
      compare_price: product.compare_price,
      review_count: product.review_count,
      product_url: product.product_url,
      competitors: product.competitors
    };
  };

  const fetchProductsFromWeb = async (source?: string, category?: string) => {
    setIsFetching(true);
    try {
      // Call the web-scraper edge function
      const { data, error } = await supabase.functions.invoke('web-scraper', {
        body: { 
          source: source || sources[Math.floor(Math.random() * sources.length)],
          category: category || (selectedCategories.length > 0 ? selectedCategories[0] : undefined),
          searchQuery: searchQuery || undefined,
          limit: 20
        }
      });
      
      if (error) throw error;
      
      if (data && data.success) {
        toast({
          title: "Products Scraped",
          description: `Successfully scraped ${data.products.length} products`,
        });
        
        // Products will be automatically updated via the subscription
      } else {
        throw new Error('Failed to fetch products from web');
      }
    } catch (error) {
      console.error('Error fetching products from web:', error);
      toast({
        title: "Error Scraping Products",
        description: "Failed to scrape products from the web.",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleImportProduct = (id: string) => {
    toast({
      title: "Product Imported",
      description: "The product has been added to your store.",
    });
    return true;
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

  const refreshProducts = async () => {
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    await fetchProductsFromWeb(randomSource, randomCategory);
  };

  const getFilteredProducts = (products: Product[]) => {
    let filtered = [...products];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        (product.category && product.category.toLowerCase().includes(query))
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        product.category && selectedCategories.includes(product.category)
      );
    }
    
    // Filter by selected sources
    if (selectedSources.length > 0) {
      filtered = filtered.filter(product => 
        selectedSources.includes(product.source)
      );
    }
    
    return filtered;
  };

  const filteredTrending = getFilteredProducts(trendingProducts);
  const filteredHighProfit = getFilteredProducts(highProfitProducts);
  const filteredCompetitor = getFilteredProducts(competitorProducts);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Product Discovery</h1>
            <p className="text-muted-foreground text-lg">Find trending products to sell in your store</p>
          </div>
          <Button 
            onClick={refreshProducts} 
            className="gap-2"
            disabled={isFetching}
          >
            {isFetching ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            {isFetching ? "Fetching..." : "Refresh Products"}
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
            <Select
              onValueChange={(value) => {
                setSelectedCategories(value ? [value] : []);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                setSelectedSources(value ? [value] : []);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sources</SelectItem>
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
                    defaultValue={[0, 100]} 
                    max={100} 
                    step={1} 
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
        <Tabs defaultValue="trending" onValueChange={setSelectedTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending Products
              </TabsTrigger>
              <TabsTrigger value="profit" className="gap-2">
                <Zap className="h-4 w-4" />
                High Profit Margin
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

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader className="h-8 w-8 animate-spin mb-4 text-primary" />
              <p className="text-lg text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <>
              {/* Trending Products Tab */}
              <TabsContent value="trending" className="mt-0">
                {filteredTrending.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-lg text-muted-foreground mb-4">No trending products match your filters</p>
                    <Button onClick={refreshProducts} variant="outline" className="gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      Refresh Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTrending.map((product) => (
                      <div key={product.id} className="relative">
                        <div className="absolute top-2 left-2 z-10">
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                        </div>
                        <ProductCard
                          product={product}
                          onImport={() => handleImportProduct(product.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* High Profit Margin Tab */}
              <TabsContent value="profit" className="mt-0">
                {filteredHighProfit.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-lg text-muted-foreground mb-4">No high profit products match your filters</p>
                    <Button onClick={refreshProducts} variant="outline" className="gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      Refresh Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredHighProfit.map((product) => (
                      <div key={product.id} className="relative">
                        <div className="absolute top-2 left-2 z-10">
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                        </div>
                        <ProductCard
                          product={product}
                          onImport={() => handleImportProduct(product.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Competitor Insights Tab */}
              <TabsContent value="competitors" className="mt-0">
                {filteredCompetitor.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-lg text-muted-foreground mb-4">No competitor insights match your filters</p>
                    <Button onClick={refreshProducts} variant="outline" className="gap-2">
                      <RefreshCcw className="h-4 w-4" />
                      Refresh Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredCompetitor.map((product) => (
                      <div key={product.id} className="relative">
                        <div className="absolute top-2 left-2 z-10">
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                        </div>
                        <div className="group rounded-xl overflow-hidden border bg-card transition-all duration-300 hover:shadow-elevation">
                          <div className="relative">
                            <AspectRatio ratio={4/3}>
                              <img 
                                src={product.image_url || product.image} 
                                alt={product.name}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                              />
                            </AspectRatio>
                            
                            <div className="absolute top-2 right-2">
                              <Badge variant="default" className="bg-blue-500/90 backdrop-blur-sm">
                                <Users className="h-3 w-3 mr-1" />
                                {product.competitors || 0} stores
                              </Badge>
                            </div>
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                              <Button 
                                size="sm" 
                                className="bg-white text-black hover:bg-white/90 gap-1.5"
                                onClick={() => handleImportProduct(product.id)}
                              >
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Import Product
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-medium line-clamp-2 leading-tight">{product.name}</h3>
                              <Badge variant="outline" className="shrink-0 text-xs">
                                {product.source}
                              </Badge>
                            </div>
                            
                            <div className="mt-2 flex items-center gap-1.5">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              <span className="text-sm">{product.rating?.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">• {product.category}</span>
                            </div>
                            
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-semibold">${product.price?.toFixed(2)}</span>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${product.comparePrice?.toFixed(2) || product.compare_price?.toFixed(2)}
                                </span>
                              </div>
                              
                              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900">
                                +${product.profit?.toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      <Toaster />
    </MainLayout>
  );
};

export default ProductDiscovery;
