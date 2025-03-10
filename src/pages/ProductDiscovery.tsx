import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCheck, Copy, CopyCheckIcon, Filter, Funnel, GripVertical, Heart, Import, MoreHorizontal, Search, Share2, Star } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/context/AuthContext";
import {
  Megaphone,
  BarChart,
  Target,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  supplier: string;
  popularity: number;
  profitMargin: number;
  cost: number;
  shippingCost: number;
  rating: number;
  unitsSold: number;
  inventoryLevel: number;
  manufacturingCost: number;
  marketingSpend: number;
  customerSatisfaction: number;
  riskScore: number;
  opportunityScore: number;
}

const ProductDiscovery = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [supplierFilter, setSupplierFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<keyof ProductData>("popularity");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*");

        if (error) throw error;
        setProducts(data);
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
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchRegex = new RegExp(searchQuery, "i");
    const categoryMatch = categoryFilter ? product.category === categoryFilter : true;
        const supplierMatch = supplierFilter ? product.supplier === supplierFilter : true;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];

    return (
      searchRegex.test(product.name) &&
            categoryMatch &&
            supplierMatch &&
      priceMatch
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;

    if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") {
      return order * ((a[sortBy] as number) - (b[sortBy] as number));
    } else if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
      return order * a[sortBy].localeCompare(b[sortBy]);
    } else {
      return 0;
    }
  });

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleClearFilters = () => {
        setCategoryFilter("");
        setSupplierFilter("");
    setPriceRange([0, 1000]);
    setDate(undefined);
  };

  const handleCategoryFilterChange = (category: string) => {
        setCategoryFilter(category);
    };

    const handleSupplierFilterChange = (supplier: string) => {
        setSupplierFilter(supplier);
    };

  const handleSortChange = (newSortBy: keyof ProductData) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handleShareProduct = (product: ProductData) => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: product.imageUrl,
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => {
          toast({
            title: "Product shared!",
            description: `You have successfully shared ${product.name}`,
          });
        })
        .catch((error) => {
          console.error("Error sharing product:", error);
          toast({
            title: "Error sharing product",
            description: "There was an error sharing the product.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Share API not supported",
        description: "Your browser does not support the Share API.",
        variant: "destructive",
      });
    }
  };

  const handleSaveToWishlist = async (product: ProductData) => {
    try {
      setIsSaving(true);
      // Simulate saving to wishlist
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist",
      });
      
      return;
    } catch (error) {
      console.error("Error saving to wishlist:", error);
      
      toast({
        title: "Failed to add product",
        description: "There was an error adding the product to your wishlist",
        variant: "destructive",
      });
      
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportProduct = async (product: ProductData) => {
    try {
      setIsImporting(true);
      // Simulate importing product
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Product imported",
        description: "Product has been added to your store",
      });
      
      return;
    } catch (error) {
      console.error("Error importing product:", error);
      
      toast({
        title: "Failed to import product",
        description: "There was an error importing the product to your store",
        variant: "destructive",
      });
      
      return;
    } finally {
      setIsImporting(false);
    }
  };

  const categories = [...new Set(products.map((product) => product.category))];
    const suppliers = [...new Set(products.map((product) => product.supplier))];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Product Discovery</h1>
          <p className="text-muted-foreground text-lg">Discover trending products and analyze market opportunities</p>
        </div>

        <div className="flex items-center justify-between">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />

          <Button variant="outline" onClick={handleToggleFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Apply filters to narrow down your product search</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={handleCategoryFilterChange}>
                                        <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select category" defaultValue={categoryFilter} />
                                        </SelectTrigger>
                                        <SelectContent>
                                                <SelectItem value="">All Categories</SelectItem>
                                                {categories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                                {category}
                                                        </SelectItem>
                                                ))}
                                        </SelectContent>
                                </Select>
              </div>
                            <div className="space-y-2">
                                    <Label htmlFor="supplier">Supplier</Label>
                                    <Select onValueChange={handleSupplierFilterChange}>
                                            <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select supplier" defaultValue={supplierFilter} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                    <SelectItem value="">All Suppliers</SelectItem>
                                                    {suppliers.map((supplier) => (
                                                            <SelectItem key={supplier} value={supplier}>
                                                                    {supplier}
                                                            </SelectItem>
                                                    ))}
                                            </SelectContent>
                                    </Select>
                            </div>
              <div className="space-y-2">
                <Label htmlFor="price-range">Price Range</Label>
                <Slider
                  id="price-range"
                  defaultValue={priceRange}
                  max={1000}
                  step={10}
                  onValueChange={handlePriceRangeChange}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={handleDateChange}
                      numberOfMonths={2}
                      pagedNavigation
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button variant="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="trending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trending" onClick={() => setActiveTab("trending")}>Trending</TabsTrigger>
            <TabsTrigger value="opportunities" onClick={() => setActiveTab("opportunities")}>Opportunities</TabsTrigger>
            <TabsTrigger value="saved" onClick={() => setActiveTab("saved")}>Saved</TabsTrigger>
          </TabsList>
          <TabsContent value="trending" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                Loading products...
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">
                        <Button variant="ghost" size="sm" className="gap-1 h-8" onClick={() => handleSortChange("name")}>
                          Product Name
                          {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" className="gap-1 h-8" onClick={() => handleSortChange("category")}>
                          Category
                          {sortBy === "category" && (sortOrder === "asc" ? "▲" : "▼")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" className="gap-1 h-8" onClick={() => handleSortChange("price")}>
                          Price
                          {sortBy === "price" && (sortOrder === "asc" ? "▲" : "▼")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" className="gap-1 h-8" onClick={() => handleSortChange("popularity")}>
                          Popularity
                          {sortBy === "popularity" && (sortOrder === "asc" ? "▲" : "▼")}
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.popularity}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-4">
                            <Button variant="outline" size="icon" onClick={() => handleSaveToWishlist(product)} disabled={isSaving}>
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleImportProduct(product)} disabled={isImporting}>
                              <Import className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>{product.name}</DialogTitle>
                                  <DialogDescription>
                                    Analyze product details and take action.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="imageUrl" className="text-right">
                                      Image URL
                                    </Label>
                                    <Input id="imageUrl" value={product.imageUrl} className="col-span-3" readOnly />
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Copy className="h-4 w-4 mr-2" />
                                          {copied ? <CopyCheckIcon className="h-4 w-4" /> : "Copy"}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto" align="center">
                                        {copied ? "Copied!" : "Copy to clipboard"}
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">
                                      Description
                                    </Label>
                                    <Input id="description" value={product.description} className="col-span-3" readOnly />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="price" className="text-right">
                                      Price
                                    </Label>
                                    <Input id="price" value={product.price.toFixed(2)} className="col-span-3" readOnly />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="category" className="text-right">
                                      Category
                                    </Label>
                                    <Input id="category" value={product.category} className="col-span-3" readOnly />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="supplier" className="text-right">
                                      Supplier
                                    </Label>
                                    <Input id="supplier" value={product.supplier} className="col-span-3" readOnly />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="popularity" className="text-right">
                                      Popularity
                                    </Label>
                                    <Input id="popularity" value={product.popularity.toString()} className="col-span-3" readOnly />
                                  </div>
                                </div>
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">Close</Button>
                                </DialogClose>
                              </DialogContent>
                            </Dialog>
                            <Button variant="ghost" size="icon" onClick={() => handleShareProduct(product)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sortedProducts.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle>Market Opportunities</CardTitle>
                <CardDescription>Analyze potential market opportunities based on product data</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coming Soon: Advanced analytics and insights to identify promising market opportunities.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Products</CardTitle>
                <CardDescription>View and manage your saved products</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coming Soon: A dedicated space to manage products you've saved for later.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProductDiscovery;
