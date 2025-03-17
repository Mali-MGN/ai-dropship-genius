
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { 
  Search, 
  ArrowUpDown, 
  Star, 
  TrendingUp, 
  Download, 
  Tag, 
  SlidersHorizontal, 
  Check, 
  RefreshCw,
  DollarSign,
  Tag as TagIcon,
  Filter,
  Clock,
  ThumbsUp,
  LucideIcon
} from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (order: string) => void;
  onCategoryChange: (category: string) => void;
  sortOrder: string;
  exportFormat: string;
  selectedCategory: string;
  categories: string[];
  onExportFormatChange: (format: string) => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  onSortChange,
  onCategoryChange,
  sortOrder,
  exportFormat,
  selectedCategory,
  categories,
  onExportFormatChange
}: ProductFiltersProps) {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  
  const filterTabs = [
    { title: "All", icon: TagIcon as LucideIcon, type: "tab" as const },
    { title: "Price", icon: DollarSign as LucideIcon, type: "tab" as const },
    { title: "Rating", icon: ThumbsUp as LucideIcon, type: "tab" as const },
    { title: "New", icon: Clock as LucideIcon, type: "tab" as const },
    { type: "separator" as const }, // Remove title and icon properties completely
    { title: "Advanced", icon: Filter as LucideIcon, type: "tab" as const },
  ];
  
  const handleFilterTabChange = (index: number | null) => {
    if (index === 5) { // Advanced tab
      setShowAdvancedFilters(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 bg-gray-50 dark:bg-gray-900"
              value={searchQuery}
              onChange={onSearchChange}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[180px] bg-gray-50 dark:bg-gray-900">
              <Tag className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <ExpandableTabs 
          tabs={filterTabs} 
          className="w-full" 
          activeColor="text-primary"
          onChange={handleFilterTabChange}
        />
        
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={sortOrder === "price-asc" ? "default" : "outline"} 
              size="sm" 
              onClick={() => onSortChange("price-asc")}
              className="bg-gray-50 dark:bg-gray-900"
            >
              <DollarSign className="h-4 w-4 mr-1 text-emerald-600" />
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Price Low-High
            </Button>
            
            <Button 
              variant={sortOrder === "price-desc" ? "default" : "outline"} 
              size="sm" 
              onClick={() => onSortChange("price-desc")}
              className="bg-gray-50 dark:bg-gray-900"
            >
              <DollarSign className="h-4 w-4 mr-1 text-emerald-600" />
              <ArrowUpDown className="h-4 w-4 mr-1 rotate-180" />
              Price High-Low
            </Button>
            
            <Button 
              variant={sortOrder === "rating" ? "default" : "outline"} 
              size="sm" 
              onClick={() => onSortChange("rating")}
              className="bg-gray-50 dark:bg-gray-900"
            >
              <Star className="h-4 w-4 mr-1 text-amber-500" />
              Rating
            </Button>
            
            <Button 
              variant={sortOrder === "trending" ? "default" : "outline"} 
              size="sm" 
              onClick={() => onSortChange("trending")}
              className="bg-gray-50 dark:bg-gray-900"
            >
              <TrendingUp className="h-4 w-4 mr-1 text-rose-500" />
              Trending
            </Button>
          </div>
        </div>
        
        <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-gray-50 dark:bg-gray-900">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Advanced Filters
              {(inStockOnly || freeShipping || priceRange[0] > 0 || priceRange[1] < 100) && (
                <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                  <Check className="h-3 w-3 mr-1" />
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Price Range</h4>
              <div className="space-y-2">
                <Slider
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={5}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="in-stock" className="text-sm font-medium">
                    In Stock Only
                  </label>
                  <Switch
                    id="in-stock"
                    checked={inStockOnly}
                    onCheckedChange={setInStockOnly}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="free-shipping" className="text-sm font-medium">
                    Free Shipping
                  </label>
                  <Switch
                    id="free-shipping"
                    checked={freeShipping}
                    onCheckedChange={setFreeShipping}
                  />
                </div>
              </div>
              
              <div className="pt-2 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setPriceRange([0, 100]);
                    setInStockOnly(false);
                    setFreeShipping(false);
                  }}
                >
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Reset Filters
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowAdvancedFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Popover open={showExportOptions} onOpenChange={setShowExportOptions}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-gray-50 dark:bg-gray-900">
              <Download className="mr-2 h-4 w-4" />
              Export Options
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Export Format</h4>
              <Select value={exportFormat} onValueChange={onExportFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" size="sm" onClick={() => setShowExportOptions(false)}>
                Export Selected
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {(selectedCategory !== 'all' || sortOrder !== 'trending' || inStockOnly || freeShipping) && (
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 pt-0.5">Active filters:</span>
            
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                Category: {selectedCategory}
                <button className="ml-1 hover:text-gray-500" onClick={() => onCategoryChange('all')}>
                  ×
                </button>
              </Badge>
            )}
            
            {sortOrder !== 'trending' && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                Sort: {sortOrder.replace('-', ' ').toUpperCase()}
                <button className="ml-1 hover:text-gray-500" onClick={() => onSortChange('trending')}>
                  ×
                </button>
              </Badge>
            )}
            
            {inStockOnly && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                In Stock Only
                <button className="ml-1 hover:text-gray-500" onClick={() => setInStockOnly(false)}>
                  ×
                </button>
              </Badge>
            )}
            
            {freeShipping && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                Free Shipping
                <button className="ml-1 hover:text-gray-500" onClick={() => setFreeShipping(false)}>
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
