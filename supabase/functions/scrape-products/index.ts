
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapingRequest {
  source: string;
  category?: string;
  url?: string;
  limit?: number;
  sync?: boolean;
}

interface ScrapedProduct {
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

    // Parse the request body
    const { source, category, url, limit = 10, sync = false }: ScrapingRequest = await req.json();

    if (!source) {
      return new Response(JSON.stringify({ error: 'Source is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Scraping products from ${source}, category: ${category || 'any'}, limit: ${limit}, sync: ${sync}`);
    
    // First, check if the retailer is active
    const { data: retailerData, error: retailerError } = await supabaseClient
      .from('integrated_retailers')
      .select('*')
      .eq('name', source)
      .eq('active', true)
      .maybeSingle();
    
    if (retailerError) {
      return new Response(JSON.stringify({ error: retailerError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // If sync is true, we need to make sure the retailer is connected
    if (sync && !retailerData) {
      return new Response(JSON.stringify({ 
        error: 'Retailer not connected or inactive. Please connect the retailer first.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Simulate scraping by generating mock products based on the source
    const products: ScrapedProduct[] = mockScrapeProducts(source, category, limit);
    
    // Store products in the database
    const { data, error } = await supabaseClient
      .from('scraped_products')
      .upsert(
        products.map(product => ({
          ...product,
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'name, source' }
      );

    if (error) {
      console.error('Error storing products:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // If this is a sync operation, update the retailer's last sync time
    if (sync && retailerData) {
      const { error: updateError } = await supabaseClient
        .from('integrated_retailers')
        .update({ last_synced: new Date().toISOString() })
        .eq('id', retailerData.id);
      
      if (updateError) {
        console.error('Error updating retailer sync time:', updateError);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully scraped ${products.length} products from ${source}`,
      products,
      sync_completed: sync
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in scrape-products function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function mockScrapeProducts(source: string, category?: string, limit = 10): ScrapedProduct[] {
  const categories = ['Electronics', 'Fashion', 'Home Decor', 'Beauty', 'Sports', 'Toys'];
  const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];
  
  const products: ScrapedProduct[] = [];
  
  // Generate mock products
  for (let i = 0; i < limit; i++) {
    const price = Math.floor(Math.random() * 150) + 10;
    const comparePrice = Math.floor(price * (1 + Math.random() * 0.5));
    const profitMargin = price * 0.3; // 30% profit margin
    const rating = 3 + Math.random() * 2; // Rating between 3 and 5
    const reviewCount = Math.floor(Math.random() * 500) + 10;
    const trendingScore = Math.floor(Math.random() * 100);
    const isTrending = trendingScore > 70;
    
    let productName = '';
    let imageUrl = '';
    let tags = [];
    
    // Generate different product names based on the category
    if (selectedCategory === 'Electronics') {
      const items = ['Wireless Earbuds', 'Smart Watch', 'Phone Stand', 'Charging Dock', 'Bluetooth Speaker'];
      productName = `${items[i % items.length]} ${source} Edition`;
      imageUrl = `https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop`;
      tags = ['gadgets', 'tech', 'electronics'];
    } else if (selectedCategory === 'Fashion') {
      const items = ['Minimalist Watch', 'Canvas Backpack', 'Leather Wallet', 'Sunglasses', 'Beanie Hat'];
      productName = `${source} ${items[i % items.length]}`;
      imageUrl = `https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop`;
      tags = ['fashion', 'accessories', 'style'];
    } else if (selectedCategory === 'Home Decor') {
      const items = ['LED String Lights', 'Succulent Planter', 'Floating Shelf', 'Throw Pillow Covers', 'Scented Candle'];
      productName = `${items[i % items.length]} - ${source}`;
      imageUrl = `https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?w=500&auto=format&fit=crop`;
      tags = ['home', 'decor', 'interior'];
    } else {
      const items = ['Portable Charger', 'Travel Pillow', 'Water Bottle', 'Yoga Mat', 'Desk Organizer'];
      productName = `${source} ${items[i % items.length]}`;
      imageUrl = `https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=500&auto=format&fit=crop`;
      tags = ['lifestyle', 'travel', 'fitness'];
    }
    
    products.push({
      name: productName,
      description: `This is a high-quality ${productName} from ${source}. Perfect for everyday use.`,
      price,
      compare_price: comparePrice,
      source,
      image_url: imageUrl,
      product_url: `https://${source.toLowerCase().replace(/\s+/g, '')}.com/product/${i}`,
      category: selectedCategory,
      tags,
      rating,
      review_count: reviewCount,
      trending_score: trendingScore,
      is_trending: isTrending,
      profit_margin: profitMargin
    });
  }
  
  return products;
}
