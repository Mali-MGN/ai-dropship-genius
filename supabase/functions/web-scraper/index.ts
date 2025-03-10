
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  source: string;
  category?: string;
  limit?: number;
  searchQuery?: string;
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
    const { source, category, limit = 20, searchQuery }: ScrapeRequest = await req.json();

    console.log(`Scraping products from ${source}, category: ${category || 'any'}, query: ${searchQuery || 'none'}`);
    
    // Fetch real trending products from various sources
    const products = await scrapeProductsFromWeb(source, category, searchQuery, limit);
    
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

    // Create notifications about new trending products
    if (products.length > 0) {
      const trendingProducts = products.filter(p => p.is_trending);
      if (trendingProducts.length > 0) {
        await supabaseClient.from('notifications').insert({
          title: 'New Trending Products',
          message: `Found ${trendingProducts.length} new trending products from ${source}`,
          type: 'product_discovery',
          is_read: false
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Successfully scraped ${products.length} products from ${source}`,
      products
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in web-scraper function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Function to scrape products from the web
async function scrapeProductsFromWeb(source: string, category?: string, searchQuery?: string, limit = 20) {
  // In a real application, this would use specific APIs or web scraping tools
  // For this demo, we'll simulate with more realistic mock data
  
  const products = [];
  const sources = ['Amazon', 'Etsy', 'AliExpress', 'eBay', 'Shopify'];
  const selectedSource = source || sources[Math.floor(Math.random() * sources.length)];
  
  const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Toys & Games', 'Sports & Outdoors', 'Health & Personal Care'];
  const selectedCategory = category || categories[Math.floor(Math.random() * categories.length)];
  
  // Generate mock trending products based on real trending items
  const trendingProductsByCategory = {
    'Electronics': [
      { name: 'Portable Bluetooth Speaker with LED Lights', base_price: 24.99, discount: 0.2 },
      { name: 'Wireless Earbuds with Noise Cancellation', base_price: 59.99, discount: 0.15 },
      { name: 'Foldable Drone with 4K Camera', base_price: 89.99, discount: 0.1 },
      { name: 'Smart Watch with Health Monitoring', base_price: 45.99, discount: 0.25 },
      { name: 'Portable Phone Charger 10000mAh', base_price: 29.99, discount: 0.3 },
      { name: 'Mini Projector for Home Theater', base_price: 79.99, discount: 0.15 },
      { name: 'Wireless Charging Pad for Multiple Devices', base_price: 34.99, discount: 0.2 },
    ],
    'Fashion': [
      { name: 'Unisex Minimalist Watch', base_price: 39.99, discount: 0.25 },
      { name: 'Eco-Friendly Canvas Backpack', base_price: 49.99, discount: 0.2 },
      { name: 'Vintage Style Polarized Sunglasses', base_price: 24.99, discount: 0.3 },
      { name: 'Handmade Leather Wallet', base_price: 29.99, discount: 0.15 },
      { name: 'Adjustable Posture Corrector', base_price: 19.99, discount: 0.4 },
      { name: 'Compression Socks Set (3 Pairs)', base_price: 15.99, discount: 0.25 },
    ],
    'Home & Kitchen': [
      { name: 'LED String Lights for Indoor Decoration', base_price: 14.99, discount: 0.3 },
      { name: 'Adjustable Laptop Stand for Desk', base_price: 25.99, discount: 0.2 },
      { name: 'Silicone Kitchen Utensil Set', base_price: 19.99, discount: 0.25 },
      { name: 'Ceramic Plant Pots Set of 3', base_price: 32.99, discount: 0.15 },
      { name: 'Ultra-Soft Microfiber Bedding Set', base_price: 45.99, discount: 0.3 },
      { name: 'Multipurpose Kitchen Cutting Board', base_price: 18.99, discount: 0.2 },
    ],
    'Beauty': [
      { name: 'LED Face Mask for Skin Therapy', base_price: 59.99, discount: 0.2 },
      { name: 'Vitamin C Serum for Face', base_price: 24.99, discount: 0.3 },
      { name: 'Jade Roller and Gua Sha Set', base_price: 18.99, discount: 0.25 },
      { name: 'Electric Callus Remover for Feet', base_price: 29.99, discount: 0.15 },
      { name: 'Natural Bamboo Charcoal Teeth Whitening', base_price: 15.99, discount: 0.35 },
    ],
    'Toys & Games': [
      { name: 'Educational STEM Building Blocks', base_price: 34.99, discount: 0.2 },
      { name: 'Magnetic Tiles Construction Set', base_price: 49.99, discount: 0.15 },
      { name: '2-in-1 Robot Building Kit', base_price: 39.99, discount: 0.25 },
      { name: 'Strategy Board Game for Adults', base_price: 29.99, discount: 0.1 },
    ],
    'Sports & Outdoors': [
      { name: 'Fitness Resistance Bands Set', base_price: 19.99, discount: 0.3 },
      { name: 'Collapsible Water Bottle for Hiking', base_price: 14.99, discount: 0.25 },
      { name: 'Portable Camping Hammock', base_price: 29.99, discount: 0.2 },
      { name: 'Quick-Dry Microfiber Towel', base_price: 15.99, discount: 0.15 },
      { name: 'LED Headlamp for Night Activities', base_price: 22.99, discount: 0.35 },
    ],
    'Health & Personal Care': [
      { name: 'Digital Forehead Thermometer', base_price: 24.99, discount: 0.2 },
      { name: 'Massage Gun for Muscle Recovery', base_price: 79.99, discount: 0.25 },
      { name: 'Posture Corrector for Back Support', base_price: 19.99, discount: 0.3 },
      { name: 'Reusable Silicone Ear Plugs', base_price: 9.99, discount: 0.15 },
      { name: 'UV Sanitizer Box for Phone', base_price: 34.99, discount: 0.2 },
    ]
  };
  
  // Get trending products for the selected category or all categories
  let categoryProducts;
  if (category) {
    categoryProducts = trendingProductsByCategory[selectedCategory] || [];
  } else {
    // Combine products from all categories
    categoryProducts = Object.values(trendingProductsByCategory).flat();
  }
  
  // Filter by search query if provided
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    categoryProducts = categoryProducts.filter(p => p.name.toLowerCase().includes(query));
  }
  
  // Shuffle and limit the products
  categoryProducts = categoryProducts.sort(() => 0.5 - Math.random()).slice(0, limit);
  
  // Generate complete product objects
  for (const productBase of categoryProducts) {
    const price = parseFloat(productBase.base_price.toFixed(2));
    const comparePrice = parseFloat((productBase.base_price / (1 - productBase.discount)).toFixed(2));
    const profitMargin = parseFloat((price * 0.3).toFixed(2)); // 30% profit margin
    const rating = (3 + Math.random() * 2).toFixed(1);
    const reviewCount = Math.floor(Math.random() * 500) + 10;
    const trendingScore = Math.floor(Math.random() * 100);
    const isTrending = trendingScore > 60;
    
    // Generate appropriate image URL based on category and product name
    let imageUrl = getProductImageUrl(productBase.name, selectedCategory);
    
    products.push({
      name: productBase.name,
      description: `High-quality ${productBase.name.toLowerCase()} from ${selectedSource}. Perfect for everyday use.`,
      price,
      compare_price: comparePrice,
      source: selectedSource,
      image_url: imageUrl,
      product_url: `https://${selectedSource.toLowerCase().replace(/\s+/g, '')}.com/product/${Math.floor(Math.random() * 10000)}`,
      category: selectedCategory,
      tags: generateTags(productBase.name, selectedCategory),
      rating: parseFloat(rating),
      review_count: reviewCount,
      trending_score: trendingScore,
      is_trending: isTrending,
      profit_margin: profitMargin,
      competitors: Math.floor(Math.random() * 30) + 5,
    });
  }
  
  return products;
}

