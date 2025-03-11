
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { ExternalLink, MoreHorizontal, RefreshCw, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  status: string;
  order_date: string;
  tracking_number: string | null;
  tracking_url: string | null;
  product: {
    name: string;
  };
  retailer: {
    name: string;
  };
}

export const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
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
        `)
        .order('order_date', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
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
    
    // Set up a realtime subscription for orders
    const channel = supabase
      .channel('orders-table-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_orders',
        filter: user ? `user_id=eq.${user.id}` : undefined
      }, (payload) => {
        console.log('Order table change received!', payload);
        
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          // Fetch the complete order with relations instead of using payload.new directly
          fetchOrders();
        } 
        else if (payload.eventType === 'UPDATE') {
          setOrders(currentOrders => 
            currentOrders.map(order => 
              order.id === payload.new.id 
                ? { ...order, ...payload.new } 
                : order
            )
          );
          
          // Show a toast notification for status changes
          if (payload.old && payload.new.status !== payload.old.status) {
            toast({
              title: `Order #${payload.new.order_id} Updated`,
              description: `Status changed from ${payload.old.status} to ${payload.new.status}`,
            });
          }
        } 
        else if (payload.eventType === 'DELETE') {
          setOrders(currentOrders => 
            currentOrders.filter(order => order.id !== payload.old.id)
          );
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Optimistic update for better UX
      setOrders(currentOrders => 
        currentOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );
      
      const { error } = await supabase.functions.invoke('update-order-status', {
        body: { orderId, newStatus },
      });
      
      if (error) throw error;
      
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
      
      // Revert to original data if there was an error
      fetchOrders();
    }
  };

  const viewOrderDetails = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">No orders found</p>
        <p className="text-sm mt-2">When you place orders, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Retailer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="group">
              <TableCell className="font-medium">{order.order_id}</TableCell>
              <TableCell>{order.product?.name}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.retailer?.name}</TableCell>
              <TableCell>{formatCurrency(order.amount)}</TableCell>
              <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => viewOrderDetails(order.id)}
                      className="flex items-center cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    
                    {order.tracking_url && (
                      <DropdownMenuItem 
                        onClick={() => window.open(order.tracking_url!, '_blank')}
                        className="flex items-center cursor-pointer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Track Package
                      </DropdownMenuItem>
                    )}
                    
                    {/* Status update options */}
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                      disabled={order.status === 'processing'}
                      className="cursor-pointer"
                    >
                      Mark as Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      disabled={order.status === 'shipped'}
                      className="cursor-pointer"
                    >
                      Mark as Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      disabled={order.status === 'delivered'}
                      className="cursor-pointer"
                    >
                      Mark as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      disabled={order.status === 'cancelled'}
                      className="cursor-pointer"
                    >
                      Mark as Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
