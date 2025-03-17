
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
      
      // Transform data to match the Order interface
      const transformedData: Order[] = (data || []).map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        customer_name: item.customer_name,
        customer_email: item.customer_email,
        amount: item.amount,
        status: item.status,
        order_date: item.order_date,
        tracking_number: item.tracking_number,
        tracking_url: item.tracking_url,
        product: item.product ? { name: item.product.name } : null,
        retailer: item.retailer ? { name: item.retailer.name } : null
      }));
      
      setOrders(transformedData);
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
