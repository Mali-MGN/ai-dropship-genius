
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  ShoppingCart, 
  Star, 
  TrendingUp,
  DollarSign, 
  BarChart4,
  Loader2
} from "lucide-react";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  trending: boolean;
  profitMargin: number;
  source: string;
  comparePrice: number;
  createdAt: string;
  updatedAt: string;
  productUrl: string;
  inStock: boolean;
}

export default function ProductDiscovery() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("trending");
  const [sortOrder, setSortOrder] = useState("trending");
  const [importing, setImporting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Use the correct table name 'scraped_products'
        const { data, error } = await supabase
          .from("scraped_products")
          .select("*");

        if (error) {
          throw error;
        }

        if (data) {
          // Transform data to match ProductData interface
          const transformedData: ProductData[] = data.map(item => ({
            id: item.id,
            name: item.name || "",
            description: item.description || "",
            price: Number(item.price) || 0,
            imageUrl: item.image_url || "https://placehold.co/600x400?text=No+Image",
            category: item.category || "Uncategorized",
            tags: item.tags || [],
            rating: item.rating || 0,
            reviewCount: item.review_count || 0,
            trending: item.is_trending || false,
            profitMargin: item.profit_margin || 0,
            source: item.source || "Unknown",
            comparePrice: item.compare_price || 0,
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
            productUrl: item.product_url || "#",
            inStock: true
          }));
          
          setProducts(transformedData);
          filterProducts(transformedData, currentTab, searchQuery);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [currentTab, searchQuery]);

  const filterProducts = (allProducts: ProductData[], tab: string, query: string) => {
    let filtered = [...allProducts];
    
    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
    }
    
    // Apply tab filter
    switch (tab) {
      case "trending":
        filtered = filtered.filter(product => product.trending);
        break;
      case "profit":
        filtered = filtered.sort((a, b) => b.profitMargin - a.profitMargin);
        filtered = filtered.slice(0, 20); // Top 20 products by profit margin
        break;
      case "competitors":
        // Filter by competitor-related products (for now just show all)
        filtered = [...filtered];
        break;
      default:
        // No special filtering
        break;
    }
    
    // Apply sorting
    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "trending":
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // No special sorting
        break;
    }
    
    setFilteredProducts(filtered);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    filterProducts(products, value, searchQuery);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    filterProducts(products, currentTab, e.target.value);
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    filterProducts(products, currentTab, searchQuery);
  };

  const handleImport = async (productId: string) => {
    try {
      setImporting(prev => ({ ...prev, [productId]: true }));
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Product imported",
        description: "The product has been imported to your store.",
      });
    } catch (error) {
      console.error("Error importing product:", error);
      toast({
        title: "Import failed",
        description: "Failed to import the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(prev => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Product Discovery</h1>
          <p className="text-muted-foreground text-lg">Find trending products to add to your store</p>
        </div>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <Button variant="outline" onClick={() => handleSort(sortOrder === 'price-asc' ? 'price-desc' : 'price-asc')}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Price
          </Button>
          
          <Button variant="outline" onClick={() => handleSort('rating')}>
            <Star className="mr-2 h-4 w-4" />
            Rating
          </Button>
          
          <Button variant="outline" onClick={() => handleSort('trending')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending
          </Button>
        </div>
        
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
            <Card>
              <CardHeader>
                <CardTitle>Trending Products</CardTitle>
                <CardDescription>
                  Hot selling products that are trending right now. Updated daily.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Loading trending products...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onImport={handleImport}
                          importing={importing[product.id] || false}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        <p className="text-muted-foreground">No trending products found.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>High Profit Margin Products</CardTitle>
                <CardDescription>
                  Products with the highest profit potential for your store.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Loading high profit margin products...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onImport={handleImport}
                          importing={importing[product.id] || false}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        <p className="text-muted-foreground">No high profit margin products found.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="competitors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Insights</CardTitle>
                <CardDescription>
                  Products that your competitors are selling successfully.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Loading competitor insights...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onImport={handleImport}
                          importing={importing[product.id] || false}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        <p className="text-muted-foreground">No competitor insights found.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  onImport, 
  importing 
}: { 
  product: ProductData; 
  onImport: (id: string) => void; 
  importing: boolean;
}) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105" 
        />
        {product.trending && (
          <Badge className="absolute top-2 right-2 bg-rose-500">
            <TrendingUp className="h-3 w-3 mr-1" /> Trending
          </Badge>
        )}
      </div>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          <div className="flex items-center space-x-1 text-amber-500">
            <Star className="h-4 w-4 fill-amber-500" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          {product.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              {product.comparePrice > 0 && (
                <span className="text-sm line-through text-muted-foreground">
                  ${product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {product.profitMargin}% margin
            </Badge>
          </div>
          
          <Separator className="my-3" />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Source: {product.source}</span>
            <Button 
              onClick={() => onImport(product.id)} 
              disabled={importing}
              size="sm"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
