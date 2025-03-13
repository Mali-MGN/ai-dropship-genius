
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
import { ExternalLink, MoreHorizontal, RefreshCw, Eye, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

// Define type for the real-time payload
interface RealtimePayload {
  new: {
    id: string;
    order_id?: string;
    status?: string;
    [key: string]: any;
  };
  old?: {
    id: string;
    order_id?: string;
    status?: string;
    [key: string]: any;
  };
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

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
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null); // Order ID being updated
  const [realTimeStatus, setRealTimeStatus] = useState<{[key: string]: boolean}>({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
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
        `, { count: 'exact' })
        .order('order_date', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      setOrders(data || []);
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
  }, [page, user]);
  
  useEffect(() => {    
    // Set up a realtime subscription for orders
    const channel = supabase
      .channel('orders-table-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_orders',
          filter: user ? `user_id=eq.${user.id}` : undefined
        }, 
        (payload: RealtimePayload) => {
          console.log('Order table change received!', payload);
          
          // Visual indicator for real-time updates
          if (payload.new && payload.new.id) {
            setRealTimeStatus({...realTimeStatus, [payload.new.id]: true});
            
            // Reset the visual indicator after 3 seconds
            setTimeout(() => {
              setRealTimeStatus(current => {
                const updated = {...current};
                delete updated[payload.new.id];
                return updated;
              });
            }, 3000);
          }
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // Fetch the complete order with relations instead of using payload.new directly
            fetchOrders();
            
            toast({
              title: "New Order Received",
              description: `Order #${payload.new.order_id} has been created`,
              variant: "default",
            });
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
              
              // Create a notification in the database
              createStatusChangeNotification(payload.new.order_id as string, payload.new.id, payload.old.status as string, payload.new.status as string);
            }
          } 
          else if (payload.eventType === 'DELETE') {
            setOrders(currentOrders => 
              currentOrders.filter(order => order.id !== payload.old?.id)
            );
            
            toast({
              title: "Order Removed",
              description: `Order #${payload.old?.order_id} has been removed`,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId); // Set the updating state
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
    } finally {
      setUpdatingOrder(null); // Clear the updating state
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

  const totalPages = Math.ceil(totalOrders / pageSize);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between mb-4">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Bell className="h-4 w-4" />
          <span>Real-time updates enabled</span>
        </div>
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
            <TableRow 
              key={order.id} 
              className={`group 
                ${realTimeStatus[order.id] ? 'bg-primary-50 dark:bg-primary-950 transition-colors duration-1000' : ''}
                ${updatingOrder === order.id ? 'opacity-70' : ''}`}
            >
              <TableCell className="font-medium">{order.order_id}</TableCell>
              <TableCell>{order.product?.name}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.retailer?.name}</TableCell>
              <TableCell>{formatCurrency(order.amount)}</TableCell>
              <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  {updatingOrder === order.id && (
                    <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
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
                      disabled={order.status === 'processing' || updatingOrder === order.id}
                      className="cursor-pointer"
                    >
                      Mark as Processing
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      disabled={order.status === 'shipped' || updatingOrder === order.id}
                      className="cursor-pointer"
                    >
                      Mark as Shipped
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      disabled={order.status === 'delivered' || updatingOrder === order.id}
                      className="cursor-pointer"
                    >
                      Mark as Delivered
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      disabled={order.status === 'cancelled' || updatingOrder === order.id}
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
      
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => {
                  // Show first page, last page, current page, and pages around current
                  return p === 1 || p === totalPages || 
                         (p >= page - 1 && p <= page + 1);
                })
                .map((p, i, arr) => {
                  // If there's a gap, show ellipsis
                  const showEllipsisBefore = i > 0 && arr[i-1] !== p - 1;
                  const showEllipsisAfter = i < arr.length - 1 && arr[i+1] !== p + 1;
                  
                  return (
                    <React.Fragment key={p}>
                      {showEllipsisBefore && (
                        <PaginationItem>
                          <span className="flex h-9 w-9 items-center justify-center">...</span>
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationLink
                          isActive={page === p}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                      
                      {showEllipsisAfter && (
                        <PaginationItem>
                          <span className="flex h-9 w-9 items-center justify-center">...</span>
                        </PaginationItem>
                      )}
                    </React.Fragment>
                  );
                })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
