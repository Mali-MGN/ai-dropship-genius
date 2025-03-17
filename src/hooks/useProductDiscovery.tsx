
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { downloadCSV, downloadJSON } from "@/utils/productUtils";
import { AIService } from "@/utils/AIService";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  trending: boolean;
  profitMargin: number;
  source: string;
  comparePrice: number;
  createdAt: string;
  updatedAt: string;
  productUrl: string;
  inStock: boolean;
  aiRecommended?: boolean;
}

interface ProjectedTrend {
  category: string;
  description: string;
  growthRate: number;
  color: string;
}

export function useProductDiscovery() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([]);
  const [aiRecommendedProducts, setAiRecommendedProducts] = useState<ProductData[]>([]);
  const [topSellingProducts, setTopSellingProducts] = useState<ProductData[]>([]);
  const [projectedTrends, setProjectedTrends] = useState<ProjectedTrend[]>([
    {
      category: "Eco-Friendly Products",
      description: "Sustainable goods with minimal environmental impact",
      growthRate: 32,
      color: "emerald-500"
    },
    {
      category: "Smart Home Devices",
      description: "Connected home automation and monitoring products",
      growthRate: 25,
      color: "blue-500"
    },
    {
      category: "Pet Accessories",
      description: "Premium products for pets and pet owners",
      growthRate: 22,
      color: "amber-500"
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("trending");
  const [sortOrder, setSortOrder] = useState("trending");
  const [importing, setImporting] = useState<Record<string, boolean>>({});
  const [exporting, setExporting] = useState<Record<string, boolean>>({});
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState("csv");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([
    "Electronics", "Fashion", "Home & Kitchen", "Beauty", "Toys & Games", 
    "Sports & Outdoors", "Health & Personal Care"
  ]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Try to get data from supabase
        const { data, error } = await supabase
          .from("scraped_products")
          .select("*");

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // Transform data to match ProductData interface
          const transformedData: ProductData[] = data.map(item => ({
            id: item.id,
            name: item.name || "",
            description: item.description || "",
            price: Number(item.price) || 0,
            imageUrl: item.image_url || "https://placehold.co/600x400?text=No+Image",
            category: item.category || "Uncategorized",
            tags: item.tags || [],
            rating: item.rating || 0,
            reviewCount: item.review_count || 0,
            trending: item.is_trending || false,
            profitMargin: item.profit_margin || 0,
            source: item.source || "Unknown",
            comparePrice: item.compare_price || 0,
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.updated_at || new Date().toISOString(),
            productUrl: item.product_url || "#",
            inStock: true
          }));
          
          setProducts(transformedData);
          filterProducts(transformedData, currentTab, searchQuery, selectedCategory);
          
          // Extract unique categories from products
          const uniqueCategories = Array.from(new Set(transformedData.map(p => p.category)));
          if (uniqueCategories.length > 0) {
            setCategories(uniqueCategories);
          }
        } else {
          // Use dummy data if no products in Supabase
          const dummyProducts = generateDummyProducts();
          setProducts(dummyProducts);
          filterProducts(dummyProducts, currentTab, searchQuery, selectedCategory);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Use dummy data if error occurs
        const dummyProducts = generateDummyProducts();
        setProducts(dummyProducts);
        filterProducts(dummyProducts, currentTab, searchQuery, selectedCategory);
        
        toast({
          title: "Using demo data",
          description: "Connected to demo products database for showcase.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedRetailer]);

  // When tab, search, or category changes, refilter the products
  useEffect(() => {
    filterProducts(products, currentTab, searchQuery, selectedCategory);
  }, [currentTab, searchQuery, selectedCategory]);

  useEffect(() => {
    async function fetchAiRecommendations() {
      if (!selectedRetailer) return;
      
      try {
        setAiLoading(true);
        
        try {
          // Try to get AI recommendations from the AIService
          const recommendationsResponse = await AIService.getPersonalizedRecommendations();
          
          if (recommendationsResponse && recommendationsResponse.recommendations) {
            // Transform AI recommendations to match ProductData interface
            const aiRecommendations: ProductData[] = recommendationsResponse.recommendations.map(item => ({
              id: item.id || Math.random().toString(36).substring(2, 11),
              name: item.name || "",
              description: item.description || "",
              price: Number(item.price) || 0,
              imageUrl: item.image_url || "https://placehold.co/600x400?text=No+Image",
              category: item.category || "Uncategorized",
              tags: item.tags || [],
              rating: item.rating || 0,
              reviewCount: 0,
              trending: true,
              profitMargin: item.profit_margin || 0,
              source: item.source || selectedRetailer,
              comparePrice: item.compare_price || 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              productUrl: item.product_url || "#",
              inStock: true,
              aiRecommended: true
            }));
            
            setAiRecommendedProducts(aiRecommendations);
          } else {
            throw new Error("No recommendations returned");
          }
        } catch (error) {
          // If AIService fails, generate dummy AI recommendations
          const dummyAiRecommendations = generateDummyAIRecommendations();
          setAiRecommendedProducts(dummyAiRecommendations);
        }
        
        // For top selling products, use trending products from main product data
        const trendingProducts = products
          .filter(p => p.trending)
          .sort((a, b) => b.reviewCount - a.reviewCount)
          .slice(0, 6);  // Top 6 trending products
          
        if (trendingProducts.length > 0) {
          setTopSellingProducts(trendingProducts);
        } else {
          // Generate dummy top selling products if none found
          setTopSellingProducts(generateDummyTopSellingProducts());
        }
      } catch (error) {
        console.error("Error in AI recommendations:", error);
        
        // Generate dummy data for both AI recommendations and top selling products
        setAiRecommendedProducts(generateDummyAIRecommendations());
        setTopSellingProducts(generateDummyTopSellingProducts());
        
        toast({
          title: "Using demo recommendations",
          description: "Showing example AI recommendations for demonstration.",
        });
      } finally {
        setAiLoading(false);
      }
    }

    fetchAiRecommendations();
  }, [selectedRetailer, products]);

  const filterProducts = (allProducts: ProductData[], tab: string, query: string, category: string) => {
    let filtered = [...allProducts];
    
    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      );
    }
    
    // Apply category filter
    if (category && category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    // Apply tab filter
    switch (tab) {
      case "trending":
        filtered = filtered.filter(product => product.trending);
        break;
      case "profit":
        filtered = filtered.sort((a, b) => b.profitMargin - a.profitMargin);
        filtered = filtered.slice(0, 20); // Top 20 products by profit margin
        break;
      case "competitors":
        // Filter by competitor-related products (for now just show all)
        filtered = [...filtered];
        break;
      default:
        // No special filtering
        break;
    }
    
    // Apply sorting
    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "trending":
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // No special sorting
        break;
    }
    
    setFilteredProducts(filtered);
  };

  // Helper function to generate dummy products for demonstration
  const generateDummyProducts = (): ProductData[] => {
    const dummyProducts: ProductData[] = [];
    const dummyCategories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Toys & Games"];
    const dummyNames = [
      "Wireless Earbuds", "Smart Watch", "Laptop Stand", "Phone Holder", 
      "LED Desk Lamp", "Fitness Tracker", "Bluetooth Speaker", "Portable Charger",
      "Yoga Mat", "Water Bottle", "Coffee Mug", "Backpack", "Sunglasses"
    ];
    
    for (let i = 0; i < 20; i++) {
      const name = dummyNames[Math.floor(Math.random() * dummyNames.length)];
      const category = dummyCategories[Math.floor(Math.random() * dummyCategories.length)];
      const price = Math.floor(Math.random() * 200) + 10;
      const comparePrice = price + Math.floor(Math.random() * 50);
      const profitMargin = Math.floor(Math.random() * 30) + 10;
      const trending = Math.random() > 0.7;
      const rating = (Math.random() * 4) + 1;
      const reviewCount = Math.floor(Math.random() * 1000);
      
      dummyProducts.push({
        id: `dummy-${i}`,
        name: `${name} ${i + 1}`,
        description: `High-quality ${name.toLowerCase()} perfect for everyday use. This ${category.toLowerCase()} product offers great value and durability.`,
        price,
        imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(name)}`,
        category,
        tags: [category, name.split(' ')[0], trending ? "Trending" : "Regular"],
        rating,
        reviewCount,
        trending,
        profitMargin,
        source: "Demo Store",
        comparePrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productUrl: "#",
        inStock: Math.random() > 0.2
      });
    }
    
    return dummyProducts;
  };

  // Helper function to generate dummy AI recommendations
  const generateDummyAIRecommendations = (): ProductData[] => {
    const dummyRecommendations: ProductData[] = [];
    const names = [
      "AI-Recommended Smartwatch", "Premium Wireless Headphones", 
      "Ergonomic Desk Chair", "Ultra Slim Laptop", "Smart Home Assistant",
      "Fitness Smart Scale"
    ];
    
    for (let i = 0; i < 6; i++) {
      const price = Math.floor(Math.random() * 300) + 50;
      
      dummyRecommendations.push({
        id: `ai-rec-${i}`,
        name: names[i],
        description: "AI-recommended product based on current market trends and customer preferences.",
        price,
        imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(names[i])}`,
        category: "AI Recommendations",
        tags: ["trending", "popular", "recommended"],
        rating: 4.7,
        reviewCount: Math.floor(Math.random() * 500) + 100,
        trending: true,
        profitMargin: Math.floor(Math.random() * 40) + 20,
        source: "AI Recommendations",
        comparePrice: price * 1.2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productUrl: "#",
        inStock: true,
        aiRecommended: true
      });
    }
    
    return dummyRecommendations;
  };

  // Helper function to generate dummy top selling products
  const generateDummyTopSellingProducts = (): ProductData[] => {
    const dummyTopSelling: ProductData[] = [];
    const names = [
      "Bestseller Smartphone Case", "Popular Water Bottle", 
      "Top-Rated Bluetooth Speaker", "Bestselling Fitness Tracker", 
      "Premium Coffee Maker", "Trendy Backpack"
    ];
    
    for (let i = 0; i < 6; i++) {
      const price = Math.floor(Math.random() * 200) + 30;
      
      dummyTopSelling.push({
        id: `top-selling-${i}`,
        name: names[i],
        description: "One of our top-selling products with excellent customer reviews.",
        price,
        imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(names[i])}`,
        category: "Top Sellers",
        tags: ["bestseller", "popular", "top-rated"],
        rating: 4.8,
        reviewCount: Math.floor(Math.random() * 1000) + 500,
        trending: true,
        profitMargin: Math.floor(Math.random() * 35) + 15,
        source: "Top Sellers",
        comparePrice: price * 1.2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productUrl: "#",
        inStock: true
      });
    }
    
    return dummyTopSelling;
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    filterProducts(products, value, searchQuery, selectedCategory);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    filterProducts(products, currentTab, e.target.value, selectedCategory);
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    filterProducts(products, currentTab, searchQuery, selectedCategory);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(products, currentTab, searchQuery, category);
  };

  const handleImport = async (productId: string) => {
    try {
      setImporting(prev => ({ ...prev, [productId]: true }));
      
      // Get the product details
      const product = products.find(p => p.id === productId) || 
                     aiRecommendedProducts.find(p => p.id === productId) || 
                     topSellingProducts.find(p => p.id === productId);
                     
      if (!product) throw new Error("Product not found");
      
      // Check if a retailer is selected
      if (!selectedRetailer) {
        toast({
          title: "Select a retailer",
          description: "Please select a retailer to import from",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Product imported",
        description: `${product.name} has been imported from ${selectedRetailer}.`,
      });
    } catch (error) {
      console.error("Error importing product:", error);
      toast({
        title: "Import failed",
        description: "Failed to import the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleExport = async (productId: string) => {
    try {
      setExporting(prev => ({ ...prev, [productId]: true }));
      
      // Get the product details
      const product = products.find(p => p.id === productId) || 
                     aiRecommendedProducts.find(p => p.id === productId) || 
                     topSellingProducts.find(p => p.id === productId);
                     
      if (!product) throw new Error("Product not found");
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a formatted product object for export
      const exportData = {
        id: product.id,
        title: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        category: product.category,
        tags: product.tags.join(", "),
        imageUrl: product.imageUrl,
        source: product.source,
        exported_at: new Date().toISOString()
      };
      
      if (exportFormat === "csv") {
        downloadCSV([exportData], `product-${product.id}`);
      } else if (exportFormat === "json") {
        downloadJSON(exportData, `product-${product.id}`);
      }
      
      toast({
        title: "Product exported",
        description: `The product has been exported to your store as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error("Error exporting product:", error);
      toast({
        title: "Export failed",
        description: "Failed to export the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExporting(prev => ({ ...prev, [productId]: false }));
    }
  };

  return {
    products,
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
  };
}
