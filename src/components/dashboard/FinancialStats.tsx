
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FinancialSummary {
  id: string;
  year: number;
  month: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  order_count: number;
}

const getMonthName = (month: number) => {
  const date = new Date();
  date.setMonth(month - 1);
  return date.toLocaleString('default', { month: 'short' });
};

export const FinancialStats = () => {
  const [financialData, setFinancialData] = useState<FinancialSummary[]>([]);
  const [timeRange, setTimeRange] = useState("6");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFinancialData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        
        // Calculate the start date based on the selected time range
        const monthsToLookBack = parseInt(timeRange, 10);
        let startYear = currentYear;
        let startMonth = currentMonth - monthsToLookBack + 1;
        
        // Adjust year if we go back to previous year
        if (startMonth <= 0) {
          startYear--;
          startMonth += 12;
        }
        
        // Fetch financial summary data
        const { data, error } = await supabase
          .from('financial_summary')
          .select('*')
          .or(`year.gt.${startYear},and(year.eq.${startYear},month.gte.${startMonth})`)
          .order('year', { ascending: true })
          .order('month', { ascending: true });
        
        if (error) throw error;
        
        setFinancialData(data || []);
        
        // Calculate totals
        if (data && data.length > 0) {
          const revenue = data.reduce((sum, item) => sum + Number(item.total_revenue), 0);
          const profit = data.reduce((sum, item) => sum + Number(item.total_profit), 0);
          const orders = data.reduce((sum, item) => sum + item.order_count, 0);
          
          setTotalRevenue(revenue);
          setTotalProfit(profit);
          setTotalOrders(orders);
        }
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast({
          title: "Error",
          description: "Failed to load financial data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [user, timeRange]);

  // Format data for chart
  const chartData = financialData.map(item => ({
    name: `${getMonthName(item.month)} ${item.year}`,
    revenue: item.total_revenue,
    profit: item.total_profit,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Financial Overview</h2>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          description={`Last ${timeRange} months`}
        />
        <StatCard 
          title="Total Profit" 
          value={formatCurrency(totalProfit)}
          icon={<TrendingUp className="h-4 w-4" />}
          description={`Last ${timeRange} months`}
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders.toString()}
          icon={<ShoppingCart className="h-4 w-4" />}
          description={`Last ${timeRange} months`}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Revenue & Profit Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" />
                  <Bar dataKey="profit" name="Profit" fill="hsl(var(--green-500))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  {loading ? "Loading data..." : "No financial data available yet"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
