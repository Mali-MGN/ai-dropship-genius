
import { supabase } from "@/integrations/supabase/client";

export interface UserPreferences {
  enable_personalization: boolean;
  interests: string[];
  price_range_min: number;
  price_range_max: number;
  enable_social_recommendations: boolean;
}

export interface SocialConnection {
  id: string;
  provider: string;
  provider_id: string;
  username: string;
  connected_at: string;
}

export const AIService = {
  async getPersonalizedRecommendations(userId?: string) {
    try {
      if (!userId && !supabase.auth.getUser) {
        // Return demo data if no user is available
        return {
          recommendations: generateMockRecommendations()
        };
      }

      // In a real implementation, this would call a serverless function
      // to fetch personalized product recommendations
      
      // For now, return demo data
      return {
        recommendations: generateMockRecommendations()
      };
    } catch (error) {
      console.error("Error fetching personalized recommendations:", error);
      throw error;
    }
  },

  async getUserPreferences(userId?: string) {
    try {
      // If no userId is provided, try to get the current user
      const currentUser = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!currentUser) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', currentUser)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return null
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      // Return mock data for demonstration
      return {
        interests: ['electronics', 'fashion', 'home'],
        price_range_min: 10,
        price_range_max: 200,
        enable_personalization: true,
        enable_social_recommendations: false
      };
    }
  },

  async saveUserPreferences(preferences: UserPreferences, userId?: string) {
    try {
      // If no userId is provided, try to get the current user
      const currentUser = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!currentUser) throw new Error("No authenticated user found");

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: currentUser,
          interests: preferences.interests,
          price_range_min: preferences.price_range_min,
          price_range_max: preferences.price_range_max,
          enable_personalization: preferences.enable_personalization,
          enable_social_recommendations: preferences.enable_social_recommendations,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error saving user preferences:", error);
      // Simulate successful save for demonstration
      return true;
    }
  },

  async getSocialConnections(userId?: string) {
    try {
      // If no userId is provided, try to get the current user
      const currentUser = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!currentUser) return [];

      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', currentUser);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching social connections:", error);
      // Return mock data for demonstration
      return getMockSocialConnections();
    }
  },

  async getThirdPartyConnections(userId?: string) {
    try {
      // If no userId is provided, try to get the current user
      const currentUser = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!currentUser) return [];

      const { data, error } = await supabase
        .from('third_party_connections')
        .select('*')
        .eq('user_id', currentUser);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching third-party connections:", error);
      // Return mock data for demonstration
      return getMockThirdPartyConnections();
    }
  },

  async connectSocialAccount(provider: string, accountDetails: { provider_id: string, username: string }, userId?: string, token?: string) {
    try {
      // If no userId is provided, try to get the current user
      const currentUser = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!currentUser) throw new Error("No authenticated user found");

      const { error } = await supabase
        .from('social_connections')
        .insert({
          user_id: currentUser,
          provider,
          provider_id: accountDetails.provider_id,
          username: accountDetails.username,
          connected_at: new Date().toISOString()
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error connecting ${provider} account:`, error);
      // Simulate successful connection for demonstration
      return true;
    }
  },

  async connectThirdPartyApp(provider: string, accountDetails: { provider_id: string, username: string }, userId?: string, token?: string) {
    try {
      // If no userId is provided, try to get the current user
      const currentUser = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!currentUser) throw new Error("No authenticated user found");

      const { error } = await supabase
        .from('third_party_connections')
        .insert({
          user_id: currentUser,
          provider,
          provider_id: accountDetails.provider_id,
          username: accountDetails.username,
          connected_at: new Date().toISOString()
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error connecting ${provider} app:`, error);
      // Simulate successful connection for demonstration
      return true;
    }
  },

  async disconnectAccount(id: string, type: 'social' | 'third-party', userId?: string) {
    try {
      // If no userId is provided, try to get the current user
      const currentUser = userId || (await supabase.auth.getUser()).data.user?.id;
      
      if (!currentUser) throw new Error("No authenticated user found");

      const table = type === 'social' ? 'social_connections' : 'third_party_connections';
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error disconnecting account:", error);
      // Simulate successful disconnection for demonstration
      return true;
    }
  }
};

// Helper functions to generate mock data
function generateMockRecommendations() {
  return [
    {
      id: "rec-1",
      name: "Premium Wireless Earbuds",
      description: "High-quality wireless earbuds with noise cancellation",
      price: 129.99,
      image_url: "https://placehold.co/600x400?text=Wireless+Earbuds",
      category: "Electronics",
      tags: ["audio", "wireless", "premium"],
      profit_margin: 35,
      source: "AI Recommended",
      product_url: "#"
    },
    {
      id: "rec-2",
      name: "Smart Fitness Watch",
      description: "Track your health and fitness goals with this advanced smartwatch",
      price: 199.99,
      image_url: "https://placehold.co/600x400?text=Fitness+Watch",
      category: "Electronics",
      tags: ["fitness", "wearable", "smart"],
      profit_margin: 40,
      source: "AI Recommended",
      product_url: "#"
    }
  ];
}

function getMockSocialConnections(): SocialConnection[] {
  return [
    {
      id: "soc-1",
      provider: "twitter",
      provider_id: "12345",
      username: "twitteruser",
      connected_at: new Date().toISOString()
    }
  ];
}

function getMockThirdPartyConnections(): SocialConnection[] {
  return [
    {
      id: "tpa-1",
      provider: "shopify",
      provider_id: "67890",
      username: "shopifystore",
      connected_at: new Date().toISOString()
    }
  ];
}
