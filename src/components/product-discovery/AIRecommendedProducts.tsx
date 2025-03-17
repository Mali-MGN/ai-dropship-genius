
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "./ProductCard";
import { Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  aiRecommended?: boolean;
}

interface RetailerInfo {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
}

interface AIRecommendedProductsProps {
  title: string;
  description: string;
  products: ProductData[];
  loading: boolean;
  onImport: (id: string) => void;
  onExport: (id: string) => void;
  importing: Record<string, boolean>;
  exporting: Record<string, boolean>;
  selectedRetailer: string | null;
  retailers: RetailerInfo[];
}

export function AIRecommendedProducts({
  title,
  description,
  products,
  loading,
  onImport,
  onExport,
  importing,
  exporting,
  selectedRetailer,
  retailers
}: AIRecommendedProductsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-purple-500" />
            AI Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Loading AI recommendations...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onImport={onImport}
                  onExport={onExport}
                  importing={importing[product.id] || false}
                  exporting={exporting[product.id] || false}
                  selectedRetailer={selectedRetailer}
                  retailers={retailers}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No AI recommendations available.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
