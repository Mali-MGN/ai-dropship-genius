
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the user's preferences
    const { data: userPreferences, error: userPreferencesError } = await supabaseClient
      .from('user_preferences')
      .select('*')
      .single();

    if (userPreferencesError && userPreferencesError.code !== 'PGRST116') {
      console.error('Error getting user preferences:', userPreferencesError);
      return new Response(JSON.stringify({ error: userPreferencesError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // If no preferences found or personalization is disabled, return trending products
    if (!userPreferences || !userPreferences.enable_personalization) {
      const { data: trendingProducts, error: trendingProductsError } = await supabaseClient
        .from('scraped_products')
        .select('*')
        .eq('is_trending', true)
        .order('trending_score', { ascending: false })
        .limit(10);

      if (trendingProductsError) {
        console.error('Error getting trending products:', trendingProductsError);
        return new Response(JSON.stringify({ error: trendingProductsError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        recommendations: trendingProducts,
        personalized: false,
        message: 'Showing trending products (personalization disabled)'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get products that match user's interests and price range
    let query = supabaseClient
      .from('scraped_products')
      .select('*')
      .gte('price', userPreferences.price_range_min)
      .lte('price', userPreferences.price_range_max);

    // Add categories filter if user has interests
    if (userPreferences.interests && userPreferences.interests.length > 0) {
      // Create a query that matches any of the user's interests
      // We're checking if any interest matches the product category or is contained in the tags array
      query = query.or(
        userPreferences.interests.map(interest => 
          `category.ilike.%${interest}%,tags.cs.{"${interest}"}`
        ).join(',')
      );
    }

    const { data: personalizedProducts, error: personalizedProductsError } = await query
      .order('trending_score', { ascending: false })
      .limit(10);

    if (personalizedProductsError) {
      console.error('Error getting personalized products:', personalizedProductsError);
      return new Response(JSON.stringify({ error: personalizedProductsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // If we couldn't find enough personalized products, supplement with trending ones
    if (personalizedProducts.length < 10) {
      const { data: trendingProducts, error: trendingProductsError } = await supabaseClient
        .from('scraped_products')
        .select('*')
        .eq('is_trending', true)
        .order('trending_score', { ascending: false })
        .limit(10 - personalizedProducts.length);

      if (!trendingProductsError && trendingProducts) {
        // Combine personalized and trending products, filtering out duplicates
        const existingIds = new Set(personalizedProducts.map(p => p.id));
        const additionalProducts = trendingProducts.filter(p => !existingIds.has(p.id));
        personalizedProducts.push(...additionalProducts);
      }
    }

    return new Response(JSON.stringify({ 
      recommendations: personalizedProducts,
      personalized: true,
      message: 'Showing personalized product recommendations'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in personalized-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
