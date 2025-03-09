
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProductCard } from '@/components/dashboard/ProductCard';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { ImportedProducts } from '@/components/dashboard/ImportedProducts';

function Dashboard() {
  // Sample data for the analytics chart
  const analyticsData = [
    { name: 'Jan', value: 3000 },
    { name: 'Feb', value: 4500 },
    { name: 'Mar', value: 3800 },
    { name: 'Apr', value: 5200 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 5500 }
  ];

  // Sample product data with improved data
  const products = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      price: 49.99,
      comparePrice: 69.99,
      source: 'AliExpress',
      rating: 4.5,
      trending: true,
      profit: 17.50,
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      price: 129.99,
      comparePrice: 149.99,
      source: 'Amazon',
      rating: 4.7,
      trending: false,
      profit: 42.30,
      category: 'Electronics'
    },
    {
      id: '3',
      name: 'Portable Charger 10000mAh',
      price: 34.99,
      comparePrice: 44.99,
      source: 'Shopify',
      rating: 4.2,
      trending: false,
      profit: 12.25,
      category: 'Electronics'
    }
  ];

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Revenue" 
            value="$5,231.89" 
            change={12.5}
            description="vs. last month"
          />
          <StatCard 
            title="Active Products" 
            value="24" 
            change={3}
            description="new this week"
          />
          <StatCard 
            title="Conversion Rate" 
            value="3.2%" 
            change={-0.4}
            description="vs. last month"
          />
          <StatCard 
            title="Profit Margin" 
            value="28.5%" 
            change={2.1}
            description="vs. last month"
          />
        </div>
        
        {/* Analytics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsChart title="Monthly Performance" data={analyticsData} />
          </CardContent>
        </Card>
        
        {/* Top Products */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onImport={() => console.log(`Importing product ${product.id}`)}
              />
            ))}
          </div>
        </div>
        
        {/* Imported Products */}
        <div className="mt-8">
          <ImportedProducts />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
