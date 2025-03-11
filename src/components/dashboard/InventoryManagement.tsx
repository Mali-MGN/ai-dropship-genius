
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InventoryBadge } from "@/components/products/InventoryBadge";
import { formatCurrency } from "@/lib/utils";
import { RefreshCw, Search, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number | null;
  in_stock: boolean | null;
  stock_quantity: number | null;
  category: string | null;
  image_url: string | null;
}

export function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scraped_products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setProducts(data || []);
      
      // Filter low stock items
      const lowStock = (data || []).filter(product => 
        (product.stock_quantity !== null && product.stock_quantity <= 10) || 
        product.in_stock === false
      );
      setLowStockItems(lowStock);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Set up real-time subscription for product updates
    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'scraped_products'
      }, (payload) => {
        console.log('Product update received:', payload);
        
        if (payload.eventType === 'INSERT') {
          setProducts(current => [...current, payload.new as Product]);
          
          // Check if new product is low stock
          if ((payload.new.stock_quantity !== null && payload.new.stock_quantity <= 10) || 
              payload.new.in_stock === false) {
            setLowStockItems(current => [...current, payload.new as Product]);
          }
        } 
        else if (payload.eventType === 'UPDATE') {
          setProducts(current => 
            current.map(product => 
              product.id === payload.new.id ? { ...product, ...payload.new } : product
            )
          );
          
          // Update low stock items
          const isLowStock = (payload.new.stock_quantity !== null && payload.new.stock_quantity <= 10) || 
                             payload.new.in_stock === false;
          
          if (isLowStock) {
            setLowStockItems(current => {
              const exists = current.some(item => item.id === payload.new.id);
              if (exists) {
                return current.map(item => 
                  item.id === payload.new.id ? { ...item, ...payload.new } : item
                );
              } else {
                return [...current, payload.new as Product];
              }
            });
          } else {
            setLowStockItems(current => 
              current.filter(item => item.id !== payload.new.id)
            );
          }
        }
        else if (payload.eventType === 'DELETE') {
          setProducts(current => 
            current.filter(product => product.id !== payload.old.id)
          );
          setLowStockItems(current => 
            current.filter(product => product.id !== payload.old.id)
          );
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Inventory Management</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchProducts} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-md">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Low Stock Alert</span>
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              {lowStockItems.length} {lowStockItems.length === 1 ? 'product is' : 'products are'} low in stock or out of stock
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="flex items-center gap-2">
                        {product.image_url && (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-8 h-8 object-cover rounded-md"
                          />
                        )}
                        <span className="font-medium">{product.name}</span>
                      </TableCell>
                      <TableCell>{product.price ? formatCurrency(product.price) : 'N/A'}</TableCell>
                      <TableCell>{product.category || 'Uncategorized'}</TableCell>
                      <TableCell>
                        <InventoryBadge 
                          inStock={product.in_stock !== null ? product.in_stock : true} 
                          quantity={product.stock_quantity} 
                        />
                      </TableCell>
                      <TableCell>{product.stock_quantity !== null ? product.stock_quantity : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
