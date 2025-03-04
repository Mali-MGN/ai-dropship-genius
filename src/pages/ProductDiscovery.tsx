
import { useState } from "react";
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
  Import
} from "lucide-react";

// Sample trending products data - same as in Index.tsx
const trendingProducts = [
  {
    id: "1",
    name: "Portable UV Sanitizer Box for Smartphones",
    image: "https://images.unsplash.com/photo-1567324216289-87c7c56173e5?auto=format&fit=crop&q=80&w=870",
    price: 24.99,
    comparePrice: 39.99,
    source: "AliExpress",
    rating: 4.7,
    trending: true,
    profit: 15.99,
    category: "Electronics"
  },
  {
    id: "2",
    name: "Smart LED Galaxy Star Projector",
    image: "https://images.unsplash.com/photo-1534047244771-b21532741da5?auto=format&fit=crop&q=80&w=870",
    price: 32.50,
    comparePrice: 49.99,
    source: "Amazon",
    rating: 4.8,
    trending: true,
    profit: 18.50,
    category: "Home Decor"
  },
  {
    id: "3",
    name: "Multifunctional Car Seat Gap Organizer",
    image: "https://images.unsplash.com/photo-1615753094413-c3b2f81ec6f1?auto=format&fit=crop&q=80&w=870",
    price: 19.99,
    comparePrice: 29.99,
    source: "AliExpress",
    rating: 4.5,
    trending: true,
    profit: 14.99,
    category: "Automotive"
  },
  {
    id: "4",
    name: "Magnetic Phone Charger Stand Holder",
    image: "https://images.unsplash.com/photo-1631281956016-3cdc1b2fe5fb?auto=format&fit=crop&q=80&w=870",
    price: 29.99,
    comparePrice: 44.99,
    source: "Amazon",
    rating: 4.6,
    trending: true,
    profit: 19.99,
    category: "Electronics"
  },
  {
    id: "5",
    name: "Collapsible Silicone Water Bottle",
    image: "https://images.unsplash.com/photo-1546839655-c9151848e2b7?auto=format&fit=crop&q=80&w=870",
    price: 14.99,
    comparePrice: 24.99,
    source: "eBay",
    rating: 4.3,
    trending: true,
    profit: 12.49,
    category: "Sports & Outdoors"
  },
];

// Competitor products data
const competitorProducts = [
  {
    id: "c1",
    name: "Floating Plant Pot with LED Lights",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=870",
    price: 42.99,
    comparePrice: 59.99,
    source: "Competitor Store",
    rating: 4.9,
    profit: 24.99,
    category: "Home Decor",
    competitors: 18
  },
  {
    id: "c2",
    name: "Foldable Laptop Stand with Cooling Fan",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=870",
    price: 36.50,
    comparePrice: 54.99,
    source: "Competitor Store",
    rating: 4.7,
    profit: 22.50,
    category: "Electronics",
    competitors: 24
  },
  {
    id: "c3",
    name: "Reusable Smart Notebook",
    image: "https://images.unsplash.com/photo-1501618669935-18b6ecb13d6d?auto=format&fit=crop&q=80&w=870",
    price: 28.99,
    comparePrice: 39.99,
    source: "Competitor Store",
    rating: 4.8,
    profit: 16.99,
    category: "Office",
    competitors: 15
  },
];

const ProductDiscovery = () => {
  const [selectedTab, setSelectedTab] = useState("trending");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { toast } = useToast();

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

  const categories = ["Electronics", "Home Decor", "Automotive", "Sports & Outdoors", "Office"];
  const sources = ["AliExpress", "Amazon", "eBay", "Shopify"];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Product Discovery</h1>
          <p className="text-muted-foreground text-lg">Find trending products to sell in your store</p>
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

          {/* Trending Products Tab */}
          <TabsContent value="trending" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trendingProducts.map(product => (
                <div key={product.id} className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                    />
                  </div>
                  <ProductCard
                    product={product}
                    onImport={handleImportProduct}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          {/* High Profit Margin Tab */}
          <TabsContent value="profit" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trendingProducts
                .sort((a, b) => (b.profit || 0) - (a.profit || 0))
                .map(product => (
                  <div key={product.id} className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </div>
                    <ProductCard
                      product={product}
                      onImport={handleImportProduct}
                    />
                  </div>
                ))}
            </div>
          </TabsContent>

          {/* Competitor Insights Tab */}
          <TabsContent value="competitors" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {competitorProducts.map(product => (
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
                          src={product.image} 
                          alt={product.name}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      </AspectRatio>
                      
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="bg-blue-500/90 backdrop-blur-sm">
                          <Users className="h-3 w-3 mr-1" />
                          {product.competitors} stores
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
                        <span className="text-sm">{product.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">• {product.category}</span>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold">${product.price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.comparePrice?.toFixed(2)}
                          </span>
                        </div>
                        
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900">
                          +${product.profit.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProductDiscovery;
