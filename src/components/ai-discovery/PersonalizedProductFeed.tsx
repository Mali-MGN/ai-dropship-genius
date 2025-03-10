
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Loader2, Target, TrendingUp } from "lucide-react";

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
}

interface PersonalizedProductFeedProps {
  products: Product[];
  loading: boolean;
  onImport: (id: string) => Promise<boolean> | void;
}

export function PersonalizedProductFeed({ 
  products, 
  loading, 
  onImport 
}: PersonalizedProductFeedProps) {
  
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
  
  const productsByCategory = getProductsByCategory();
  
  if (loading) {
    return (
      <Card>
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
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-48">
            <p className="text-muted-foreground">No products found. Try adjusting your search or preferences.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
                <ProductCard
                  key={product.id}
                  product={product}
                  onImport={onImport}
                  showImportButton={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
