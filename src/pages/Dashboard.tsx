
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/utils';

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  BarChart3,
  CreditCard,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const firstName = user?.email?.split('@')[0] || 'there';
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    netProfit: 0,
    productCount: 0,
    revenueChange: 0,
    ordersChange: 0,
    profitChange: 0,
    productChange: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get financial summary for current month
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        
        // Get financial summary for current and previous month
        const { data: financialData, error: financialError } = await supabase
          .from('financial_summary')
          .select('*')
          .or(`(year.eq.${currentYear},month.eq.${currentMonth}),(year.eq.${lastMonthYear},month.eq.${lastMonth})`)
          .order('year', { ascending: false })
          .order('month', { ascending: false });
        
        if (financialError) throw financialError;
        
        const currentMonthData = financialData?.find(d => d.year === currentYear && d.month === currentMonth) || {
          total_revenue: 0,
          total_profit: 0,
          order_count: 0
        };
        
        const lastMonthData = financialData?.find(d => d.year === lastMonthYear && d.month === lastMonth) || {
          total_revenue: 0,
          total_profit: 0,
          order_count: 0
        };
        
        // Calculate percentage changes
        const calcPercentChange = (current, previous) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return ((current - previous) / previous) * 100;
        };
        
        // Get product count from imported products
        const importedProductIds = JSON.parse(localStorage.getItem("importedProducts") || "[]");
        const prevMonthProductIds = JSON.parse(localStorage.getItem("prevMonthProducts") || "[]");
        
        const stats = {
          totalRevenue: currentMonthData.total_revenue || 0,
          totalOrders: currentMonthData.order_count || 0,
          netProfit: currentMonthData.total_profit || 0,
          productCount: importedProductIds.length,
          revenueChange: calcPercentChange(currentMonthData.total_revenue, lastMonthData.total_revenue),
          ordersChange: calcPercentChange(currentMonthData.order_count, lastMonthData.order_count),
          profitChange: calcPercentChange(currentMonthData.total_profit, lastMonthData.total_profit),
          productChange: calcPercentChange(importedProductIds.length, prevMonthProductIds.length)
        };
        
        setDashboardStats(stats);
        
        // Fetch recent activity (notifications, orders, etc.)
        const { data: activityData, error: activityError } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (activityError) throw activityError;
        setRecentActivity(activityData || []);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Set up a realtime subscription for notifications
    const notificationsChannel = supabase
      .channel('dashboard-notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: user ? `user_id=eq.${user.id}` : undefined
      }, (payload) => {
        setRecentActivity(prev => [payload.new, ...prev.slice(0, 2)]);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [user, toast]);

  // Convert timestamp to relative time (e.g., "2 hours ago")
  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  // Get appropriate icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_status':
        return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case 'product':
        return <Package className="h-5 w-5 text-primary" />;
      default:
        return <BarChart3 className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome, {firstName}!</h1>
          <p className="text-muted-foreground">Here's an overview of your dropshipping business</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(dashboardStats.totalRevenue)}
            change={dashboardStats.revenueChange}
            description="vs. previous month"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            title="Total Orders"
            value={dashboardStats.totalOrders.toString()}
            change={dashboardStats.ordersChange}
            description="vs. previous month"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <StatCard
            title="Net Profit"
            value={formatCurrency(dashboardStats.netProfit)}
            change={dashboardStats.profitChange}
            description="vs. previous month"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Products"
            value={dashboardStats.productCount.toString()}
            change={dashboardStats.productChange}
            description="vs. previous month"
            icon={<Package className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Shortcuts to key features</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link to="/product-discovery">
                <Card className="col-span-1 cursor-pointer hover:bg-muted/50">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Package className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Find Products</h3>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/orders">
                <Card className="col-span-1 cursor-pointer hover:bg-muted/50">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Manage Orders</h3>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/analytics">
                <Card className="col-span-1 cursor-pointer hover:bg-muted/50">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">View Analytics</h3>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/customers">
                <Card className="col-span-1 cursor-pointer hover:bg-muted/50">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Manage Customers</h3>
                  </CardContent>
                </Card>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-4">
                  <BarChart3 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {getNotificationIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{getRelativeTime(activity.created_at)}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
