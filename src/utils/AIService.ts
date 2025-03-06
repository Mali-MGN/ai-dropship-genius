
import { supabase } from "@/integrations/supabase/client";

interface ScrapeProductsOptions {
  source: string;
  category?: string;
  limit?: number;
}

interface PersonalizedRecommendationsResponse {
  recommendations: Product[];
  personalized: boolean;
  message: string;
}

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

export class AIService {
  /**
   * Scrape products from a specific source
   */
  static async scrapeProducts(options: ScrapeProductsOptions): Promise<Product[]> {
    try {
      const { data, error } = await supabase.functions.invoke('scrape-products', {
        body: options
      });
      
      if (error) throw error;
      
      return data.products || [];
    } catch (error) {
      console.error('Error scraping products:', error);
      throw error;
    }
  }
  
  /**
   * Get personalized product recommendations for the current user
   */
  static async getPersonalizedRecommendations(): Promise<PersonalizedRecommendationsResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('personalized-recommendations');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      throw error;
    }
  }
  
  /**
   * Get trending products from the database
   */
  static async getTrendingProducts(limit = 10): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('scraped_products')
        .select('*')
        .eq('is_trending', true)
        .order('trending_score', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting trending products:', error);
      throw error;
    }
  }
  
  /**
   * Save user preferences for AI personalization
   */
  static async saveUserPreferences(preferences: {
    enable_personalization: boolean;
    interests?: string[];
    price_range_min?: number;
    price_range_max?: number;
    enable_shopping_history?: boolean;
    enable_social_recommendations?: boolean;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          ...preferences,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }
  
  /**
   * Get user preferences for AI personalization
   */
  static async getUserPreferences(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  }
}
