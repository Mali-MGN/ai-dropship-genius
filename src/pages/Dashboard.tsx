
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';

export function Dashboard() {
  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Revenue" 
            value="$5,231.89" 
            change="+12.5%" 
            trend="up" 
            description="vs. last month"
          />
          <StatCard 
            title="Active Products" 
            value="24" 
            change="+3" 
            trend="up" 
            description="new this week"
          />
          <StatCard 
            title="Conversion Rate" 
            value="3.2%" 
            change="-0.4%" 
            trend="down" 
            description="vs. last month"
          />
          <StatCard 
            title="Profit Margin" 
            value="28.5%" 
            change="+2.1%" 
            trend="up" 
            description="vs. last month"
          />
        </div>
        
        {/* Analytics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart />
          </CardContent>
        </Card>
        
        {/* Top Products */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProductCard 
              title="Wireless Earbuds" 
              price={49.99}
              imageUrl="/placeholder.svg"
              sales={142}
              profit={17.50}
              inventory={89}
            />
            <ProductCard 
              title="Smart Watch" 
              price={129.99}
              imageUrl="/placeholder.svg"
              sales={98}
              profit={42.30}
              inventory={32}
            />
            <ProductCard 
              title="Portable Charger" 
              price={34.99}
              imageUrl="/placeholder.svg"
              sales={87}
              profit={12.25}
              inventory={112}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
