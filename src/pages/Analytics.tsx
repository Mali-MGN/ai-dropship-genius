
import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  LineChart,
  BarChart,
  ListFilter,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

function Analytics() {
  const [dateRange, setDateRange] = useState("30");
  const [statsData, setStatsData] = useState({
    revenue: 0,
    orders: 0,
    visitors: 0,
    conversionRate: 0,
    revenueChange: 0,
    ordersChange: 0,
    visitorsChange: 0,
    conversionChange: 0
  });
  const [chartData, setChartData] = useState({
    revenue: [],
    visitors: [],
    conversion: []
  });
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch financial summary data for charts
        const { data: financialData, error: financialError } = await supabase
          .from('financial_summary')
          .select('*')
          .order('year', { ascending: true })
          .order('month', { ascending: true });
        
        if (financialError) throw financialError;
        
        if (financialData && financialData.length > 0) {
          // Process data for charts
          const revenueData = financialData.map(item => ({
            name: `${getMonthName(item.month)} ${item.year}`,
            value: item.total_revenue
          }));
          
          // For this demo, we'll generate visitor data and conversion rate based on orders
          const visitorsData = financialData.map(item => ({
            name: `${getMonthName(item.month)} ${item.year}`,
            value: item.order_count * Math.floor(Math.random() * 30) + 20
          }));
          
          const conversionData = financialData.map((item, index) => ({
            name: `${getMonthName(item.month)} ${item.year}`,
            value: item.order_count > 0 && visitorsData[index].value > 0 
              ? ((item.order_count / visitorsData[index].value) * 100).toFixed(1)
              : 0
          }));
          
          setChartData({
            revenue: revenueData,
            visitors: visitorsData,
            conversion: conversionData
          });
          
          // Calculate totals and changes
          const currentPeriodData = financialData.slice(-parseInt(dateRange)/30 || -1);
          const previousPeriodData = financialData.slice(-parseInt(dateRange)/15 || -2, -parseInt(dateRange)/30 || -1);
          
          const currentRevenue = currentPeriodData.reduce((sum, item) => sum + Number(item.total_revenue), 0);
          const previousRevenue = previousPeriodData.reduce((sum, item) => sum + Number(item.total_revenue), 0);
          
          const currentOrders = currentPeriodData.reduce((sum, item) => sum + item.order_count, 0);
          const previousOrders = previousPeriodData.reduce((sum, item) => sum + item.order_count, 0);
          
          const currentVisitors = currentPeriodData.reduce((sum, item, index) => {
            const visitorData = visitorsData.find(v => v.name === `${getMonthName(item.month)} ${item.year}`);
            return sum + (visitorData ? visitorData.value : 0);
          }, 0);
          
          const previousVisitors = previousPeriodData.reduce((sum, item, index) => {
            const visitorData = visitorsData.find(v => v.name === `${getMonthName(item.month)} ${item.year}`);
            return sum + (visitorData ? visitorData.value : 0);
          }, 0);
          
          const currentConversion = currentOrders > 0 && currentVisitors > 0 
            ? (currentOrders / currentVisitors) * 100 
            : 0;
            
          const previousConversion = previousOrders > 0 && previousVisitors > 0 
            ? (previousOrders / previousVisitors) * 100 
            : 0;
          
          // Calculate percentage changes
          const calcPercentChange = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
          };
          
          setStatsData({
            revenue: currentRevenue,
            orders: currentOrders,
            visitors: currentVisitors,
            conversionRate: currentConversion,
            revenueChange: calcPercentChange(currentRevenue, previousRevenue),
            ordersChange: calcPercentChange(currentOrders, previousOrders),
            visitorsChange: calcPercentChange(currentVisitors, previousVisitors),
            conversionChange: calcPercentChange(currentConversion, previousConversion)
          });
        }
        
        // Fetch recent orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('user_orders')
          .select(`
            id,
            order_id,
            customer_name,
            order_date,
            amount,
            status
          `)
          .order('order_date', { ascending: false })
          .limit(5);
        
        if (ordersError) throw ordersError;
        setRecentOrders(ordersData || []);
        
        // Get product data for top products
        // For simplicity, we'll use the same data as shown in the ImportedProducts component
        const importedProductIds = JSON.parse(localStorage.getItem("importedProducts") || "[]");
        
        if (importedProductIds.length > 0) {
          const { data: productsData, error: productsError } = await supabase
            .from("scraped_products")
            .select("*")
            .in("id", importedProductIds);
            
          if (productsError) throw productsError;
          
          // Join with orders data to get revenue and orders count
          const { data: productOrdersData, error: productOrdersError } = await supabase
            .from('user_orders')
            .select('product_id, amount')
            .in('product_id', importedProductIds);
            
          if (productOrdersError) throw productOrdersError;
          
          // Calculate revenue and orders per product
          const productStats = productsData.map(product => {
            const productOrders = productOrdersData?.filter(order => order.product_id === product.id) || [];
            const revenue = productOrders.reduce((sum, order) => sum + order.amount, 0);
            
            return {
              name: product.name,
              revenue: revenue,
              orders: productOrders.length,
              conversion: Math.random() * 3 + 2 // Random conversion rate for demo
            };
          });
          
          // Sort by revenue
          productStats.sort((a, b) => b.revenue - a.revenue);
          setTopProducts(productStats.slice(0, 5));
        }
        
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [user, dateRange, toast]);
  
  // Helper function to get month name
  const getMonthName = (month) => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleString('default', { month: 'short' });
  };

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
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Revenue" 
            value={formatCurrency(statsData.revenue)} 
            change={statsData.revenueChange}
            description="vs. previous period"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard 
            title="Orders" 
            value={statsData.orders.toString()} 
            change={statsData.ordersChange}
            description="vs. previous period"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <StatCard 
            title="Visitors" 
            value={statsData.visitors.toString()} 
            change={statsData.visitorsChange}
            description="vs. previous period"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard 
            title="Conversion Rate" 
            value={`${statsData.conversionRate.toFixed(1)}%`} 
            change={statsData.conversionChange}
            description="vs. previous period"
            icon={<ArrowUpRight className="h-4 w-4" />}
          />
        </div>
        
        {/* Financial Statistics */}
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
                  Monthly revenue for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : chartData.revenue.length > 0 ? (
                  <AnalyticsChart data={chartData.revenue} title="" />
                ) : (
                  <div className="flex justify-center items-center h-[300px]">
                    <p className="text-muted-foreground">No revenue data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visitors" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Website Visitors</CardTitle>
                <CardDescription>
                  Monthly visitors for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : chartData.visitors.length > 0 ? (
                  <AnalyticsChart data={chartData.visitors} title="" />
                ) : (
                  <div className="flex justify-center items-center h-[300px]">
                    <p className="text-muted-foreground">No visitor data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="conversion" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>
                  Monthly conversion rate for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : chartData.conversion.length > 0 ? (
                  <AnalyticsChart data={chartData.conversion} title="" />
                ) : (
                  <div className="flex justify-center items-center h-[300px]">
                    <p className="text-muted-foreground">No conversion data available</p>
                  </div>
                )}
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
                Products with the highest revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : topProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No product data available</p>
                  <p className="text-sm">Import products and place orders to see data here</p>
                </div>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {topProducts.map((product, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="font-medium">{i + 1}.</div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.orders} orders • {product.conversion.toFixed(1)}% conversion</div>
                          </div>
                        </div>
                        <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
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
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No orders found</p>
                  <p className="text-sm">Place orders to see data here</p>
                </div>
              ) : (
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-t border-border">
                          <td className="py-3 pl-2">
                            <div className="font-medium">{order.order_id}</div>
                          </td>
                          <td className="py-3">
                            <div>{order.customer_name}</div>
                          </td>
                          <td className="py-3">
                            <div>{new Date(order.order_date).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3">
                            <div>{formatCurrency(order.amount)}</div>
                          </td>
                          <td className="py-3 pr-2">
                            <Badge variant={
                              order.status === "delivered" ? "outline" : 
                              order.status === "processing" ? "secondary" : 
                              order.status === "shipped" ? "default" :
                              order.status === "cancelled" ? "destructive" :
                              "outline"
                            }>
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/orders'}>View All Orders</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

export default Analytics;
