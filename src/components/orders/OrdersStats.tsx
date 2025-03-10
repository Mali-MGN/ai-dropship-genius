
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const OrdersStats = () => {
  const [stats, setStats] = useState({
    newOrdersCount: 0,
    processingCount: 0,
    deliveredCount: 0,
    cancelledCount: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrderStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data: orders, error } = await supabase
          .from('user_orders')
          .select('status')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Calculate order counts by status
        const newOrders = orders?.filter(order => order.status === 'pending') || [];
        const processing = orders?.filter(order => order.status === 'processing') || [];
        const delivered = orders?.filter(order => order.status === 'delivered') || [];
        const cancelled = orders?.filter(order => order.status === 'cancelled') || [];
        
        setStats({
          newOrdersCount: newOrders.length,
          processingCount: processing.length,
          deliveredCount: delivered.length,
          cancelledCount: cancelled.length
        });
      } catch (error) {
        console.error('Error fetching order stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderStats();
    
    // Set up real-time subscription for orders table
    const ordersChannel = supabase
      .channel('orders-stats-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_orders',
        filter: user ? `user_id=eq.${user.id}` : undefined
      }, () => {
        // Refetch stats when orders change
        fetchOrderStats();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [user]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-primary">{stats.newOrdersCount}</div>
            <p className="text-sm text-muted-foreground">New Orders</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.processingCount}</div>
            <p className="text-sm text-muted-foreground">Processing</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-green-500">{stats.deliveredCount}</div>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-red-500">{stats.cancelledCount}</div>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
