
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AIProductPromptGenerator } from '@/components/ai-discovery/AIProductPromptGenerator';
import { ProductInsightCard } from '@/components/ai-discovery/ProductInsightCard';
import { PersonalizedProductFeed } from '@/components/ai-discovery/PersonalizedProductFeed';
import { AIToolExplorer } from '@/components/ai-discovery/AIToolExplorer';
import { StoreIntegrationStatus } from '@/components/ai-discovery/StoreIntegrationStatus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock product data for the PersonalizedProductFeed
const mockProducts = [
  {
    id: "1",
    name: "Eco-Friendly Water Bottle",
    image: "https://placehold.co/300x300",
    price: 24.99,
    comparePrice: 29.99,
    source: "EcoStore",
    rating: 4.7,
    trending: true,
    profit: 12.50,
    category: "Home & Kitchen",
    inStock: true,
    stockQuantity: 24
  },
  {
    id: "2",
    name: "Wireless Earbuds",
    image: "https://placehold.co/300x300",
    price: 89.99,
    comparePrice: 119.99,
    source: "TechGadgets",
    rating: 4.5,
    trending: true,
    profit: 35.00,
    category: "Electronics",
    inStock: true,
    stockQuantity: 5
  },
  {
    id: "3",
    name: "Smart Watch Series X",
    image: "https://placehold.co/300x300",
    price: 199.99,
    comparePrice: 249.99,
    source: "TechGadgets",
    rating: 4.8,
    trending: true,
    profit: 45.00,
    category: "Electronics",
    inStock: false,
    stockQuantity: 0
  }
];

const AIHub = () => {
  // Mock function for product import
  const handleProductImport = (id: string) => {
    console.log(`Importing product with ID: ${id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Product Hub</h1>
          <p className="text-muted-foreground">
            Use AI to discover trending products, get market insights, and find tools to grow your business
          </p>
        </div>

        <Tabs defaultValue="discovery" className="space-y-4">
          <TabsList>
            <TabsTrigger value="discovery">Product Discovery</TabsTrigger>
            <TabsTrigger value="tools">Business Tools</TabsTrigger>
            <TabsTrigger value="integrations">Store Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discovery" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ProductInsightCard 
                title="Sustainable Products"
                description="Eco-friendly products are showing strong growth with 68% of consumers willing to pay more for sustainable options."
                trend="upward"
                confidence={85}
                tags={["eco-friendly", "sustainable", "trending"]}
              />
              <div className="md:col-span-2">
                <PersonalizedProductFeed 
                  products={mockProducts}
                  loading={false}
                  onImport={handleProductImport}
                />
              </div>
            </div>
            
            <AIProductPromptGenerator />
          </TabsContent>
          
          <TabsContent value="tools">
            <AIToolExplorer />
          </TabsContent>

          <TabsContent value="integrations">
            <StoreIntegrationStatus />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AIHub;
