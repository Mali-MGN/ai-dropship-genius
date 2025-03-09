
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { ImportedProducts } from "@/components/dashboard/ImportedProducts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  Bot,
  User,
  Send, 
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  HelpCircle,
  Search,
  Filter, 
  TrendingUp, 
  ShoppingCart, 
  Zap, 
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  PlusCircle
} from "lucide-react";

const AIHub = () => {
  const [activeTab, setActiveTab] = useState("assistant");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">AI Hub</h1>
          <p className="text-muted-foreground text-lg">Your AI-powered dropshipping assistant and product discovery tool</p>
        </div>
        
        <Tabs defaultValue="assistant" onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="assistant" className="gap-2">
              <Bot className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="discovery" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Product Discovery
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant" className="space-y-4">
            <AIAssistantTab />
          </TabsContent>
          
          <TabsContent value="discovery" className="space-y-4">
            <AIDiscoveryTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// AI Assistant Tab Component
const AIAssistantTab = () => {
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>>([
    {
      id: "greeting",
      role: "assistant",
      content: "Hello! I'm your AI Dropshipping Assistant. I can help you find trending products, optimize your store, suggest marketing strategies, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const sessionId = React.useRef(`session-${Date.now()}`);

  // Auto-scroll to bottom of messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Here would be the actual API call to your AI service
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant" as const,
          content: generateMockResponse(inputValue),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateMockResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("trending product") || lowerInput.includes("popular product")) {
      return "Based on our data, current trending products include portable UV sanitizers, smart LED projectors, collapsible water bottles, and magnetic phone chargers. These products have shown consistent growth in the past 3 months with profit margins between 25-40%.";
    } else if (lowerInput.includes("supplier") || lowerInput.includes("manufacturer")) {
      return "I recommend checking AliExpress, Alibaba, and CJDropshipping for reliable suppliers. When choosing a supplier, verify their business license, check customer reviews, and request product samples. It's also important to understand their shipping times and return policies.";
    } else if (lowerInput.includes("marketing") || lowerInput.includes("advertise")) {
      return "For dropshipping, the most effective marketing channels are typically Facebook/Instagram ads, Google Shopping, and TikTok. I suggest starting with a small daily budget ($10-20) to test different ad creatives and targeting options before scaling up your successful campaigns.";
    } else if (lowerInput.includes("shipping time") || lowerInput.includes("delivery")) {
      return "Long shipping times can be a challenge in dropshipping. Consider using suppliers with warehouses in your target market country, or use services like CJDropshipping that offer faster shipping options. Always be transparent with customers about expected delivery times to reduce complaints and returns.";
    } else {
      return "I'd be happy to help with your dropshipping business. I can provide insights on trending products, supplier selection, marketing strategies, pricing optimization, and more. Could you please provide more specific details about what you're looking for?";
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text copied",
      description: "Message content copied to clipboard",
    });
  };

  const handleFeedback = (messageId: string) => {
    setShowFeedback(messageId);
  };

  const submitFeedback = async (messageId: string) => {
    setShowFeedback(null);
    setRating(0);
    setFeedbackText("");
    
    toast({
      title: "Thank you for your feedback!",
      description: "Your feedback helps us improve our AI assistant.",
    });
  };

  const clearChat = () => {
    // Generate a new session ID for new conversation
    sessionId.current = `session-${Date.now()}`;
    
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: "Hello! I'm your AI Dropshipping Assistant. I can help you find trending products, optimize your store, suggest marketing strategies, and more. How can I assist you today?",
        timestamp: new Date()
      }
    ]);
    
    toast({
      title: "Chat cleared",
      description: "Started a new conversation",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Area */}
      <div className="lg:col-span-3 flex flex-col">
        <Card className="flex-1 flex flex-col h-[70vh]">
          <CardHeader className="px-4 py-3 border-b flex-shrink-0">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </Avatar>
              <div>
                <CardTitle className="text-lg">AI Dropshipping Assistant</CardTitle>
                <CardDescription>Powered by AI to help grow your business</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full px-4 py-2">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`flex gap-3 max-w-[90%] ${
                        message.role === "user" 
                          ? "flex-row-reverse" 
                          : "flex-row"
                      }`}
                    >
                      <Avatar className={`h-8 w-8 mt-0.5 ${
                        message.role === "user" 
                          ? "bg-blue-500" 
                          : "bg-primary/10"
                      }`}>
                        {message.role === "user" ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary" />
                        )}
                      </Avatar>
                      
                      <div>
                        <div className={`rounded-lg p-3 ${
                          message.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-1 mt-1">
                            <button 
                              onClick={() => handleCopyText(message.content)}
                              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 p-1 rounded"
                            >
                              <Copy className="h-3 w-3" />
                              Copy
                            </button>
                            
                            <span className="text-muted-foreground">•</span>
                            
                            <button 
                              onClick={() => handleFeedback(message.id)}
                              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 p-1 rounded"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              Feedback
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 mt-0.5 bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse"></div>
                          <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse delay-150"></div>
                          <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse delay-300"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <div className="flex gap-2 w-full">
              <Textarea
                placeholder="Ask anything about dropshipping..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 resize-none"
                disabled={isLoading}
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Tools and suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={clearChat}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-2">Suggested Questions</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                  onClick={() => {
                    setInputValue("What are the trending products right now?");
                  }}
                >
                  <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="line-clamp-2">What are the trending products right now?</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                  onClick={() => {
                    setInputValue("How can I find reliable suppliers?");
                  }}
                >
                  <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="line-clamp-2">How can I find reliable suppliers?</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                  onClick={() => {
                    setInputValue("What marketing strategies work best for dropshipping?");
                  }}
                >
                  <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="line-clamp-2">What marketing strategies work best for dropshipping?</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                  onClick={() => {
                    setInputValue("How do I handle long shipping times?");
                  }}
                >
                  <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                  <span className="line-clamp-2">How do I handle long shipping times?</span>
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-2">Tips</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex gap-2">
                  <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Be specific with your questions for better answers</span>
                </p>
                <p className="flex gap-2">
                  <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>You can ask follow-up questions to dive deeper</span>
                </p>
                <p className="flex gap-2">
                  <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Provide feedback to help improve responses</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// AI Discovery Tab Component
