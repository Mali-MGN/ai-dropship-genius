
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, BarChart4 } from "lucide-react";
import { RetailerGrid } from "@/components/product-discovery/RetailerGrid";
import { ProductFilters } from "@/components/product-discovery/ProductFilters";
import { ProductGrid } from "@/components/product-discovery/ProductGrid";
import { useProductDiscovery } from "@/hooks/useProductDiscovery";
import { retailers } from "@/data/retailers";

export default function ProductDiscovery() {
  const {
    filteredProducts,
    loading,
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Product Discovery</h1>
          <p className="text-muted-foreground text-lg">Find trending products to add to your store</p>
        </div>
        
        <RetailerGrid 
          retailers={retailers}
          selectedRetailer={selectedRetailer}
          onSelectRetailer={setSelectedRetailer}
        />
        
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
      </div>
    </MainLayout>
  );
}
