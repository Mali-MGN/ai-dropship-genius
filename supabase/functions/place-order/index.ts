
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user information
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Parse the request body
    const { productId, retailerId, customerDetails } = await req.json()

    if (!productId || !retailerId || !customerDetails) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get product details
    const { data: product, error: productError } = await supabaseClient
      .from('scraped_products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: 'Product not found', details: productError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Get retailer details
    const { data: retailer, error: retailerError } = await supabaseClient
      .from('integrated_retailers')
      .select('*')
      .eq('id', retailerId)
      .single()

    if (retailerError || !retailer) {
      return new Response(
        JSON.stringify({ error: 'Retailer not found', details: retailerError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // In a real implementation, we would call the retailer's API here
    // For now, we'll simulate a successful order with mock data
    console.log(`Placing order with ${retailer.name} for product ${product.name}`)
    
    // Generate mock order data
    const mockOrderId = `ORD-${Math.floor(Math.random() * 10000)}`
    const mockTrackingNumber = `TRK-${Math.floor(Math.random() * 100000)}`
    const mockTrackingUrl = `https://${retailer.name.toLowerCase().replace(' ', '')}.com/track/${mockTrackingNumber}`
    
    // Calculate profit (this would normally come from the retailer API)
    const orderCost = product.price * 0.7 // Assuming 30% markup
    const orderProfit = product.price - orderCost
    
    // Create the order in the database
    const { data: order, error: orderError } = await supabaseClient
      .from('user_orders')
      .insert({
        user_id: user.id,
        product_id: productId,
        retailer_id: retailerId,
        order_id: mockOrderId,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_address: customerDetails.address,
        amount: product.price,
        cost: orderCost,
        profit: orderProfit,
        status: 'processing',
        tracking_number: mockTrackingNumber,
        tracking_url: mockTrackingUrl,
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create order', details: orderError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order placed successfully', 
        order 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error processing order:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
