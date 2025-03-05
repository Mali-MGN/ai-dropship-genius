
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Search, 
  Plus, 
  Tag, 
  ShoppingBag, 
  Archive,
  Box,
  Package,
  Edit,
  Trash2,
  ArrowUpDown,
  Filter,
  Settings,
  DollarSign,
  Image as ImageIcon,
  Save,
  AlertCircle
} from "lucide-react";

// Sample products data
const products = [
  {
    id: "1",
    name: "Portable UV Sanitizer Box for Smartphones",
    image: "https://images.unsplash.com/photo-1567324216289-87c7c56173e5?auto=format&fit=crop&q=80&w=870",
    price: 24.99,
    comparePrice: 39.99,
    source: "AliExpress",
    inventory: 52,
    status: "active",
    category: "Electronics"
  },
  {
    id: "2",
    name: "Smart LED Galaxy Star Projector",
    image: "https://images.unsplash.com/photo-1534047244771-b21532741da5?auto=format&fit=crop&q=80&w=870",
    price: 32.50,
    comparePrice: 49.99,
    source: "Amazon",
    inventory: 38,
    status: "active",
    category: "Home Decor"
  },
  {
    id: "3",
    name: "Multifunctional Car Seat Gap Organizer",
    image: "https://images.unsplash.com/photo-1615753094413-c3b2f81ec6f1?auto=format&fit=crop&q=80&w=870",
    price: 19.99,
    comparePrice: 29.99,
    source: "AliExpress",
    inventory: 64,
    status: "active",
    category: "Automotive"
  },
  {
    id: "4",
    name: "Magnetic Phone Charger Stand Holder",
    image: "https://images.unsplash.com/photo-1631281956016-3cdc1b2fe5fb?auto=format&fit=crop&q=80&w=870",
    price: 29.99,
    comparePrice: 44.99,
    source: "Amazon",
    inventory: 27,
    status: "active",
    category: "Electronics"
  },
  {
    id: "5",
    name: "Collapsible Silicone Water Bottle",
    image: "https://images.unsplash.com/photo-1546839655-c9151848e2b7?auto=format&fit=crop&q=80&w=870",
    price: 14.99,
    comparePrice: 24.99,
    source: "eBay",
    inventory: 45,
    status: "active",
    category: "Sports & Outdoors"
  },
];

// Sample drafts
const drafts = [
  {
    id: "d1",
    name: "Wireless Earbuds with Charging Case",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&q=80&w=870",
    price: 49.99,
    comparePrice: 79.99,
    source: "AliExpress",
    inventory: 0,
    status: "draft",
    category: "Electronics"
  },
  {
    id: "d2",
    name: "Adjustable Laptop Desk for Bed",
    image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=870",
    price: 39.99,
    comparePrice: 59.99,
    source: "Amazon",
    inventory: 0,
    status: "draft",
    category: "Home Office"
  }
];

const StoreManagement = () => {
  const [selectedTab, setSelectedTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to perform this action.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `${action} Applied`,
      description: `Action applied to ${selectedProducts.length} selected products.`,
    });
    setSelectedProducts([]);
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(productId => productId !== id) 
        : [...prev, id]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleEditProduct = (id: string) => {
    setEditingProduct(id);
    toast({
      title: "Edit Mode",
      description: "You're now editing the product. Save your changes when done.",
    });
  };

  const handleSaveProduct = () => {
    setEditingProduct(null);
    toast({
      title: "Changes Saved",
      description: "Your product changes have been saved successfully.",
    });
  };

  const handleDeleteProduct = (id: string) => {
    toast({
      title: "Product Deleted",
      description: "The product has been deleted from your store.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Store Management</h1>
          <p className="text-muted-foreground text-lg">Manage your store products and inventory</p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative sm:max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setSelectedTab("add-product")}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
            
            <Button 
              variant="default" 
              className="gap-2"
              onClick={() => setSelectedTab("add-product")}
            >
              <ShoppingBag className="h-4 w-4" />
              Import Products
            </Button>
          </div>
        </div>

        {/* Product Management Tabs */}
        <Tabs defaultValue="products" onValueChange={setSelectedTab} value={selectedTab}>
          <TabsList>
            <TabsTrigger value="products" className="gap-2">
              <Box className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="drafts" className="gap-2">
              <Archive className="h-4 w-4" />
              Drafts
            </TabsTrigger>
            <TabsTrigger value="add-product" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Product Inventory</CardTitle>
                  
                  {selectedProducts.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("Archive")}>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleBulkAction("Delete")}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <Checkbox 
                            checked={selectedProducts.length === products.length && products.length > 0}
                            onCheckedChange={selectAllProducts}
                          />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Inventory</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => toggleProductSelection(product.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium line-clamp-1">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge 
                              variant="outline" 
                              className="bg-green-500/10 text-green-600 border-green-200 dark:border-green-900"
                            >
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {editingProduct === product.id ? (
                              <Input 
                                type="number"
                                defaultValue={product.inventory}
                                className="w-20 h-8"
                              />
                            ) : (
                              <span>{product.inventory} in stock</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingProduct === product.id ? (
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">$</span>
                                <Input 
                                  type="number"
                                  defaultValue={product.price}
                                  className="w-20 h-8"
                                  step="0.01"
                                />
                              </div>
                            ) : (
                              <div>
                                <span className="font-medium">${product.price.toFixed(2)}</span>
                                {product.comparePrice && (
                                  <span className="text-sm text-muted-foreground line-through ml-2">
                                    ${product.comparePrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingProduct === product.id ? (
                              <Button 
                                size="sm" 
                                variant="default" 
                                onClick={handleSaveProduct}
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleEditProduct(product.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drafts Tab */}
          <TabsContent value="drafts" className="space-y-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Draft Products</CardTitle>
                <CardDescription>
                  Complete these product listings and publish them to your store
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {drafts.map((draft) => (
                    <Card key={draft.id} className="overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          {draft.image ? (
                            <img 
                              src={draft.image} 
                              alt={draft.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            </div>
                          )}
                        </AspectRatio>
                        
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 right-2"
                        >
                          Draft
                        </Badge>
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-medium line-clamp-1">{draft.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{draft.category}</p>
                        
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="font-semibold">${draft.price.toFixed(2)}</span>
                          {draft.comparePrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${draft.comparePrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Needs completion
                          </Badge>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                        <Button variant="default" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add-product" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>
                  Create a new product listing for your store
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Product Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Product Information</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="product-name" className="text-sm font-medium">
                          Product Name
                        </label>
                        <Input id="product-name" placeholder="Enter product name" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="product-description" className="text-sm font-medium">
                          Description
                        </label>
                        <textarea 
                          id="product-description" 
                          placeholder="Enter product description" 
                          className="w-full min-h-32 p-3 border rounded-md resize-y"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Media</h3>
                    
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <div className="mb-4">
                        <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                      </div>
                      <h4 className="text-sm font-medium mb-1">Drag and drop product images</h4>
                      <p className="text-xs text-muted-foreground mb-4">
                        PNG, JPG or GIF up to 5MB
                      </p>
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Pricing</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium">
                          Price
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" className="pl-10" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="compare-price" className="text-sm font-medium">
                          Compare-at Price
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="compare-price" type="number" min="0" step="0.01" placeholder="0.00" className="pl-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Inventory */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Inventory</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="sku" className="text-sm font-medium">
                          SKU (Stock Keeping Unit)
                        </label>
                        <Input id="sku" placeholder="SKU-123456" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="inventory" className="text-sm font-medium">
                          Inventory Quantity
                        </label>
                        <Input id="inventory" type="number" min="0" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button>
                  Add Product
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StoreManagement;
