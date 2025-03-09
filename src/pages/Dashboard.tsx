
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useAuth } from '@/context/AuthContext';

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
  const firstName = user?.email?.split('@')[0] || 'there';

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
            value="$3,240.45"
            change={12.5}
            description="vs. previous month"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            title="Total Orders"
            value="156"
            change={8.2}
            description="vs. previous month"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <StatCard
            title="Net Profit"
            value="$1,437.80"
            change={-2.3}
            description="vs. previous month"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Products"
            value="23"
            change={4}
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
              <Card className="col-span-1 cursor-pointer hover:bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Package className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="font-medium">Find Products</h3>
                </CardContent>
              </Card>
              <Card className="col-span-1 cursor-pointer hover:bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="font-medium">Place Orders</h3>
                </CardContent>
              </Card>
              <Card className="col-span-1 cursor-pointer hover:bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="font-medium">View Analytics</h3>
                </CardContent>
              </Card>
              <Card className="col-span-1 cursor-pointer hover:bg-muted/50">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <h3 className="font-medium">Manage Customers</h3>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Product Imported</p>
                  <p className="text-xs text-muted-foreground">Wireless Earbuds added to inventory</p>
                </div>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New Order Received</p>
                  <p className="text-xs text-muted-foreground">Order #2345 for Canvas Backpack</p>
                </div>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
              
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment Received</p>
                  <p className="text-xs text-muted-foreground">$129.99 for Order #2342</p>
                </div>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
