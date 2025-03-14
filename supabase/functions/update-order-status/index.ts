
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
    const { orderId, newStatus } = await req.json()

    if (!orderId || !newStatus) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate the status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    if (!validStatuses.includes(newStatus)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status value' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the current order status to create a more informative notification
    const { data: currentOrder, error: fetchError } = await supabaseClient
      .from('user_orders')
      .select('order_id, status')
      .eq('id', orderId)
      .single()

    if (fetchError) {
      console.error('Error fetching current order status:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch order details', details: fetchError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Skip update if status hasn't changed
    if (currentOrder.status === newStatus) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Order status is already set to this value', 
          order: currentOrder 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }
    
    // Update the order in the database
    const { data: order, error: orderError } = await supabaseClient
      .from('user_orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        actual_delivery: newStatus === 'delivered' ? new Date().toISOString() : null
      })
      .eq('id', orderId)
      .eq('user_id', user.id) // Ensure the order belongs to the user
      .select()
      .single()

    if (orderError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update order', details: orderError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create a notification about the status change
    const notificationMessage = `Order #${order.order_id} status changed from ${currentOrder.status} to ${newStatus}`;
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: user.id,
        title: `Order ${order.order_id} Status Updated`,
        message: notificationMessage,
        type: 'order_status',
        reference_id: orderId,
        is_read: false
      })

    if (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Continue execution - non-critical error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order status updated successfully', 
        order 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error updating order status:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
