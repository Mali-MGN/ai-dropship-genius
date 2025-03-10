
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown, Star, TrendingUp, Download } from "lucide-react";
import { useState } from "react";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (order: string) => void;
  sortOrder: string;
  exportFormat: string;
  onExportFormatChange: (format: string) => void;
}

export function ProductFilters({
  searchQuery,
  onSearchChange,
  onSortChange,
  sortOrder,
  exportFormat,
  onExportFormatChange
}: ProductFiltersProps) {
  const [showExportOptions, setShowExportOptions] = useState(false);

  return (
    <div className="flex items-center justify-between space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-8"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
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
  );
}
