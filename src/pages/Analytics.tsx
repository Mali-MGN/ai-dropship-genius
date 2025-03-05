
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ArrowRight,
  BarChart2,
  LineChart,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/StatCard";

const Analytics = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button variant="outline" size="sm" className="pl-3 pr-9">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 Days
              </Button>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(24895.65)}
            icon={<DollarSign className="h-4 w-4" />}
            change={12.5}
          />
          
          <StatCard
            title="Total Orders"
            value={formatNumber(432)}
            icon={<ShoppingBag className="h-4 w-4" />}
            change={-3.2}
          />
          
          <StatCard
            title="New Customers"
            value={formatNumber(89)}
            icon={<Users className="h-4 w-4" />}
            change={8.1}
          />
          
          <StatCard
            title="Conversion Rate"
            value="3.2%"
            icon={<TrendingUp className="h-4 w-4" />}
            change={1.2}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Revenue Overview</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Daily</Button>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs bg-accent">Weekly</Button>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Monthly</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <LineChart className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                  <p className="text-xs text-muted-foreground">Showing data for the last 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <PieChart className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Category distribution chart will be displayed here</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <div className="text-sm">Electronics (42%)</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-secondary"></div>
                  <div className="text-sm">Fashion (28%)</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="text-sm">Home (15%)</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="text-sm">Others (15%)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Orders by Store</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <BarChart2 className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Store distribution chart will be displayed here</p>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                    <div className="text-sm">TechGadgetPro</div>
                  </div>
                  <div className="text-sm font-medium">142 orders</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-secondary"></div>
                    <div className="text-sm">FashionTrends</div>
                  </div>
                  <div className="text-sm font-medium">98 orders</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="text-sm">HomeEssentials</div>
                  </div>
                  <div className="text-sm font-medium">76 orders</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Wireless Bluetooth Earbuds</TableCell>
                    <TableCell>142</TableCell>
                    <TableCell>{formatCurrency(8519.58)}</TableCell>
                    <TableCell>4.8%</TableCell>
                    <TableCell className="text-emerald-600">+12.5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Smart Watch Series 5</TableCell>
                    <TableCell>98</TableCell>
                    <TableCell>{formatCurrency(19599.02)}</TableCell>
                    <TableCell>3.2%</TableCell>
                    <TableCell className="text-emerald-600">+8.7%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Portable Power Bank 20000mAh</TableCell>
                    <TableCell>87</TableCell>
                    <TableCell>{formatCurrency(4345.65)}</TableCell>
                    <TableCell>5.1%</TableCell>
                    <TableCell className="text-red-600">-2.3%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Noise Cancelling Headphones</TableCell>
                    <TableCell>76</TableCell>
                    <TableCell>{formatCurrency(11399.24)}</TableCell>
                    <TableCell>2.9%</TableCell>
                    <TableCell className="text-emerald-600">+15.2%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Smartphone Camera Lens Kit</TableCell>
                    <TableCell>65</TableCell>
                    <TableCell>{formatCurrency(1949.35)}</TableCell>
                    <TableCell>3.8%</TableCell>
                    <TableCell className="text-emerald-600">+5.9%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;
