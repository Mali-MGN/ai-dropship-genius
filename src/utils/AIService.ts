
import { supabase } from "@/integrations/supabase/client";

type UserPreferences = {
  id?: string;
  user_id?: string;
  interests?: string[];
  price_range_min?: number;
  price_range_max?: number;
  enable_personalization?: boolean;
  enable_shopping_history?: boolean;
  enable_social_recommendations?: boolean;
};

type SocialConnection = {
  id: string;
  provider: string;
  provider_id: string;
  username: string;
  connected_at: string;
};

export const AIService = {
  getPersonalizedRecommendations: async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('personalized-recommendations', {
        body: { user_id: userId }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      throw error;
    }
  },
  
  getUserPreferences: async (userId: string): Promise<UserPreferences> => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        // If no preferences found, return default values
        if (error.code === 'PGRST116') {
          return {
            user_id: userId,
            interests: [],
            price_range_min: 0,
            price_range_max: 1000,
            enable_personalization: false,
            enable_shopping_history: false,
            enable_social_recommendations: false
          };
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  },
  
  saveUserPreferences: async (preferences: UserPreferences): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(preferences, { onConflict: 'user_id' });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  },
  
  getSocialConnections: async (userId: string): Promise<SocialConnection[]> => {
    try {
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting social connections:', error);
      throw error;
    }
  },
  
  getThirdPartyConnections: async (userId: string): Promise<SocialConnection[]> => {
    try {
      const { data, error } = await supabase
        .from('third_party_connections')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting third-party connections:', error);
      throw error;
    }
  },
  
  connectSocialAccount: async (
    userId: string, 
    provider: string, 
    providerId: string, 
    username: string
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('social_connections')
        .upsert({
          user_id: userId,
          provider,
          provider_id: providerId,
          username
        }, { onConflict: 'provider, user_id' });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error connecting social account:', error);
      throw error;
    }
  },
  
  connectThirdPartyApp: async (
    userId: string, 
    provider: string, 
    providerId: string, 
    username: string
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('third_party_connections')
        .upsert({
          user_id: userId,
          provider,
          provider_id: providerId,
          username
        }, { onConflict: 'provider, user_id' });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error connecting third-party app:', error);
      throw error;
    }
  },
  
  disconnectAccount: async (tableType: 'social' | 'third-party', id: string): Promise<void> => {
    try {
      const table = tableType === 'social' ? 'social_connections' : 'third_party_connections';
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error disconnecting ${tableType} account:`, error);
      throw error;
    }
  }
};
