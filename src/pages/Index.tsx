
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  TrendingUp, 
  Package,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  UserPlus,
  BarChart,
  ChevronRight,
  ArrowUpRight,
  Wand2,
} from "lucide-react";

const revenueData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1900 },
  { name: "Mar", value: 2400 },
  { name: "Apr", value: 1500 },
  { name: "May", value: 2800 },
  { name: "Jun", value: 3200 },
  { name: "Jul", value: 3800 },
  { name: "Aug", value: 4200 },
  { name: "Sep", value: 3600 },
  { name: "Oct", value: 5100 },
  { name: "Nov", value: 5800 },
  { name: "Dec", value: 6200 },
];

const trendingProducts = [
  {
    id: "1",
    name: "Portable UV Sanitizer Box for Smartphones",
    image: "https://images.unsplash.com/photo-1567324216289-87c7c56173e5?auto=format&fit=crop&q=80&w=870",
    price: 24.99,
    comparePrice: 39.99,
    source: "AliExpress",
    rating: 4.7,
    trending: true,
    profit: 15.99,
    category: "Electronics"
  },
  {
    id: "2",
    name: "Smart LED Galaxy Star Projector",
    image: "https://images.unsplash.com/photo-1534047244771-b21532741da5?auto=format&fit=crop&q=80&w=870",
    price: 32.50,
    comparePrice: 49.99,
    source: "Amazon",
    rating: 4.8,
    trending: true,
    profit: 18.50,
    category: "Home Decor"
  },
  {
    id: "3",
    name: "Multifunctional Car Seat Gap Organizer",
    image: "https://images.unsplash.com/photo-1615753094413-c3b2f81ec6f1?auto=format&fit=crop&q=80&w=870",
    price: 19.99,
    comparePrice: 29.99,
    source: "AliExpress",
    rating: 4.5,
    trending: true,
    profit: 14.99,
    category: "Automotive"
  },
  {
    id: "4",
    name: "Magnetic Phone Charger Stand Holder",
    image: "https://images.unsplash.com/photo-1631281956016-3cdc1b2fe5fb?auto=format&fit=crop&q=80&w=870",
    price: 29.99,
    comparePrice: 44.99,
    source: "Amazon",
    rating: 4.6,
    trending: true,
    profit: 19.99,
    category: "Electronics"
  },
  {
    id: "5",
    name: "Collapsible Silicone Water Bottle",
    image: "https://images.unsplash.com/photo-1546839655-c9151848e2b7?auto=format&fit=crop&q=80&w=870",
    price: 14.99,
    comparePrice: 24.99,
    source: "eBay",
    rating: 4.3,
    trending: true,
    profit: 12.49,
    category: "Sports & Outdoors"
  },
];

const storeInsights = [
  { insight: "Adding a loyalty program could increase your repeat customers by 28%", priority: "High" },
  { insight: "Your top traffic source is Instagram - increase product posts for better conversion", priority: "Medium" },
  { insight: "Shipping costs are causing 32% of cart abandonments", priority: "High" },
  { insight: "Products with video content have 84% higher conversion rates", priority: "Medium" },
];

const Index = () => {
  const [importingIds, setImportingIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handleImportProduct = (id: string) => {
    setImportingIds((prev) => [...prev, id]);
    
    // Simulate import process
    setTimeout(() => {
      setImportingIds((prev) => prev.filter((item) => item !== id));
      toast({
        title: "Product Imported Successfully",
        description: "The product has been added to your store.",
      });
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-normal">
              <Wand2 className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back! Your dropshipping business is growing.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value="$24,832"
            change={12.5}
            icon={<DollarSign className="h-4 w-4" />}
            description="Last 30 days"
          />
          <StatCard
            title="Active Products"
            value="74"
            change={4.2}
            icon={<Package className="h-4 w-4" />}
            description="8 new this month"
          />
          <StatCard
            title="Orders"
            value="362"
            change={-2.4}
            icon={<ShoppingCart className="h-4 w-4" />}
            description="24 pending shipment"
          />
          <StatCard
            title="Customers"
            value="1,642"
            change={8.1}
            icon={<UserPlus className="h-4 w-4" />}
            description="142 new this month"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <AnalyticsChart
            title="Revenue Overview"
            description="Track your daily, weekly and monthly revenue"
            data={revenueData}
            className="lg:col-span-2"
          />

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                AI Insights
                <Badge variant="outline" className="ml-2 font-normal bg-primary/10 text-primary">
                  <Wand2 className="h-3 w-3 mr-1" />
                  4 New
                </Badge>
              </CardTitle>
              <CardDescription>
                AI-generated insights to grow your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storeInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5">
                      <BarChart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm">{insight.insight}</p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span className={`${insight.priority === "High" ? "text-destructive" : "text-amber-500"} font-medium`}>
                          {insight.priority} Priority
                        </span>
                        <ChevronRight className="h-3 w-3 ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trending Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI-Discovered Trending Products</h2>
            <Button variant="outline" size="sm" className="gap-1">
              View All
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[280px] max-w-[280px]"
                  onImport={handleImportProduct}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Recent Activities & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your store's latest events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Customer {i}</span> placed an order for <span className="font-medium">${(Math.random() * 100).toFixed(2)}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">2 hour{i > 1 ? "s" : ""} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">AI Tasks In Progress</CardTitle>
              <CardDescription>Automated tasks running for your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="font-medium">Optimizing product descriptions</div>
                    <div className="text-muted-foreground">68%</div>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="font-medium">Analyzing competitor prices</div>
                    <div className="text-muted-foreground">92%</div>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="font-medium">Generating email campaign</div>
                    <div className="text-muted-foreground">41%</div>
                  </div>
                  <Progress value={41} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="font-medium">Finding trending products</div>
                    <div className="text-muted-foreground">74%</div>
                  </div>
                  <Progress value={74} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
