
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MoreHorizontal, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      .channel('public:user_orders')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_orders',
        filter: `user_id=eq.${user?.id}` 
      }, (payload) => {
        console.log('Change received!', payload);
        fetchOrders();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.functions.invoke('update-order-status', {
        body: { orderId, newStatus },
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Order status updated",
      });
      
      // Refresh the orders list
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Processing</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Cancelled</Badge>;
      case 'refunded':
        return <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">Refunded</Badge>;
      default:
        return null;
    }
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
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.order_id}</TableCell>
              <TableCell>{order.product?.name}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.retailer?.name}</TableCell>
              <TableCell>{formatCurrency(order.amount)}</TableCell>
              <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
                      className="cursor-pointer"
                    >
                      Mark as Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      className="cursor-pointer"
                    >
                      Mark as Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="cursor-pointer"
                    >
                      Mark as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
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
