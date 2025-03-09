
import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ImportedProducts } from '@/components/dashboard/ImportedProducts';
import { FinancialStats } from '@/components/dashboard/FinancialStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
              <CardTitle>Financial Overview</CardTitle>
              <CardDescription>Your revenue and profits</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialStats />
            </CardContent>
          </Card>
          
          <ImportedProducts />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
