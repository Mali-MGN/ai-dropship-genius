
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

    // Get the user's browsing history and preferences
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

    // Parse request body if it exists to get additional context
    let requestParams = {};
    if (req.headers.get('content-type')?.includes('application/json')) {
      try {
        requestParams = await req.json();
      } catch (e) {
        console.log('No JSON body or error parsing it:', e);
      }
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

    // Get connected social media accounts
    const { data: socialConnections, error: socialConnectionsError } = await supabaseClient
      .from('social_connections')
      .select('*')
      .eq('user_id', (await supabaseClient.auth.getUser()).data.user?.id);

    if (socialConnectionsError && socialConnectionsError.code !== 'PGRST116') {
      console.error('Error getting social connections:', socialConnectionsError);
    }

    // Get connected third-party apps
    const { data: thirdPartyConnections, error: thirdPartyConnectionsError } = await supabaseClient
      .from('third_party_connections')
      .select('*')
      .eq('user_id', (await supabaseClient.auth.getUser()).data.user?.id);

    if (thirdPartyConnectionsError && thirdPartyConnectionsError.code !== 'PGRST116') {
      console.error('Error getting third-party connections:', thirdPartyConnectionsError);
    }

    // Get products that match user's interests and price range
    let query = supabaseClient
      .from('scraped_products')
      .select('*');
      
    // Apply price range filter if preferences exist
    if (userPreferences.price_range_min !== null && userPreferences.price_range_max !== null) {
      query = query
        .gte('price', userPreferences.price_range_min)
        .lte('price', userPreferences.price_range_max);
    }

    // Apply category filters if user has interests
    if (userPreferences.interests && userPreferences.interests.length > 0) {
      const interestConditions = userPreferences.interests.map(interest => 
        `category.ilike.%${interest}%,tags.cs.{"${interest}"}`
      ).join(',');
      
      query = query.or(interestConditions);
    }
    
    // Apply additional filters from request if they exist
    if (requestParams.category) {
      query = query.ilike('category', `%${requestParams.category}%`);
    }
    
    if (requestParams.source) {
      query = query.eq('source', requestParams.source);
    }
    
    if (requestParams.search) {
      query = query.or(`name.ilike.%${requestParams.search}%,description.ilike.%${requestParams.search}%`);
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

    // Calculate similarity scores based on user interests and social connections for better ranking
    const enhancedProducts = personalizedProducts.map(product => {
      let similarityScore = 0;
      let socialRelevanceScore = 0;
      
      // Base similarity on matching interests
      if (userPreferences.interests && product.tags) {
        // Count matching tags
        const matchingTags = product.tags.filter(tag => 
          userPreferences.interests.includes(tag)
        ).length;
        
        similarityScore = matchingTags / Math.max(1, userPreferences.interests.length);
      }
      
      // Add social relevance if we have connected accounts and social recommendations enabled
      if (userPreferences.enable_social_recommendations) {
        // Check if any social connections have interacted with similar products
        if (socialConnections && socialConnections.length > 0) {
          // Simple boost for now - in a real implementation, this would analyze the user's social graph
          socialRelevanceScore = 0.2;
        }
        
        // Check if any connected third-party apps suggest similar products
        if (thirdPartyConnections && thirdPartyConnections.length > 0) {
          // Simple boost for now - in a real implementation, this would pull data from APIs
          socialRelevanceScore += 0.2;
        }
      }
      
      return {
        ...product,
        similarityScore,
        socialRelevanceScore,
        totalRelevanceScore: similarityScore + socialRelevanceScore
      };
    });
    
    // Sort by total relevance score and then by trending score
    enhancedProducts.sort((a, b) => {
      if (a.totalRelevanceScore !== b.totalRelevanceScore) {
        return b.totalRelevanceScore - a.totalRelevanceScore;
      }
      return (b.trending_score || 0) - (a.trending_score || 0);
    });

    return new Response(JSON.stringify({ 
      recommendations: enhancedProducts,
      personalized: true,
      message: 'Showing personalized product recommendations',
      applied_filters: {
        interests: userPreferences.interests || [],
        price_range: [userPreferences.price_range_min, userPreferences.price_range_max],
        social_enabled: userPreferences.enable_social_recommendations || false,
        connected_accounts: {
          social: socialConnections ? socialConnections.length : 0,
          third_party: thirdPartyConnections ? thirdPartyConnections.length : 0
        },
        ...requestParams
      }
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
