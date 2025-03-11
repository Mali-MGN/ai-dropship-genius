
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TabsContent, Tabs } from "@/components/ui/tabs";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersTabs } from "@/components/orders/OrdersTabs";
import { OrdersStats } from "@/components/orders/OrdersStats";
import { OrdersList } from "@/components/orders/OrdersList";
import { FinancialStats } from "@/components/dashboard/FinancialStats";
import { ImportedProducts } from "@/components/dashboard/ImportedProducts";
import { InventoryManagement } from "@/components/dashboard/InventoryManagement";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [notifications, setNotifications] = useState([]);
  const { toast } = useToast();
  
  // Fetch recent notifications when the component mounts
  useEffect(() => {
    // Fetch recent notifications
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up real-time subscription for notifications
    const notificationsChannel = supabase
      .channel('notifications-channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        console.log('New notification received!', payload);
        if (payload.new) {
          // Add the new notification to the state
          setNotifications(prev => [payload.new, ...prev.slice(0, 4)]);
          
          // Show a toast for the new notification
          toast({
            title: payload.new.title,
            description: payload.new.message,
          });
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [toast]);
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <OrdersHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <OrdersTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <TabsContent value="orders" className="space-y-6">
            <OrdersStats />
            <OrdersList />
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-6">
            <InventoryManagement />
            <ImportedProducts />
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
