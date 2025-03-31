
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target, TrendingUp, AlertCircle, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProductProps {
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
}

interface PersonalizedProductFeedProps {
  products: ProductProps[];
  loading: boolean;
  onImport: (id: string) => Promise<boolean> | void;
  className?: string;
}

export function PersonalizedProductFeed({ 
  products, 
  loading, 
  onImport,
  className 
}: PersonalizedProductFeedProps) {
  const [importing, setImporting] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  const handleImport = async (productId: string) => {
    try {
      setImporting(prev => ({ ...prev, [productId]: true }));
      
      const result = await onImport(productId);
      
      if (result) {
        toast({
          title: "Product imported",
          description: "The product has been added to your store successfully.",
        });
      }
    } catch (error) {
      console.error("Error importing product:", error);
      
      toast({
        title: "Import failed",
        description: "There was an error importing the product.",
        variant: "destructive",
      });
    } finally {
      setImporting(prev => ({ ...prev, [productId]: false }));
    }
  };
  
  // Group products by category
  const getProductsByCategory = () => {
    const categories: Record<string, ProductProps[]> = {};
    
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push(product);
    });
    
    return categories;
  };
  
  const productsByCategory = getProductsByCategory();
  
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-48">
            <Loader2 className="h-8 w-8 mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating personalized product recommendations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (products.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-48">
            <AlertCircle className="h-8 w-8 mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No products found. Try adjusting your search or preferences.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
        <Card key={category}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">{category}</CardTitle>
              <CardDescription>
                {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} recommended for you
              </CardDescription>
            </div>
            <Badge variant="outline" className="ml-auto">
              <Target className="h-3.5 w-3.5 mr-1 text-primary" />
              Personalized
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 text-secondary-foreground">
                        No Image
                      </div>
                    )}
                    
                    {product.trending && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-rose-500 text-white border-0">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                    )}
                    
                    {product.profit && product.profit >= 40 && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-emerald-500 text-white border-0">
                          {product.profit}% Profit
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-base mb-1 line-clamp-1">{product.name}</h3>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <div className="text-sm line-through text-muted-foreground">
                            ${product.comparePrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm text-muted-foreground">Source: {product.source}</div>
                      {product.rating && (
                        <div className="flex items-center">
                          <span className="text-amber-500 mr-1">★</span>
                          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleImport(product.id)}
                      disabled={importing[product.id]}
                    >
                      {importing[product.id] ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                          Import Product
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
