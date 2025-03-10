
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
  Loader2,
  ExternalLink,
  Download
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RetailerSelector } from "@/components/orders/RetailerSelector";

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

interface RetailerInfo {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
}

export default function ProductDiscovery() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("trending");
  const [sortOrder, setSortOrder] = useState("trending");
  const [importing, setImporting] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState<Record<string, boolean>>({});
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");

  // Popular retailers for dropshipping
  const retailers: RetailerInfo[] = [
    { 
      id: "aliexpress", 
      name: "AliExpress", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/AliExpress_logo.svg/1024px-AliExpress_logo.svg.png", 
      url: "https://www.aliexpress.com/",
      description: "Popular global marketplace with millions of products at competitive prices"
    },
    { 
      id: "amazon", 
      name: "Amazon", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png", 
      url: "https://www.amazon.com/",
      description: "Massive selection and fast shipping options for Prime members"
    },
    { 
      id: "shopify", 
      name: "Shopify", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png", 
      url: "https://www.shopify.com/",
      description: "Platform to easily set up your own dropshipping store"
    },
    { 
      id: "spocket", 
      name: "Spocket", 
      logo: "https://cdn.shopify.com/app-store/listing_images/7b9e2b842ba1dd353e2cef7fcdcbcd45/icon/COPUmvjytfgCEAE=.png", 
      url: "https://www.spocket.co/",
      description: "Curated marketplace of US and EU suppliers with fast shipping"
    },
    { 
      id: "cjdropshipping", 
      name: "CJ Dropshipping", 
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJt5x7xSgSx_6NcHf4dtTrN_MlCjwrBXMG2w&usqp=CAU", 
      url: "https://cjdropshipping.com/",
      description: "Product sourcing, fulfillment, and shipping services worldwide"
    }
  ];

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
      
      // Get the product details
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error("Product not found");
      
      // Check if a retailer is selected
      if (!selectedRetailer) {
        toast({
          title: "Select a retailer",
          description: "Please select a retailer to import from",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Product imported",
        description: `The product has been imported from ${selectedRetailer}.`,
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

  const handleExport = async (productId: string) => {
    try {
      setExporting(prev => ({ ...prev, [productId]: true }));
      
      // Get the product details
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error("Product not found");
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a formatted product object for export
      const exportData = {
        id: product.id,
        title: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        category: product.category,
        tags: product.tags.join(", "),
        imageUrl: product.imageUrl,
        source: product.source,
        exported_at: new Date().toISOString()
      };
      
      if (exportFormat === "csv") {
        downloadCSV([exportData], `product-${product.id}`);
      } else if (exportFormat === "json") {
        downloadJSON(exportData, `product-${product.id}`);
      }
      
      toast({
        title: "Product exported",
        description: `The product has been exported to your store as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Error exporting product:", error);
      toast({
        title: "Export failed",
        description: "Failed to export the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(prev => ({ ...prev, [productId]: false }));
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    // Convert object to CSV
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(','));
    const csv = [headers, ...rows].join('\n');
    
    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Product Discovery</h1>
          <p className="text-muted-foreground text-lg">Find trending products to add to your store</p>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Retailer Selection</CardTitle>
            <CardDescription>
              Choose a retailer to import products from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {retailers.map((retailer) => (
                <div
                  key={retailer.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedRetailer === retailer.id 
                      ? "border-primary bg-primary/5" 
                      : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedRetailer(retailer.id)}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="h-12 w-12 flex items-center justify-center">
                      <img 
                        src={retailer.logo} 
                        alt={retailer.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="font-medium text-sm">{retailer.name}</div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="w-full text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(retailer.url, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-between space-x-4 mb-6">
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
          
          <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Options
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-4">
                <h4 className="font-medium">Export Format</h4>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
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
                          onExport={handleExport}
                          importing={importing[product.id] || false}
                          exporting={exporting[product.id] || false}
                          selectedRetailer={selectedRetailer}
                          retailers={retailers}
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
                          onExport={handleExport}
                          importing={importing[product.id] || false}
                          exporting={exporting[product.id] || false}
                          selectedRetailer={selectedRetailer}
                          retailers={retailers}
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
                          onExport={handleExport}
                          importing={importing[product.id] || false}
                          exporting={exporting[product.id] || false}
                          selectedRetailer={selectedRetailer}
                          retailers={retailers}
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

// Update the Product Card component to include export functionality
function ProductCard({ 
  product, 
  onImport, 
  onExport,
  importing,
  exporting,
  selectedRetailer,
  retailers
}: { 
  product: ProductData; 
  onImport: (id: string) => void; 
  onExport: (id: string) => void;
  importing: boolean;
  exporting: boolean;
  selectedRetailer: string | null;
  retailers: RetailerInfo[];
}) {
  const selectedRetailerName = selectedRetailer 
    ? retailers.find(r => r.id === selectedRetailer)?.name || selectedRetailer
    : null;

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
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Source: {product.source}</span>
            <Button 
              onClick={() => window.open(product.productUrl, '_blank')}
              size="sm"
              variant="ghost"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => onImport(product.id)} 
              disabled={importing || !selectedRetailer}
              size="sm"
              className="flex-1"
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {selectedRetailerName ? `Import from ${selectedRetailerName}` : "Select a retailer"}
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => onExport(product.id)} 
              disabled={exporting}
              size="sm"
              variant="outline"
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