const AIDiscoveryTab = () => {
  const [selectedTab, setSelectedTab] = useState("ai-recommended");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    image_url?: string;
    price: number;
    compare_price?: number;
    source: string;
    rating?: number;
    trending?: boolean;
    profit_margin?: number;
    category?: string;
    trending_score?: number;
  }>>([
    {
      id: "p1",
      name: "Wireless Earbuds Pro",
      price: 49.99,
      compare_price: 69.99,
      source: "AliExpress",
      rating: 4.5,
      trending: true,
      profit_margin: 17.50,
      category: "Electronics",
      trending_score: 85
    },
    {
      id: "p2",
      name: "Smart Watch Series 5",
      price: 129.99,
      compare_price: 149.99,
      source: "Amazon",
      rating: 4.7,
      profit_margin: 42.30,
      category: "Electronics",
      trending_score: 78
    },
    {
      id: "p3",
      name: "Portable Charger 10000mAh",
      price: 34.99,
      compare_price: 44.99,
      source: "Shopify",
      rating: 4.2,
      profit_margin: 12.25,
      category: "Electronics",
      trending_score: 65
    },
    {
      id: "p4",
      name: "LED String Lights",
      price: 19.99,
      compare_price: 29.99,
      source: "AliExpress",
      rating: 4.3,
      trending: true,
      profit_margin: 8.50,
      category: "Home Decor",
      trending_score: 92
    },
    {
      id: "p5",
      name: "Minimalist Watch",
      price: 59.99,
      compare_price: 79.99,
      source: "Amazon",
      rating: 4.6,
      profit_margin: 22.75,
      category: "Fashion",
      trending_score: 72
    },
    {
      id: "p6",
      name: "Canvas Backpack",
      price: 39.99,
      compare_price: 54.99,
      source: "Shopify",
      rating: 4.4,
      profit_margin: 15.20,
      category: "Fashion",
      trending_score: 68
    }
  ]);
  const { toast } = useToast();
  
  const handleImportProduct = async (id: string) => {
    // Store the imported product ID in localStorage
    try {
      const importedProducts = JSON.parse(localStorage.getItem("importedProducts") || "[]");
      if (!importedProducts.includes(id)) {
        importedProducts.push(id);
        localStorage.setItem("importedProducts", JSON.stringify(importedProducts));
        
        // Simulate the API call for importing a product
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return true;
      }
      
      toast({
        title: "Already Imported",
        description: "This product is already in your inventory.",
      });
      return false;
    } catch (error) {
      console.error("Error importing product:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing this product.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleBulkImport = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to import.",
        variant: "destructive",
      });
      return;
    }

    // Simulate importing multiple products
    setIsLoading(true);
    try {
      const importedProducts = JSON.parse(localStorage.getItem("importedProducts") || "[]");
      const newlyImported = [];
      
      for (const id of selectedProducts) {
        if (!importedProducts.includes(id)) {
          importedProducts.push(id);
          newlyImported.push(id);
        }
      }
      
      localStorage.setItem("importedProducts", JSON.stringify(importedProducts));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: `${newlyImported.length} Products Imported`,
        description: newlyImported.length === selectedProducts.length 
          ? "All selected products have been added to your inventory."
          : `${newlyImported.length} of ${selectedProducts.length} products were imported. ${selectedProducts.length - newlyImported.length} were already in your inventory.`,
      });
      
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error bulk importing products:", error);
      toast({
        title: "Import Failed",
        description: "There was an error importing the selected products.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(productId => productId !== id) 
        : [...prev, id]
    );
  };

  const categories = ["Electronics", "Fashion", "Home Decor", "Beauty", "Sports", "Toys"];
  const sources = ["AliExpress", "Amazon", "eBay", "Etsy"];

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by categories
    if (selectedCategories.length > 0 && (!product.category || !selectedCategories.includes(product.category))) {
      return false;
    }
    
    // Filter by sources
    if (selectedSources.length > 0 && !selectedSources.includes(product.source)) {
      return false;
    }
    
    return true;
  });

  // Get trending products
  const trendingProducts = filteredProducts.filter(product => 
    product.trending_score && product.trending_score > 70
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={selectedCategories[0] || ""} 
            onValueChange={(value) => setSelectedCategories(value ? [value] : [])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={selectedSources[0] || ""} 
            onValueChange={(value) => setSelectedSources(value ? [value] : [])}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sources</SelectItem>
              {sources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      {/* Advanced Filters Card */}
      {showFilters && (
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-6">
                  <Slider 
                    defaultValue={[0, 1000]} 
                    max={1000} 
                    step={10} 
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex items-center justify-between">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Category Checkboxes */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.slice(0, 4).map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories(prev => [...prev, category]);
                          } else {
                            setSelectedCategories(prev => prev.filter(c => c !== category));
                          }
                        }}
                      />
                      <label 
                        htmlFor={`category-${category}`}
                        className="text-sm"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Source Checkboxes */}
              <div>
                <h3 className="font-medium mb-3">Sources</h3>
                <div className="space-y-2">
                  {sources.map(source => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`source-${source}`}
                        checked={selectedSources.includes(source)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSources(prev => [...prev, source]);
                          } else {
                            setSelectedSources(prev => prev.filter(s => s !== source));
                          }
                        }}
                      />
                      <label 
                        htmlFor={`source-${source}`}
                        className="text-sm"
                      >
                        {source}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Tabs */}
      <Tabs defaultValue="ai-recommended" onValueChange={setSelectedTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="ai-recommended" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Recommended
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
          </TabsList>
          {selectedProducts.length > 0 && (
            <Button onClick={handleBulkImport} className="gap-2" disabled={isLoading}>
              <PlusCircle className="h-4 w-4" />
              Import Selected ({selectedProducts.length})
            </Button>
          )}
        </div>

        {/* Content for all tabs */}
        <TabsContent value="ai-recommended" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product.id} className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                    />
                  </div>
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      image: product.image_url,
                      price: product.price,
                      comparePrice: product.compare_price,
                      source: product.source,
                      rating: product.rating,
                      trending: product.trending,
                      profit: product.profit_margin,
                      category: product.category
                    }}
                    onImport={handleImportProduct}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trendingProducts.length > 0 ? (
              trendingProducts.map(product => (
                <div key={product.id} className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                    />
                  </div>
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      image: product.image_url,
                      price: product.price,
                      comparePrice: product.compare_price,
                      source: product.source,
                      rating: product.rating,
                      trending: true,
                      profit: product.profit_margin,
                      category: product.category
                    }}
                    onImport={handleImportProduct}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No trending products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Imported Products Section */}
      <div className="mt-8">
        <ImportedProducts />
      </div>
    </div>
  );
};

export default AIHub;
