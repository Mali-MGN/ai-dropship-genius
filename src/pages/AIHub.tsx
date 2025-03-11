
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AIProductPromptGenerator } from '@/components/ai-discovery/AIProductPromptGenerator';
import { ProductInsightCard } from '@/components/ai-discovery/ProductInsightCard';
import { PersonalizedProductFeed } from '@/components/ai-discovery/PersonalizedProductFeed';
import { AIToolExplorer } from '@/components/ai-discovery/AIToolExplorer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AIHub = () => {
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
          </TabsList>
          
          <TabsContent value="discovery" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ProductInsightCard />
              <PersonalizedProductFeed className="md:col-span-2" />
            </div>
            
            <AIProductPromptGenerator />
          </TabsContent>
          
          <TabsContent value="tools">
            <AIToolExplorer />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AIHub;
