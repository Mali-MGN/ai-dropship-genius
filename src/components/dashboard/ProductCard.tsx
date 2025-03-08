
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  ChevronsUpDown, 
  ShoppingCart, 
  TrendingUp, 
  Star, 
  Eye,
  Import,
  Check,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: {
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
    similarityScore?: number;
  };
  trending?: boolean;
  onImport?: (id: string) => Promise<boolean> | void;
  className?: string;
  showImportButton?: boolean;
}

export function ProductCard({ 
  product, 
  trending, 
  onImport, 
  className,
  showImportButton = true
}: ProductCardProps) {
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const { toast } = useToast();
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(100 - (product.price / product.comparePrice! * 100))
    : 0;
  
  const handleImport = async () => {
    if (importing || imported || !onImport) return;
    
    setImporting(true);
    try {
      const result = await onImport(product.id);
      if (result !== false) {
        setImported(true);
        toast({
          title: "Product Imported",
          description: "The product has been added to your inventory.",
        });
      }
    } catch (error) {
      console.error("Error importing product:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing this product.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <div className={cn(
      "group rounded-xl overflow-hidden border bg-card transition-all duration-300 hover:shadow-elevation",
      className
    )}>
      <div className="relative">
        <AspectRatio ratio={4/3}>
          <img 
            src={product.image || "https://placehold.co/400x300?text=No+Image"} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </AspectRatio>
        
        {product.trending && (
          <div className="absolute top-2 right-2">
            <Badge variant="default" className="bg-primary/90 backdrop-blur-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}
        
        {hasDiscount && (
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="bg-destructive/90 backdrop-blur-sm">
              {discountPercent}% Off
            </Badge>
          </div>
        )}
        
        {showImportButton && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <Button 
              size="sm" 
              className={cn(
                "gap-1.5",
                imported 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-white text-black hover:bg-white/90"
              )}
              onClick={handleImport}
              disabled={importing || imported}
            >
              {importing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Importing...
                </>
              ) : imported ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Imported
                </>
              ) : (
                <>
                  <Import className="h-3.5 w-3.5" />
                  Import Product
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium line-clamp-2 leading-tight">{product.name}</h3>
          <Badge variant="outline" className="shrink-0 text-xs">
            {product.source}
          </Badge>
        </div>
        
        <div className="mt-2 flex items-center gap-1.5">
          {product.rating && (
            <>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm">{product.rating.toFixed(1)}</span>
            </>
          )}
          {product.category && (
            <span className="text-xs text-muted-foreground">• {product.category}</span>
          )}
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.comparePrice?.toFixed(2)}
              </span>
            )}
          </div>
          
          {product.profit && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900">
              +${product.profit.toFixed(2)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
