export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_assistant_feedback: {
        Row: {
          assistant_response: string
          created_at: string
          feedback_text: string | null
          id: string
          message_content: string
          rating: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          assistant_response: string
          created_at?: string
          feedback_text?: string | null
          id?: string
          message_content: string
          rating: number
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          assistant_response?: string
          created_at?: string
          feedback_text?: string | null
          id?: string
          message_content?: string
          rating?: number
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      financial_summary: {
        Row: {
          id: string
          month: number
          order_count: number
          total_cost: number
          total_profit: number
          total_revenue: number
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          id?: string
          month: number
          order_count?: number
          total_cost?: number
          total_profit?: number
          total_revenue?: number
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          id?: string
          month?: number
          order_count?: number
          total_cost?: number
          total_profit?: number
          total_revenue?: number
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      integrated_retailers: {
        Row: {
          active: boolean
          api_endpoint: string
          api_key: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          api_endpoint: string
          api_key: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          api_endpoint?: string
          api_key?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          reference_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          reference_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          reference_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      scraped_products: {
        Row: {
          category: string | null
          compare_price: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          is_trending: boolean | null
          name: string
          price: number | null
          product_url: string | null
          profit_margin: number | null
          rating: number | null
          review_count: number | null
          source: string | null
          stock_quantity: number | null
          tags: string[] | null
          trending_score: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          compare_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_trending?: boolean | null
          name: string
          price?: number | null
          product_url?: string | null
          profit_margin?: number | null
          rating?: number | null
          review_count?: number | null
          source?: string | null
          stock_quantity?: number | null
          tags?: string[] | null
          trending_score?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          compare_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_trending?: boolean | null
          name?: string
          price?: number | null
          product_url?: string | null
          profit_margin?: number | null
          rating?: number | null
          review_count?: number | null
          source?: string | null
          stock_quantity?: number | null
          tags?: string[] | null
          trending_score?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          connected_at: string
          id: string
          provider: string
          provider_id: string
          user_id: string
          username: string
        }
        Insert: {
          connected_at?: string
          id?: string
          provider: string
          provider_id: string
          user_id: string
          username: string
        }
        Update: {
          connected_at?: string
          id?: string
          provider?: string
          provider_id?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      third_party_connections: {
        Row: {
          connected_at: string
          id: string
          provider: string
          provider_id: string
          user_id: string
          username: string
        }
        Insert: {
          connected_at?: string
          id?: string
          provider: string
          provider_id: string
          user_id: string
          username: string
        }
        Update: {
          connected_at?: string
          id?: string
          provider?: string
          provider_id?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      user_orders: {
        Row: {
          actual_delivery: string | null
          amount: number
          cost: number
          customer_address: string
          customer_email: string
          customer_name: string
          estimated_delivery: string | null
          id: string
          order_date: string
          order_id: string
          product_id: string
          profit: number
          retailer_id: string | null
          status: string
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_delivery?: string | null
          amount: number
          cost: number
          customer_address: string
          customer_email: string
          customer_name: string
          estimated_delivery?: string | null
          id?: string
          order_date?: string
          order_id: string
          product_id: string
          profit: number
          retailer_id?: string | null
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_delivery?: string | null
          amount?: number
          cost?: number
          customer_address?: string
          customer_email?: string
          customer_name?: string
          estimated_delivery?: string | null
          id?: string
          order_date?: string
          order_id?: string
          product_id?: string
          profit?: number
          retailer_id?: string | null
          status?: string
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "scraped_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_orders_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "integrated_retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          enable_personalization: boolean | null
          enable_shopping_history: boolean | null
          enable_social_recommendations: boolean | null
          id: string
          interests: string[] | null
          last_updated: string | null
          price_range_max: number | null
          price_range_min: number | null
          user_id: string
        }
        Insert: {
          enable_personalization?: boolean | null
          enable_shopping_history?: boolean | null
          enable_social_recommendations?: boolean | null
          id?: string
          interests?: string[] | null
          last_updated?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          user_id: string
        }
        Update: {
          enable_personalization?: boolean | null
          enable_shopping_history?: boolean | null
          enable_social_recommendations?: boolean | null
          id?: string
          interests?: string[] | null
          last_updated?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
