
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TabsContent, Tabs } from "@/components/ui/tabs";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersTabs } from "@/components/orders/OrdersTabs";
import { OrdersStats } from "@/components/orders/OrdersStats";
import { OrdersList } from "@/components/orders/OrdersList";
import { FinancialStats } from "@/components/dashboard/FinancialStats";
import { ImportedProducts } from "@/components/dashboard/ImportedProducts";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orderStats, setOrderStats] = useState({
    newOrdersCount: 0,
    processingCount: 0,
    deliveredCount: 0,
    cancelledCount: 0
  });
  const { toast } = useToast();
  
  // Fetch order statistics when the component mounts
  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const { data: orders, error } = await supabase
          .from('user_orders')
          .select('status');
        
        if (error) throw error;
        
        // Calculate order counts by status
        const stats = {
          newOrdersCount: orders.filter(order => order.status === 'pending').length,
          processingCount: orders.filter(order => order.status === 'processing').length,
          deliveredCount: orders.filter(order => order.status === 'delivered').length,
          cancelledCount: orders.filter(order => order.status === 'cancelled').length
        };
        
        setOrderStats(stats);
      } catch (error) {
        console.error('Error fetching order stats:', error);
      }
    };
    
    fetchOrderStats();
    
    // Set up real-time subscription for orders table
    const channel = supabase
      .channel('public:user_orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_orders'
      }, (payload) => {
        console.log('Order change received!', payload);
        // Refetch stats when orders change
        fetchOrderStats();
        
        // Show toast notification for status updates
        if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
          if (payload.new.status !== payload.old.status) {
            toast({
              title: "Order Status Updated",
              description: `Order #${payload.new.order_id} status changed to ${payload.new.status}`,
            });
          }
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <OrdersHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <OrdersTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <TabsContent value="orders" className="space-y-6">
            <OrdersStats 
              newOrdersCount={orderStats.newOrdersCount}
              processingCount={orderStats.processingCount}
              deliveredCount={orderStats.deliveredCount}
              cancelledCount={orderStats.cancelledCount}
            />
            <ImportedProducts />
            <OrdersList />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <FinancialStats />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </MainLayout>
  );
};

export default Orders;
