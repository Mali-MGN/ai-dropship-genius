
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, BarChart4, AlertCircle, CalendarClock } from "lucide-react";
import { RetailerGrid } from "@/components/product-discovery/RetailerGrid";
import { IntegrationStatus } from "@/components/product-discovery/IntegrationStatus";
import { ProductFilters } from "@/components/product-discovery/ProductFilters";
import { ProductGrid } from "@/components/product-discovery/ProductGrid";
import { AIRecommendedProducts } from "@/components/product-discovery/AIRecommendedProducts";
import { useProductDiscovery } from "@/hooks/useProductDiscovery";
import { retailers } from "@/data/retailers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export default function ProductDiscovery() {
  const {
    filteredProducts,
    aiRecommendedProducts,
    topSellingProducts,
    projectedTrends,
    loading,
    aiLoading,
    searchQuery,
    currentTab,
    sortOrder,
    importing,
    exporting,
    selectedCategory,
    categories,
    selectedRetailer,
    exportFormat,
    setSelectedRetailer,
    setExportFormat,
    handleTabChange,
    handleSearch,
    handleSort,
    handleCategoryChange,
    handleImport,
    handleExport
  } = useProductDiscovery();

  useEffect(() => {
    // Notify users when the page loads successfully
    toast({
      title: "Product Discovery Loaded",
      description: "Explore trending products to add to your store.",
    });
  }, []);

  const hasSelectedRetailer = !!selectedRetailer;

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Product Discovery</h1>
          <p className="text-muted-foreground text-lg">Find trending products to add to your store - Updated {todayDate}</p>
        </div>
        
        {!hasSelectedRetailer && (
          <Alert variant="default" className="bg-amber-50 border-amber-200 mb-4">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Select a retailer</AlertTitle>
            <AlertDescription className="text-amber-700">
              Please select a retailer below to start discovering products.
            </AlertDescription>
          </Alert>
        )}
        
        <RetailerGrid 
          retailers={retailers}
          selectedRetailer={selectedRetailer}
          onSelectRetailer={setSelectedRetailer}
        />
        
        {hasSelectedRetailer && (
          <IntegrationStatus />
        )}
        
        {hasSelectedRetailer && (
          <>
            <div className="grid grid-cols-1 gap-6">
              <AIRecommendedProducts
                title="Today's Trending Products"
                description="Hot products trending right now based on market data and customer behavior"
                products={aiRecommendedProducts}
                loading={aiLoading}
                onImport={handleImport}
                onExport={handleExport}
                importing={importing}
                exporting={exporting}
                selectedRetailer={selectedRetailer}
                retailers={retailers}
              />
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Projected Trends</CardTitle>
                      <CardDescription>
                        Product categories expected to grow in popularity in the coming months
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      <CalendarClock className="h-3.5 w-3.5 mr-1 text-blue-500" />
                      Future Insights
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projectedTrends.map((trend, index) => (
                      <Card key={index} className="border-l-4" style={{ borderLeftColor: trend.color }}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-1">{trend.category}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{trend.description}</p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className={`h-4 w-4 mr-1 text-${trend.color}`} />
                            <span className={`text-sm font-medium text-${trend.color}`}>
                              {trend.growthRate}% projected growth
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <AIRecommendedProducts
                title="Top Selling Products"
                description="Best performing products based on sales and reviews"
                products={topSellingProducts}
                loading={loading}
                onImport={handleImport}
                onExport={handleExport}
                importing={importing}
                exporting={exporting}
                selectedRetailer={selectedRetailer}
                retailers={retailers}
              />
            </div>
          
            <ProductFilters 
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              onSortChange={handleSort}
              onCategoryChange={handleCategoryChange}
              sortOrder={sortOrder}
              exportFormat={exportFormat}
              selectedCategory={selectedCategory}
              categories={categories}
              onExportFormatChange={setExportFormat}
            />
            
            <Tabs defaultValue="trending" value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="trending">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trending Products
                </TabsTrigger>
                <TabsTrigger value="profit">
                  <DollarSign className="mr-2 h-4 w-4" />
                  High Profit Margin
                </TabsTrigger>
                <TabsTrigger value="competitors">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Competitor Insights
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="trending" className="space-y-4">
                <ProductGrid
                  title="Trending Products"
                  description="Hot selling products that are trending right now. Updated daily."
                  products={filteredProducts}
                  loading={loading}
                  onImport={handleImport}
                  onExport={handleExport}
                  importing={importing}
                  exporting={exporting}
                  selectedRetailer={selectedRetailer}
                  retailers={retailers}
                />
              </TabsContent>
              
              <TabsContent value="profit" className="space-y-4">
                <ProductGrid
                  title="High Profit Margin Products"
                  description="Products with the highest profit potential for your store."
                  products={filteredProducts}
                  loading={loading}
                  onImport={handleImport}
                  onExport={handleExport}
                  importing={importing}
                  exporting={exporting}
                  selectedRetailer={selectedRetailer}
                  retailers={retailers}
                />
              </TabsContent>
              
              <TabsContent value="competitors" className="space-y-4">
                <ProductGrid
                  title="Competitor Insights"
                  description="Products that your competitors are selling successfully."
                  products={filteredProducts}
                  loading={loading}
                  onImport={handleImport}
                  onExport={handleExport}
                  importing={importing}
                  exporting={exporting}
                  selectedRetailer={selectedRetailer}
                  retailers={retailers}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
}
