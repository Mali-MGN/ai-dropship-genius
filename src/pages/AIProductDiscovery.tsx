
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles, TrendingUp, Heart, ShoppingBag, Share2 } from "lucide-react";
import { AIService } from '@/utils/AIService';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  source: string;
  image_url?: string;
  product_url?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  review_count?: number;
  trending_score?: number;
  is_trending?: boolean;
  profit_margin?: number;
}

const AIProductDiscovery = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [personalizedProducts, setPersonalizedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [personalizedMessage, setPersonalizedMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personalized");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // First try to get personalized recommendations
      const personalizedResponse = await AIService.getPersonalizedRecommendations();
      setPersonalizedProducts(personalizedResponse.recommendations as Product[]);
      setIsPersonalized(personalizedResponse.personalized);
      setPersonalizedMessage(personalizedResponse.message);
      
      // Also load trending products
      const trending = await AIService.getTrendingProducts();
      setTrendingProducts(trending);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load product recommendations. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-100">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image available
          </div>
        )}
        {product.is_trending && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription className="text-xs">{product.source}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">{formatPrice(product.price)}</p>
            {product.compare_price && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compare_price)}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Potential profit:</p>
            <p className="font-medium text-green-600">{formatPrice(product.profit_margin || 0)}</p>
          </div>
        </div>
        <div className="mt-2">
          {product.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="mr-1 mb-1">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" className="gap-1">
          <ShoppingBag className="h-4 w-4" />
          <span>Dropship</span>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Product Discovery</h1>
          <p className="text-muted-foreground">
            Discover high-profit products tailored to your preferences.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="personalized" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>For You</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personalized" className="space-y-4">
            {isPersonalized ? (
              <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-md mb-4">
                <Sparkles className="h-5 w-5" />
                <p className="text-sm">{personalizedMessage}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-md mb-4">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Personalization is disabled</p>
                  <p className="text-xs">Enable AI personalization in settings to get tailored recommendations.</p>
                  <Button variant="link" className="h-auto p-0 text-xs" onClick={() => window.location.href = '/settings'}>
                    Go to Settings
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardHeader className="pb-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : personalizedProducts.length > 0 ? (
                personalizedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No personalized products found.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-md mb-4">
              <TrendingUp className="h-5 w-5" />
              <p className="text-sm">Showing products that are currently trending and have high profit potential.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardHeader className="pb-2">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : trendingProducts.length > 0 ? (
                trendingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No trending products found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AIProductDiscovery;
