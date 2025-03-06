
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
      user_preferences: {
        Row: {
          id: string
          user_id: string
          interests: string[] | null
          price_range_min: number
          price_range_max: number
          enable_personalization: boolean
          enable_shopping_history: boolean
          enable_social_recommendations: boolean
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          interests?: string[] | null
          price_range_min?: number
          price_range_max?: number
          enable_personalization?: boolean
          enable_shopping_history?: boolean
          enable_social_recommendations?: boolean
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          interests?: string[] | null
          price_range_min?: number
          price_range_max?: number
          enable_personalization?: boolean
          enable_shopping_history?: boolean
          enable_social_recommendations?: boolean
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      scraped_products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number | null
          compare_price: number | null
          source: string | null
          image_url: string | null
          product_url: string | null
          category: string | null
          tags: string[] | null
          rating: number | null
          review_count: number | null
          trending_score: number | null
          is_trending: boolean | null
          profit_margin: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price?: number | null
          compare_price?: number | null
          source?: string | null
          image_url?: string | null
          product_url?: string | null
          category?: string | null
          tags?: string[] | null
          rating?: number | null
          review_count?: number | null
          trending_score?: number | null
          is_trending?: boolean | null
          profit_margin?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number | null
          compare_price?: number | null
          source?: string | null
          image_url?: string | null
          product_url?: string | null
          category?: string | null
          tags?: string[] | null
          rating?: number | null
          review_count?: number | null
          trending_score?: number | null
          is_trending?: boolean | null
          profit_margin?: number | null
          created_at?: string | null
          updated_at?: string | null
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