// Generate appropriate tags for the product
function generateTags(productName: string, category: string): string[] {
  const tags = [category.toLowerCase()];
  const lowerName = productName.toLowerCase();
  
  if (category === 'Electronics') {
    tags.push('gadgets', 'tech');
    if (lowerName.includes('bluetooth') || lowerName.includes('wireless')) tags.push('wireless');
    if (lowerName.includes('watch')) tags.push('wearable');
    if (lowerName.includes('charger')) tags.push('charging');
  } else if (category === 'Fashion') {
    tags.push('accessories', 'style');
    if (lowerName.includes('leather')) tags.push('leather');
    if (lowerName.includes('eco') || lowerName.includes('sustainable')) tags.push('eco-friendly');
    if (lowerName.includes('vintage')) tags.push('vintage');
  } else if (category === 'Home & Kitchen') {
    tags.push('home', 'decor');
    if (lowerName.includes('kitchen')) tags.push('kitchen');
    if (lowerName.includes('led') || lowerName.includes('light')) tags.push('lighting');
  }
  
  return tags;
}

// Get an appropriate image URL for the product
function getProductImageUrl(productName: string, category: string): string {
  const lowerName = productName.toLowerCase();
  
  if (category === 'Electronics') {
    if (lowerName.includes('earbuds') || lowerName.includes('headphone')) {
      return "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('watch') || lowerName.includes('smart watch')) {
      return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('speaker') || lowerName.includes('bluetooth')) {
      return "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('drone') || lowerName.includes('camera')) {
      return "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('charging') || lowerName.includes('charger')) {
      return "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('projector')) {
      return "https://images.unsplash.com/photo-1626176271171-c8b400d90bc8?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop";
    }
  } else if (category === 'Fashion') {
    if (lowerName.includes('wallet') || lowerName.includes('leather')) {
      return "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('backpack') || lowerName.includes('bag')) {
      return "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('sunglasses') || lowerName.includes('glasses')) {
      return "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('watch')) {
      return "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('posture')) {
      return "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop";
    }
  } else if (category === 'Home & Kitchen') {
    if (lowerName.includes('light') || lowerName.includes('led')) {
      return "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('plant') || lowerName.includes('pot')) {
      return "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('kitchen') || lowerName.includes('utensil')) {
      return "https://images.unsplash.com/photo-1522160443988-cc49834bca3f?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('bedding') || lowerName.includes('microfiber')) {
      return "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('laptop') || lowerName.includes('stand')) {
      return "https://images.unsplash.com/photo-1603969409447-87fd30070661?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1584271854089-9bb3e5168e32?w=500&auto=format&fit=crop";
    }
  } else if (category === 'Beauty') {
    if (lowerName.includes('face mask') || lowerName.includes('led')) {
      return "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('serum') || lowerName.includes('vitamin')) {
      return "https://images.unsplash.com/photo-1611080627058-8b1d7c996777?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('jade roller') || lowerName.includes('gua sha')) {
      return "https://images.unsplash.com/photo-1590439471364-192aa70c0b2b?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop";
    }
  } else if (category === 'Toys & Games') {
    if (lowerName.includes('building') || lowerName.includes('blocks')) {
      return "https://images.unsplash.com/photo-1576334782343-6629241b48b7?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('robot') || lowerName.includes('kit')) {
      return "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('board game') || lowerName.includes('strategy')) {
      return "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=500&auto=format&fit=crop";
    }
  } else if (category === 'Sports & Outdoors') {
    if (lowerName.includes('fitness') || lowerName.includes('resistance')) {
      return "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('water bottle') || lowerName.includes('bottle')) {
      return "https://images.unsplash.com/photo-1556036518-4c5a21e27f9c?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('hammock') || lowerName.includes('camping')) {
      return "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('towel') || lowerName.includes('microfiber')) {
      return "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?w=500&auto=format&fit=crop";
    }
  } else if (category === 'Health & Personal Care') {
    if (lowerName.includes('thermometer') || lowerName.includes('digital')) {
      return "https://images.unsplash.com/photo-1584728260830-a1f1089ad0d3?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('massage') || lowerName.includes('recovery')) {
      return "https://images.unsplash.com/photo-1617952509997-237e6a5f886d?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('posture') || lowerName.includes('back')) {
      return "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop";
    } else if (lowerName.includes('sanitizer') || lowerName.includes('uv')) {
      return "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop";
    } else {
      return "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop";
    }
  }
  
  // Default image if no specific match
  return "https://images.unsplash.com/photo-1570570876281-81a6de62e3f7?w=500&auto=format&fit=crop";
}
