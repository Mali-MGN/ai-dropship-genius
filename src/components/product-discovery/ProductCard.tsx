
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp,
  Star, 
  ExternalLink,
  ShoppingCart,
  Loader2,
  Download
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

interface RetailerInfo {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
}

interface ProductCardProps {
  product: ProductData;
  onImport: (id: string) => void;
  onExport: (id: string) => void;
  importing: boolean;
  exporting: boolean;
  selectedRetailer: string | null;
  retailers: RetailerInfo[];
}

export function ProductCard({ 
  product, 
  onImport, 
  onExport,
  importing,
  exporting,
  selectedRetailer,
  retailers
}: ProductCardProps) {
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
