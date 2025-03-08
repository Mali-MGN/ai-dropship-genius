
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "./ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface ImportedProduct {
  id: string;
  product_id: string;
  user_id: string;
  created_at: string;
  status: "pending" | "active" | "out_of_stock";
  product: {
    id: string;
    name: string;
    image_url: string;
    price: number;
    compare_price: number;
    rating: number;
    source: string;
    category: string;
  };
}

export const ImportedProducts = () => {
  const [products, setProducts] = useState<ImportedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadImportedProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // For now, we'll simulate getting imported products from localStorage
      // In a real application, you would fetch from your database
      const importedProductIds = JSON.parse(localStorage.getItem("importedProducts") || "[]");
      
      if (importedProductIds.length === 0) {
        setProducts([]);
        return;
      }
      
      // Fetch product details from the database for all imported product IDs
      const { data, error } = await supabase
        .from("scraped_products")
        .select("*")
        .in("id", importedProductIds);
        
      if (error) throw error;
      
      if (data) {
        // Transform data into ImportedProduct format
        const importedProducts = data.map(product => ({
          id: `import_${product.id}`,
          product_id: product.id,
          user_id: user.id,
          created_at: new Date().toISOString(),
          status: "active" as const,
          product: {
            id: product.id,
            name: product.name,
            image_url: product.image_url || "",
            price: product.price || 0,
            compare_price: product.compare_price || 0,
            rating: product.rating || 0,
            source: product.source || "",
            category: product.category || "",
          }
        }));
        
        setProducts(importedProducts);
      }
    } catch (error) {
      console.error("Error loading imported products:", error);
      toast({
        title: "Error",
        description: "Failed to load your imported products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = (productId: string) => {
    // Remove from state
    setProducts(prev => prev.filter(p => p.product_id !== productId));
    
    // Remove from localStorage
    const importedProductIds = JSON.parse(localStorage.getItem("importedProducts") || "[]");
    const updatedIds = importedProductIds.filter((id: string) => id !== productId);
    localStorage.setItem("importedProducts", JSON.stringify(updatedIds));
    
    toast({
      title: "Product Removed",
      description: "Product has been removed from your inventory.",
    });
  };

  useEffect(() => {
    loadImportedProducts();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Imported Products</CardTitle>
          <CardDescription>Manage products you've imported to your store</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Imported Products</CardTitle>
          <CardDescription>Manage products you've imported to your store</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={loadImportedProducts} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't imported any products yet.</p>
            <p className="text-sm mt-2">
              Find trending products in the AI Product Discovery section and import them to get started.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((importedProduct) => (
                <div key={importedProduct.id} className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900">
                      {importedProduct.status}
                    </Badge>
                  </div>
                  <ProductCard
                    product={{
                      id: importedProduct.product_id,
                      name: importedProduct.product.name,
                      image: importedProduct.product.image_url,
                      price: importedProduct.product.price,
                      comparePrice: importedProduct.product.compare_price,
                      source: importedProduct.product.source,
                      rating: importedProduct.product.rating,
                      category: importedProduct.product.category,
                    }}
                    showImportButton={false}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProduct(importedProduct.product_id)}
                      className="gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
