
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowUpDown, Star, TrendingUp, Download, Tag } from "lucide-react";
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

  return (
    <div className="space-y-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <Tag className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={() => onSortChange(sortOrder === 'price-asc' ? 'price-desc' : 'price-asc')}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Price
        </Button>
        
        <Button variant="outline" onClick={() => onSortChange('rating')}>
          <Star className="mr-2 h-4 w-4" />
          Rating
        </Button>
        
        <Button variant="outline" onClick={() => onSortChange('trending')}>
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
              <Select value={exportFormat} onValueChange={onExportFormatChange}>
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
    </div>
  );
}
