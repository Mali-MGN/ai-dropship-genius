
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/orders";
import { useToast } from "@/components/ui/use-toast";

interface UseOrdersRealtimeProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  fetchOrders: () => Promise<void>;
}

export function useOrdersRealtime({
  orders,
  setOrders,
  fetchOrders
}: UseOrdersRealtimeProps) {
  const [realTimeStatus, setRealTimeStatus] = useState<{[key: string]: boolean}>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {    
    if (!user) return;
    
    const channel = supabase
      .channel('orders-table-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_orders',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload: any) => {
          console.log('Order table change received!', payload);
          
          const newData = payload.new;
          const oldData = payload.old;
          const eventType = payload.eventType;
          
          if (newData && newData.id) {
            setRealTimeStatus(prev => ({...prev, [newData.id]: true}));
            
            setTimeout(() => {
              setRealTimeStatus(current => {
                const updated = {...current};
                delete updated[newData.id];
                return updated;
              });
            }, 3000);
          }
          
          if (eventType === 'INSERT') {
            fetchOrders();
            
            toast({
              title: "New Order Received",
              description: `Order #${newData.order_id} has been created`,
              variant: "default",
            });
          } 
          else if (eventType === 'UPDATE') {
            setOrders(currentOrders => 
              currentOrders.map(order => 
                order.id === newData.id 
                  ? { ...order, ...newData } 
                  : order
              )
            );
            
            if (oldData && newData.status !== oldData.status) {
              toast({
                title: `Order #${newData.order_id} Updated`,
                description: `Status changed from ${oldData.status} to ${newData.status}`,
              });
              
              createStatusChangeNotification(newData.order_id || '', newData.id, oldData.status || '', newData.status || '');
            }
          } 
          else if (eventType === 'DELETE') {
            setOrders(currentOrders => 
              currentOrders.filter(order => order.id !== oldData?.id)
            );
            
            toast({
              title: "Order Removed",
              description: `Order #${oldData?.order_id} has been removed`,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, fetchOrders, setOrders]);

  const createStatusChangeNotification = async (orderId: string, referenceId: string, oldStatus: string, newStatus: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'order_status_change',
          title: `Order Status Updated`,
          message: `Order #${orderId} status changed from ${oldStatus} to ${newStatus}`,
          reference_id: referenceId,
          is_read: false
        });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return { realTimeStatus };
}
