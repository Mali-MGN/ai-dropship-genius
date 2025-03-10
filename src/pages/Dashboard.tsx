
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FinancialStats } from "@/components/dashboard/FinancialStats";
import { ImportedProducts } from "@/components/dashboard/ImportedProducts";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [averageOrderValue, setAverageOrderValue] = useState<number | null>(null);
  const [newUsersPercentageChange, setNewUsersPercentageChange] = useState<number>(0);
  const [newOrdersPercentageChange, setNewOrdersPercentageChange] = useState<number>(0);
  const [newRevenuePercentageChange, setNewRevenuePercentageChange] = useState<number>(0);
  const [newAOVPercentageChange, setNewAOVPercentageChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch total users - using auth.users instead of profiles table
        const { count: userCount, error: usersError } = await supabase
          .from('auth.users')
          .select('*', { count: 'exact', head: true });

        if (usersError) {
          console.error("Error fetching users:", usersError);
          // Fallback to a simpler query without count if the first one fails
          const { data: usersData, error: usersDataError } = await supabase
            .from('user_preferences')
            .select('user_id');
          
          if (usersDataError) throw usersDataError;
          setTotalUsers(usersData?.length || 0);
        } else {
          setTotalUsers(userCount || 0);
        }

        // Fetch total orders
        const { data: orders, error: ordersError } = await supabase
          .from('user_orders')
          .select('id');

        if (ordersError) throw ordersError;
        setTotalOrders(orders?.length || 0);

        // Fetch total revenue
        const { data: revenue, error: revenueError } = await supabase
          .from('user_orders')
          .select('amount');

        if (revenueError) throw revenueError;
        const totalRevenueValue = revenue?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0;
        setTotalRevenue(totalRevenueValue);

        // Calculate average order value
        const averageValue = orders?.length ? totalRevenueValue / orders.length : 0;
        setAverageOrderValue(averageValue);

        // Fetch previous month's data for comparison
        const currentDate = new Date();
        const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastMonthEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        // Fetch previous month's users (using a simpler approach)
        const { data: prevUsers, error: prevUsersError } = await supabase
          .from('user_preferences')
          .select('user_id')
          .gte('created_at', lastMonthStartDate.toISOString())
          .lte('created_at', lastMonthEndDate.toISOString());

        if (prevUsersError) console.error("Error fetching previous month's users:", prevUsersError);

        // Fetch previous month's orders
        const { data: prevOrders, error: prevOrdersError } = await supabase
          .from('user_orders')
          .select('id')
          .gte('created_at', lastMonthStartDate.toISOString())
          .lte('created_at', lastMonthEndDate.toISOString());

        if (prevOrdersError) console.error("Error fetching previous month's orders:", prevOrdersError);

        // Fetch previous month's revenue
        const { data: prevRevenue, error: prevRevenueError } = await supabase
          .from('user_orders')
          .select('amount')
          .gte('created_at', lastMonthStartDate.toISOString())
          .lte('created_at', lastMonthEndDate.toISOString());

        if (prevRevenueError) console.error("Error fetching previous month's revenue:", prevRevenueError);

        const prevTotalRevenueValue = prevRevenue?.reduce((acc, order) => acc + (order.amount || 0), 0) || 0;
        const prevTotalOrders = prevOrders?.length || 0;
        const prevAverageOrderValue = prevTotalOrders ? prevTotalRevenueValue / prevTotalOrders : 0;

        // Calculate percentage changes
        const currentUsers = totalUsers || 0;
        const previousMonthUsers = prevUsers?.length || 0;
        setNewUsersPercentageChange(calculatePercentageChange(currentUsers, previousMonthUsers));
        setNewOrdersPercentageChange(calculatePercentageChange(orders?.length || 0, prevTotalOrders));
        setNewRevenuePercentageChange(calculatePercentageChange(totalRevenueValue, prevTotalRevenueValue));
        setNewAOVPercentageChange(calculatePercentageChange(averageValue, prevAverageOrderValue));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const calculatePercentageChange = (current: number, previous: number): number => {
    if (!previous) return 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Track key metrics and gain insights</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Loading dashboard data...
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Users"
                value={totalUsers?.toString() || "0"}
                icon={Users}
                percentageChange={newUsersPercentageChange}
                positiveChange={newUsersPercentageChange >= 0}
              />
              <MetricCard
                title="Total Orders"
                value={totalOrders?.toString() || "0"}
                icon={ShoppingCart}
                percentageChange={newOrdersPercentageChange}
                positiveChange={newOrdersPercentageChange >= 0}
              />
              <MetricCard
                title="Total Revenue"
                value={`$${totalRevenue?.toFixed(2) || "0.00"}`}
                icon={DollarSign}
                percentageChange={newRevenuePercentageChange}
                positiveChange={newRevenuePercentageChange >= 0}
              />
              <MetricCard
                title="Average Order Value"
                value={`$${averageOrderValue?.toFixed(2) || "0.00"}`}
                icon={Package}
                percentageChange={newAOVPercentageChange}
                positiveChange={newAOVPercentageChange >= 0}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FinancialStats />
              <ImportedProducts />
            </div>

            <RecentSales />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
