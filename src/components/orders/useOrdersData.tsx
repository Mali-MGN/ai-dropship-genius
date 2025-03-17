
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/orders";

interface UseOrdersDataProps {
  filterStatus: string;
  sortField: string;
  sortOrder: string;
  toast: any; // Replace with proper type from your toast library
}

export function useOrdersData({ 
  filterStatus, 
  sortField, 
  sortOrder,
  toast 
}: UseOrdersDataProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('user_orders')
        .select(`
          id,
          order_id,
          customer_name,
          customer_email,
          amount,
          status,
          order_date,
          tracking_number,
          tracking_url,
          product:product_id(name),
          retailer:retailer_id(name)
        `, { count: 'exact' });
      
      // Add user_id filter to only get current user's orders
      query = query.eq('user_id', user.id);
      
      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }
      
      query = query.order(sortField, { ascending: sortOrder === 'asc' });
      
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Cast the data to the correct type
      const formattedOrders = (data || []).map(item => ({
        ...item,
        // Ensure product and retailer are objects not arrays
        product: { 
          name: item.product && typeof item.product === 'object' ? 
            // Handle both array and object cases
            Array.isArray(item.product) 
              ? (item.product[0]?.name || 'Unknown') 
              : (item.product.name || 'Unknown')
            : 'Unknown'
        },
        retailer: { 
          name: item.retailer && typeof item.retailer === 'object' ? 
            // Handle both array and object cases
            Array.isArray(item.retailer) 
              ? (item.retailer[0]?.name || 'Unknown') 
              : (item.retailer.name || 'Unknown')
            : 'Unknown'
        }
      })) as Order[];
      
      setOrders(formattedOrders);
      setTotalOrders(count || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, user, filterStatus, sortField, sortOrder]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      setOrders(currentOrders => 
        currentOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
      
      const { data, error } = await supabase.functions.invoke('update-order-status', {
        body: { orderId, newStatus },
      });
      
      if (error) {
        console.error('Error updating order:', error, data); // Log both error and data for better debugging
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Order status updated",
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      
      fetchOrders();
    } finally {
      setUpdatingOrder(null);
    }
  };

  return {
    orders,
    setOrders,
    loading,
    updatingOrder,
    page,
    setPage,
    totalOrders,
    pageSize,
    fetchOrders,
    updateOrderStatus
  };
}
