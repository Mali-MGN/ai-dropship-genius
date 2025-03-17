
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIToolCard } from './AIToolCard';
import { getAllCategories, getToolsByCategory, getCategoryLabel, AITool, aiTools } from '@/data/aiTools';
import { Search } from 'lucide-react';

export function AIToolExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const categories = getAllCategories();
  
  // Filter tools based on search query
  const filterTools = (tools: AITool[]) => {
    if (!searchQuery.trim()) return tools;
    
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query) ||
      tool.features.some(feature => feature.toLowerCase().includes(query))
    );
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">AI Business Tools</CardTitle>
            <CardDescription>
              Discover AI-powered tools to automate and enhance your dropshipping business
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {searchQuery ? (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Search Results for "{searchQuery}"</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterTools(aiTools).map((tool) => (
                <AIToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {filterTools(aiTools).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tools found matching your search.</p>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue={categories[0]}>
            <TabsList className="w-full flex-wrap mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="flex-grow">
                  {getCategoryLabel(category)}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getToolsByCategory(category).map((tool) => (
                    <AIToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
                {getToolsByCategory(category).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tools found in this category.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
