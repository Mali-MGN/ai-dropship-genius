
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Product {
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
  inStock?: boolean;
  stockQuantity?: number;
}

interface PersonalizedProductFeedProps {
  products: Product[];
  loading: boolean;
  onImport: (id: string) => Promise<boolean> | void;
  className?: string;
}

export function PersonalizedProductFeed({ 
  products: initialProducts, 
  loading, 
  onImport,
  className 
}: PersonalizedProductFeedProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { toast } = useToast();
  
  // Group products by category
  const getProductsByCategory = () => {
    const categories: Record<string, Product[]> = {};
    
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push(product);
    });
    
    return categories;
  };
  
  // Set up real-time updates for product inventory
  useEffect(() => {
    // Initialize with the products passed as props
    setProducts(initialProducts);
    
    // Set up a real-time subscription to product updates
    const channel = supabase
      .channel('product-inventory-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scraped_products'
        },
        (payload) => {
          const updatedProduct = payload.new as any;
          
          setProducts(currentProducts => 
            currentProducts.map(product => 
              product.id === updatedProduct.id 
                ? { 
                    ...product, 
                    price: updatedProduct.price,
                    inStock: updatedProduct.in_stock,
                    stockQuantity: updatedProduct.stock_quantity
                  } 
                : product
            )
          );
          
          toast({
            title: "Inventory Updated",
            description: `${updatedProduct.name} has been updated.`,
            variant: "default"
          });
        }
      )
      .subscribe();
    
    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialProducts, toast]);
  
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
                <div key={product.id} className="relative">
                  {product.inStock === false && (
                    <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/50 z-10 flex items-center justify-center rounded-md">
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  {product.stockQuantity !== undefined && product.stockQuantity < 10 && product.stockQuantity > 0 && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="warning" className="bg-orange-500/90">
                        Only {product.stockQuantity} left
                      </Badge>
                    </div>
                  )}
                  <ProductCard
                    product={product}
                    onImport={onImport}
                    showImportButton={product.inStock !== false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
