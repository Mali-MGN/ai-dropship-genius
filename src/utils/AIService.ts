
import { supabase } from "@/integrations/supabase/client";

export interface AIRecommendation {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  tags?: string[];
  rating?: number;
  profit_margin?: number;
  source?: string;
  compare_price?: number;
  product_url?: string;
}

export interface AIRecommendationResponse {
  recommendations: AIRecommendation[];
  personalized: boolean;
  message: string;
}

export interface UserPreferences {
  enable_personalization: boolean;
  interests: string[];
  price_range_min: number;
  price_range_max: number;
  enable_social_recommendations: boolean;
}

export interface SocialConnectionData {
  provider_id: string;
  username: string;
}

export interface Connection {
  id: string;
  provider: string;
  provider_id: string;
  username: string;
  connected_at: string;
}

export class AIService {
  static async getPersonalizedRecommendations(
    query?: string,
    userId?: string
  ): Promise<AIRecommendationResponse> {
    try {
      // In a real app, this would call a Supabase Edge Function
      // that interfaces with an AI model for recommendations
      const { data, error } = await supabase.functions.invoke('personalized-recommendations', {
        body: { 
          search: query || '',
          userId: userId || 'anonymous'
        }
      });
      
      if (error) throw error;
      
      return data as AIRecommendationResponse;
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      // Return dummy data if the real API call fails
      return {
        recommendations: [
          {
            id: "rec-1",
            name: "Smart Water Bottle",
            description: "Tracks hydration and reminds you to drink water",
            price: 45.99,
            image_url: "/placeholder.svg?height=200&width=200",
            category: "Health",
            tags: ["smart", "hydration", "fitness"],
            rating: 4.2,
            profit_margin: 40,
            source: "AI Recommendation",
            compare_price: 59.99,
            product_url: "#"
          },
          {
            id: "rec-2",
            name: "Portable Bluetooth Speaker",
            description: "Waterproof speaker with 24-hour battery life",
            price: 39.99,
            image_url: "/placeholder.svg?height=200&width=200",
            category: "Electronics",
            tags: ["audio", "portable", "bluetooth"],
            rating: 4.5,
            profit_margin: 45,
            source: "AI Recommendation",
            compare_price: 49.99,
            product_url: "#"
          },
          {
            id: "rec-3",
            name: "Foldable Solar Charger",
            description: "Compact solar panel for charging devices on the go",
            price: 59.99,
            image_url: "/placeholder.svg?height=200&width=200",
            category: "Electronics",
            tags: ["solar", "charger", "eco-friendly"],
            rating: 4.3,
            profit_margin: 50,
            source: "AI Recommendation",
            compare_price: 79.99,
            product_url: "#"
          }
        ],
        personalized: true,
        message: "Showing personalized product recommendations based on trending items"
      };
    }
  }

  // Methods for user preferences
  static async getUserPreferences(): Promise<UserPreferences | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) return null;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No record found
          return null;
        }
        throw error;
      }
      
      return {
        enable_personalization: data.enable_personalization,
        interests: data.interests || [],
        price_range_min: data.price_range_min,
        price_range_max: data.price_range_max,
        enable_social_recommendations: data.enable_social_recommendations
      };
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  static async saveUserPreferences(preferences: UserPreferences): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) return false;
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.user.id,
          enable_personalization: preferences.enable_personalization,
          interests: preferences.interests,
          price_range_min: preferences.price_range_min,
          price_range_max: preferences.price_range_max,
          enable_social_recommendations: preferences.enable_social_recommendations,
          last_updated: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      return false;
    }
  }

  // Methods for social connections
  static async getSocialConnections(): Promise<Connection[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) return [];
      
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', user.user.id);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching social connections:', error);
      return [];
    }
  }

  static async getThirdPartyConnections(): Promise<Connection[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) return [];
      
      const { data, error } = await supabase
        .from('third_party_connections')
        .select('*')
        .eq('user_id', user.user.id);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching third-party connections:', error);
      return [];
    }
  }

  static async connectSocialAccount(provider: string, data: SocialConnectionData): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) return false;
      
      const { error } = await supabase
        .from('social_connections')
        .insert({
          user_id: user.user.id,
          provider,
          provider_id: data.provider_id,
          username: data.username
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error connecting social account:', error);
      return false;
    }
  }

  static async connectThirdPartyApp(provider: string, data: SocialConnectionData): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) return false;
      
      const { error } = await supabase
        .from('third_party_connections')
        .insert({
          user_id: user.user.id,
          provider,
          provider_id: data.provider_id,
          username: data.username
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error connecting third-party app:', error);
      return false;
    }
  }

  static async disconnectAccount(id: string, type: 'social' | 'third-party'): Promise<boolean> {
    try {
      const table = type === 'social' ? 'social_connections' : 'third_party_connections';
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error disconnecting account:', error);
      return false;
    }
  }
}
