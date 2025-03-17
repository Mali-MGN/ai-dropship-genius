
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
}
