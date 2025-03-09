
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatCard } from '@/components/dashboard/StatCard';
import { FinancialStats } from '@/components/dashboard/FinancialStats';
import { 
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Users,
  CreditCard,
  Truck,
  RefreshCw,
  LineChart,
  PieChart,
  BarChart,
  ListFilter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function Analytics() {
  const [dateRange, setDateRange] = useState("30");
  
  // Sample data for the analytics charts
  const salesData = [
    { name: 'Jan', value: 3000 },
    { name: 'Feb', value: 4500 },
    { name: 'Mar', value: 3800 },
    { name: 'Apr', value: 5200 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 6300 },
    { name: 'Aug', value: 5900 },
    { name: 'Sep', value: 6800 },
    { name: 'Oct', value: 7200 },
    { name: 'Nov', value: 6900 },
    { name: 'Dec', value: 8000 }
  ];
  
  const visitorData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 15000 },
    { name: 'Mar', value: 13500 },
    { name: 'Apr', value: 16200 },
    { name: 'May', value: 15800 },
    { name: 'Jun', value: 17500 },
    { name: 'Jul', value: 19300 },
    { name: 'Aug', value: 18900 },
    { name: 'Sep', value: 21800 },
    { name: 'Oct', value: 23200 },
    { name: 'Nov', value: 22900 },
    { name: 'Dec', value: 25000 }
  ];
  
  const conversionData = [
    { name: 'Jan', value: 2.5 },
    { name: 'Feb', value: 3.0 },
    { name: 'Mar', value: 2.8 },
    { name: 'Apr', value: 3.2 },
    { name: 'May', value: 3.0 },
    { name: 'Jun', value: 3.1 },
    { name: 'Jul', value: 3.3 },
    { name: 'Aug', value: 3.1 },
    { name: 'Sep', value: 3.4 },
    { name: 'Oct', value: 3.5 },
    { name: 'Nov', value: 3.3 },
    { name: 'Dec', value: 3.8 }
  ];
  
  // Top products data
  const topProducts = [
    { name: "Wireless Earbuds", revenue: 24500, orders: 520, conversion: 4.2 },
    { name: "Portable Charger", revenue: 18700, orders: 415, conversion: 3.8 },
    { name: "Smart Watch", revenue: 17900, orders: 380, conversion: 3.5 },
    { name: "LED String Lights", revenue: 16400, orders: 610, conversion: 5.2 },
    { name: "Canvas Backpack", revenue: 15200, orders: 340, conversion: 3.0 },
  ];
  
  // Recent orders data
  const recentOrders = [
    { id: "#ORD-5521", customer: "John Smith", date: "2025-03-08", amount: 129.99, status: "delivered" },
    { id: "#ORD-5520", customer: "Sarah Johnson", date: "2025-03-08", amount: 79.95, status: "processing" },
    { id: "#ORD-5519", customer: "Michael Davis", date: "2025-03-07", amount: 54.99, status: "delivered" },
    { id: "#ORD-5518", customer: "Emily Wilson", date: "2025-03-07", amount: 199.50, status: "shipped" },
    { id: "#ORD-5517", customer: "Robert Brown", date: "2025-03-06", amount: 45.75, status: "delivered" },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Revenue" 
            value="$85,240.45" 
            change={15.3}
            description="vs. previous period"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard 
            title="Orders" 
            value="2,456" 
            change={8.2}
            description="vs. previous period"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <StatCard 
            title="Visitors" 
            value="152,854" 
            change={12.5}
            description="vs. previous period"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard 
            title="Conversion Rate" 
            value="3.2%" 
            change={-0.4}
            description="vs. previous period"
            icon={<ArrowUpRight className="h-4 w-4" />}
          />
        </div>
        
        {/* Financial Statistics (Moved from Dashboard) */}
        <FinancialStats />
        
        {/* Chart Tabs */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue" className="gap-2">
              <LineChart className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="visitors" className="gap-2">
              <Users className="h-4 w-4" />
              Visitors
            </TabsTrigger>
            <TabsTrigger value="conversion" className="gap-2">
              <BarChart className="h-4 w-4" />
              Conversion
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>
                  Daily revenue for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart data={salesData} title="" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visitors" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Website Visitors</CardTitle>
                <CardDescription>
                  Daily visitors for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart data={visitorData} title="" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="conversion" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>
                  Daily conversion rate for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsChart data={conversionData} title="" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Top Products and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Performing Products</CardTitle>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>
              <CardDescription>
                Products with the highest revenue in selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {topProducts.map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{i + 1}.</div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.orders} orders • {product.conversion}% conversion</div>
                        </div>
                      </div>
                      <div className="font-semibold">${product.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-muted-foreground">
                      <th className="pb-3 pl-2">Order</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3 pr-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-3 pl-2">
                          <div className="font-medium">{order.id}</div>
                        </td>
                        <td className="py-3">
                          <div>{order.customer}</div>
                        </td>
                        <td className="py-3">
                          <div>{order.date}</div>
                        </td>
                        <td className="py-3">
                          <div>${order.amount}</div>
                        </td>
                        <td className="py-3 pr-2">
                          <Badge variant={
                            order.status === "delivered" ? "outline" : 
                            order.status === "processing" ? "secondary" : 
                            "default"
                          }>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Button variant="outline" className="w-full">View All Orders</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

export default Analytics;
