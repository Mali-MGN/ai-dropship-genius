
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, BarChart4, AlertCircle } from "lucide-react";
import { RetailerGrid } from "@/components/product-discovery/RetailerGrid";
import { IntegrationStatus } from "@/components/product-discovery/IntegrationStatus";
import { ProductFilters } from "@/components/product-discovery/ProductFilters";
import { ProductGrid } from "@/components/product-discovery/ProductGrid";
import { AIRecommendedProducts } from "@/components/product-discovery/AIRecommendedProducts";
import { useProductDiscovery } from "@/hooks/useProductDiscovery";
import { retailers } from "@/data/retailers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ProductDiscovery() {
  const {
    filteredProducts,
    aiRecommendedProducts,
    topSellingProducts,
    loading,
    aiLoading,
    searchQuery,
    currentTab,
    sortOrder,
    importing,
    exporting,
    selectedRetailer,
    exportFormat,
    setSelectedRetailer,
    setExportFormat,
    handleTabChange,
    handleSearch,
    handleSort,
    handleImport,
    handleExport
  } = useProductDiscovery();

  const hasSelectedRetailer = !!selectedRetailer;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Product Discovery</h1>
          <p className="text-muted-foreground text-lg">Find trending products to add to your store</p>
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
                title="AI Recommended Products"
                description="Personalized product recommendations based on your store and market trends"
                products={aiRecommendedProducts}
                loading={aiLoading}
                onImport={handleImport}
                onExport={handleExport}
                importing={importing}
                exporting={exporting}
                selectedRetailer={selectedRetailer}
                retailers={retailers}
              />
              
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
              sortOrder={sortOrder}
              exportFormat={exportFormat}
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
