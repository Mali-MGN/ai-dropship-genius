
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
  applied_filters?: {
    interests: string[];
    price_range: [number | null, number | null];
    social_enabled?: boolean;
    connected_accounts?: {
      social: number;
      third_party: number;
    };
  };
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
  similarityScore?: number;
  socialRelevanceScore?: number;
  totalRelevanceScore?: number;
}

interface SocialConnection {
  id: string;
  user_id: string;
  provider: string;
  provider_id: string;
  username: string;
  connected_at: string;
}

interface ThirdPartyConnection {
  id: string;
  user_id: string;
  provider: string;
  provider_id: string;
  username: string;
  connected_at: string;
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

  /**
   * Get connected social media accounts
   */
  static async getSocialConnections(): Promise<SocialConnection[]> {
    try {
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting social connections:', error);
      throw error;
    }
  }

  /**
   * Get connected third-party applications
   */
  static async getThirdPartyConnections(): Promise<ThirdPartyConnection[]> {
    try {
      const { data, error } = await supabase
        .from('third_party_connections')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting third-party connections:', error);
      throw error;
    }
  }

  /**
   * Connect a social media account
   */
  static async connectSocialAccount(provider: string, providerData: {
    provider_id: string;
    username: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_connections')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          provider,
          provider_id: providerData.provider_id,
          username: providerData.username,
          connected_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Connect a third-party application
   */
  static async connectThirdPartyApp(provider: string, providerData: {
    provider_id: string;
    username: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('third_party_connections')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          provider,
          provider_id: providerData.provider_id,
          username: providerData.username,
          connected_at: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect a social media account or third-party application
   */
  static async disconnectAccount(id: string, type: 'social' | 'third-party'): Promise<void> {
    try {
      const tableName = type === 'social' ? 'social_connections' : 'third_party_connections';
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error disconnecting account:', error);
      throw error;
    }
  }
}
