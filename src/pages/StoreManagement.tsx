
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Settings,
  Palette,
  Languages,
  RefreshCw,
  ClipboardList,
  Globe,
  Package,
  CheckCircle,
  AlertCircle,
  PlusCircle,
  Calendar,
  Clock
} from "lucide-react";

const StoreManagement = () => {
  const [selectedTab, setSelectedTab] = useState("design");
  const [syncStatus, setSyncStatus] = useState("idle"); // idle, syncing, success, error
  const { toast } = useToast();

  const handleSync = () => {
    setSyncStatus("syncing");
    
    // Simulate inventory sync
    setTimeout(() => {
      setSyncStatus("success");
      toast({
        title: "Inventory Synchronized",
        description: "Your inventory has been successfully synced with suppliers.",
      });
    }, 2000);
  };

  const sampleTasks = [
    { id: 1, title: "Update product descriptions", priority: "high", status: "pending", dueDate: "2023-10-25" },
    { id: 2, title: "Check inventory levels", priority: "medium", status: "completed", dueDate: "2023-10-22" },
    { id: 3, title: "Respond to customer inquiries", priority: "high", status: "pending", dueDate: "2023-10-23" },
    { id: 4, title: "Review marketing campaign results", priority: "low", status: "pending", dueDate: "2023-10-28" },
    { id: 5, title: "Process new orders", priority: "high", status: "pending", dueDate: "2023-10-23" },
  ];

  const storeThemes = [
    { id: "minimal", name: "Minimal", description: "Clean and modern design", preview: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=870" },
    { id: "bold", name: "Bold & Colorful", description: "Vibrant and eye-catching", preview: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=870" },
    { id: "elegant", name: "Elegant", description: "Sophisticated and luxurious", preview: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=870" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Store Management</h1>
          <p className="text-muted-foreground text-lg">Customize and manage your online store</p>
        </div>

        <Tabs defaultValue="design" onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="design" className="gap-2">
              <Palette className="h-4 w-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="localization" className="gap-2">
              <Globe className="h-4 w-4" />
              Localization
            </TabsTrigger>
          </TabsList>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Theme</CardTitle>
                <CardDescription>
                  Choose a theme for your online store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {storeThemes.map((theme) => (
                    <div 
                      key={theme.id} 
                      className="border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md"
                      onClick={() => {
                        toast({
                          title: "Theme Selected",
                          description: `${theme.name} theme has been applied to your store.`,
                        });
                      }}
                    >
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={theme.preview} 
                          alt={theme.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{theme.name}</h3>
                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Layout Customization</CardTitle>
                <CardDescription>
                  Customize your store layout and appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Featured Products Section</h3>
                      <p className="text-sm text-muted-foreground">Display featured products on the homepage</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Hero Banner</h3>
                      <p className="text-sm text-muted-foreground">Show hero banner at the top of your homepage</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Social Media Icons</h3>
                      <p className="text-sm text-muted-foreground">Display social media links in the footer</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Newsletter Signup</h3>
                      <p className="text-sm text-muted-foreground">Show newsletter signup form</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Sync</CardTitle>
                <CardDescription>
                  Synchronize your inventory with suppliers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button 
                    onClick={handleSync}
                    disabled={syncStatus === "syncing"}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                    {syncStatus === "syncing" ? "Syncing..." : "Sync Inventory"}
                  </Button>
                  
                  {syncStatus === "success" && (
                    <div className="flex items-center text-green-600 gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Last synced: Just now</span>
                    </div>
                  )}

                  {syncStatus === "error" && (
                    <div className="flex items-center text-red-600 gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>Sync failed. Please try again.</span>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Connected Suppliers</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">AliExpress</Badge>
                        <span className="text-sm">129 products</span>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Amazon</Badge>
                        <span className="text-sm">87 products</span>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Shopify</Badge>
                        <span className="text-sm">56 products</span>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Supplier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>
                  Configure how your inventory synchronizes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-sync inventory</h3>
                    <p className="text-sm text-muted-foreground">Automatically sync inventory every 24 hours</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Price updates</h3>
                    <p className="text-sm text-muted-foreground">Update prices when supplier prices change</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Stock alerts</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications for low stock</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-remove out of stock</h3>
                    <p className="text-sm text-muted-foreground">Automatically hide products that are out of stock</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Task Manager</CardTitle>
                  <CardDescription>
                    Manage your daily operational tasks
                  </CardDescription>
                </div>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Task
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {sampleTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`border rounded-lg p-4 ${
                          task.status === "completed" 
                            ? "bg-muted/50" 
                            : task.priority === "high" 
                              ? "border-red-200 dark:border-red-900"
                              : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {task.status === "completed" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className={`h-5 w-5 rounded-full border-2 ${
                                task.priority === "high" 
                                  ? "border-red-500" 
                                  : task.priority === "medium"
                                    ? "border-amber-500"
                                    : "border-blue-500"
                              }`} />
                            )}
                            <h3 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h3>
                          </div>
                          <Badge variant={
                            task.priority === "high" 
                              ? "destructive" 
                              : task.priority === "medium"
                                ? "default"
                                : "outline"
                          }>
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{task.dueDate}</span>
                          </div>
                          {task.status === "completed" && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Completed on 10/22/2023</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Localization Tab */}
          <TabsContent value="localization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
                <CardDescription>
                  Configure store languages and translations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://flagcdn.com/w40/us.png" alt="English" className="w-6 h-4 object-cover rounded-sm" />
                    <div>
                      <h3 className="font-medium">English</h3>
                      <p className="text-sm text-muted-foreground">Primary language</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>Primary</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://flagcdn.com/w40/es.png" alt="Spanish" className="w-6 h-4 object-cover rounded-sm" />
                    <div>
                      <h3 className="font-medium">Spanish</h3>
                      <p className="text-sm text-muted-foreground">20% translated</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://flagcdn.com/w40/fr.png" alt="French" className="w-6 h-4 object-cover rounded-sm" />
                    <div>
                      <h3 className="font-medium">French</h3>
                      <p className="text-sm text-muted-foreground">10% translated</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                  </div>
                </div>
                
                <Button variant="outline" className="gap-2 mt-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Language
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Currencies</CardTitle>
                <CardDescription>
                  Configure store currencies and exchange rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">USD - US Dollar ($)</h3>
                    <p className="text-sm text-muted-foreground">Primary currency</p>
                  </div>
                  <Button variant="outline" size="sm" disabled>Primary</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">EUR - Euro (€)</h3>
                    <p className="text-sm text-muted-foreground">Exchange rate: 0.92 EUR = 1 USD</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">GBP - British Pound (£)</h3>
                    <p className="text-sm text-muted-foreground">Exchange rate: 0.82 GBP = 1 USD</p>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                
                <Button variant="outline" className="gap-2 mt-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Currency
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StoreManagement;
