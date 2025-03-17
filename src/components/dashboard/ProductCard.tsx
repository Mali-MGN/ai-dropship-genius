
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

// Helper function to get appropriate product image based on name and category
const getProductImage = (name: string, category?: string): string => {
  const lowerName = name.toLowerCase();
  
  if (category === "Electronics" || lowerName.includes("earbuds") || lowerName.includes("watch") || lowerName.includes("speaker") || lowerName.includes("charger")) {
    if (lowerName.includes("earbuds") || lowerName.includes("earpods")) {
      return "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("watch") || lowerName.includes("smart watch")) {
      return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("speaker") || lowerName.includes("bluetooth")) {
      return "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("charging") || lowerName.includes("charger")) {
      return "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop";
    }
  } else if (category === "Fashion" || lowerName.includes("wallet") || lowerName.includes("backpack") || lowerName.includes("hat") || lowerName.includes("sunglasses")) {
    if (lowerName.includes("wallet") || lowerName.includes("leather")) {
      return "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("backpack") || lowerName.includes("bag")) {
      return "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("sunglasses") || lowerName.includes("glasses")) {
      return "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("hat") || lowerName.includes("beanie")) {
      return "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop";
    }
  } else if (category === "Home Decor" || lowerName.includes("light") || lowerName.includes("planter") || lowerName.includes("candle") || lowerName.includes("pillow")) {
    if (lowerName.includes("light") || lowerName.includes("led")) {
      return "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("planter") || lowerName.includes("succulent")) {
      return "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("candle") || lowerName.includes("scented")) {
      return "https://images.unsplash.com/photo-1602523069569-47d3d4c8ca63?w=500&auto=format&fit=crop";
    } else if (lowerName.includes("pillow") || lowerName.includes("throw")) {
      return "https://images.unsplash.com/photo-1584100936595-c0654b50a2f3?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?w=500&auto=format&fit=crop";
    }
  } else if (category === "Beauty" || lowerName.includes("cream") || lowerName.includes("serum")) {
    return "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop";
  } else if (category === "Sports" || lowerName.includes("yoga") || lowerName.includes("fitness")) {
    if (lowerName.includes("yoga") || lowerName.includes("mat")) {
      return "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?w=500&auto=format&fit=crop";
    }
  } else if (category === "Toys") {
    return "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=500&auto=format&fit=crop";
  } else if (lowerName.includes("water bottle") || lowerName.includes("bottle")) {
    return "https://images.unsplash.com/photo-1556036518-4c5a21e27f9c?w=500&auto=format&fit=crop";
  } else if (lowerName.includes("organizer") || lowerName.includes("desk")) {
    return "https://images.unsplash.com/photo-1589825542376-ce3c824b5483?w=500&auto=format&fit=crop";
  } else if (lowerName.includes("travel") || lowerName.includes("pillow")) {
    return "https://images.unsplash.com/photo-1511345089003-80a527d6e596?w=500&auto=format&fit=crop";
  }
  
  // Default image if no specific match
  return "https://images.unsplash.com/photo-1570570876281-81a6de62e3f7?w=500&auto=format&fit=crop";
};

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
  
  // Use our image helper function to get an appropriate image
  const productImage = product.image || getProductImage(product.name, product.category);
  
  return (
    <div className={cn(
      "group rounded-xl overflow-hidden border bg-card transition-all duration-300 hover:shadow-elevation",
      className
    )}>
      <div className="relative">
        <AspectRatio ratio={4/3}>
          <img 
            src={productImage} 
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
