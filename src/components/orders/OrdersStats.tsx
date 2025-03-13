
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

// Define type for the real-time payload
interface RealtimePayload {
  new: {
    id?: string;
    status?: string;
    [key: string]: any;
  };
  old?: {
    id?: string;
    status?: string;
    [key: string]: any;
  };
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

export const OrdersStats = () => {
  const [stats, setStats] = useState({
    newOrdersCount: 0,
    processingCount: 0,
    deliveredCount: 0,
    cancelledCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [updatedStats, setUpdatedStats] = useState<{[key: string]: boolean}>({});
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
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_orders',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, 
        (payload: RealtimePayload) => {
          console.log('Order stats change received:', payload);
          
          // Visual indicator for updated stats
          const statusKey = payload.new?.status || payload.old?.status;
          
          if (statusKey) {
            const updateKey = statusKey === 'pending' ? 'newOrdersCount' : 
                          statusKey === 'processing' ? 'processingCount' :
                          statusKey === 'delivered' ? 'deliveredCount' : 
                          'cancelledCount';
                          
            setUpdatedStats({...updatedStats, [updateKey]: true});
            
            // Reset the visual indicator after 2 seconds
            setTimeout(() => {
              setUpdatedStats(current => {
                const updated = {...current};
                delete updated[updateKey];
                return updated;
              });
            }, 2000);
          }
          
          // Refetch stats when orders change
          fetchOrderStats();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [user]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className={updatedStats.newOrdersCount ? 'ring-2 ring-primary transition-all duration-500' : ''}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="text-2xl font-bold text-primary">{stats.newOrdersCount}</div>
              {updatedStats.newOrdersCount && (
                <RefreshCw className="absolute -top-3 -right-5 h-4 w-4 text-primary animate-spin" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              New Orders
              {updatedStats.newOrdersCount && (
                <Badge variant="outline" className="ml-2 bg-primary/10">Updated</Badge>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className={updatedStats.processingCount ? 'ring-2 ring-blue-500 transition-all duration-500' : ''}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="text-2xl font-bold text-blue-500">{stats.processingCount}</div>
              {updatedStats.processingCount && (
                <RefreshCw className="absolute -top-3 -right-5 h-4 w-4 text-blue-500 animate-spin" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Processing
              {updatedStats.processingCount && (
                <Badge variant="outline" className="ml-2 bg-blue-500/10">Updated</Badge>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className={updatedStats.deliveredCount ? 'ring-2 ring-green-500 transition-all duration-500' : ''}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="text-2xl font-bold text-green-500">{stats.deliveredCount}</div>
              {updatedStats.deliveredCount && (
                <RefreshCw className="absolute -top-3 -right-5 h-4 w-4 text-green-500 animate-spin" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Delivered
              {updatedStats.deliveredCount && (
                <Badge variant="outline" className="ml-2 bg-green-500/10">Updated</Badge>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className={updatedStats.cancelledCount ? 'ring-2 ring-red-500 transition-all duration-500' : ''}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="text-2xl font-bold text-red-500">{stats.cancelledCount}</div>
              {updatedStats.cancelledCount && (
                <RefreshCw className="absolute -top-3 -right-5 h-4 w-4 text-red-500 animate-spin" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Cancelled
              {updatedStats.cancelledCount && (
                <Badge variant="outline" className="ml-2 bg-red-500/10">Updated</Badge>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
