import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ExternalLink, PackageOpen, RefreshCw, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OrderDetails {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  amount: number;
  cost: number;
  profit: number;
  status: string;
  order_date: string;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  product: {
    id: string;
    name: string;
    image_url: string | null;
  };
  retailer: {
    name: string;
  };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900">Pending</Badge>;
    case 'processing':
      return <Badge className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 animate-pulse">Processing</Badge>;
    case 'shipped':
      return <Badge className="bg-purple-500 text-white hover:bg-purple-600 relative">
        <span className="relative z-10">Shipped</span>
        <span className="absolute inset-0 bg-purple-400 animate-pulse rounded-full opacity-50"></span>
      </Badge>;
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

const getDeliveryProgress = (status: string) => {
  switch (status) {
    case 'pending':
      return 0;
    case 'processing':
      return 25;
    case 'shipped':
      return 75;
    case 'delivered':
      return 100;
    case 'cancelled':
    case 'refunded':
      return 0;
    default:
      return 0;
  }
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_orders')
        .select(`
          id,
          order_id,
          customer_name,
          customer_email,
          customer_address,
          amount,
          cost,
          profit,
          status,
          order_date,
          estimated_delivery,
          actual_delivery,
          tracking_number,
          tracking_url,
          product:product_id(id, name, image_url),
          retailer:retailer_id(name)
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      
      const formattedOrder: OrderDetails = {
        ...data,
        product: {
          id: Array.isArray(data.product) 
            ? (data.product[0]?.id || '') 
            : (data.product?.id || ''),
          name: Array.isArray(data.product) 
            ? (data.product[0]?.name || '') 
            : (data.product?.name || ''),
          image_url: Array.isArray(data.product) 
            ? (data.product[0]?.image_url || null) 
            : (data.product?.image_url || null)
        },
        retailer: {
          name: Array.isArray(data.retailer) 
            ? (data.retailer[0]?.name || '') 
            : (data.retailer?.name || '')
        }
      };
      
      setOrder(formattedOrder);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    
    const channel = supabase
      .channel(`order-details-${orderId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'user_orders',
        filter: `id=eq.${orderId}` 
      }, (payload) => {
        console.log('Order updated!', payload);
        
        if (payload.old && payload.new && payload.old.status !== payload.new.status) {
          toast({
            title: "Order Status Updated",
            description: `Status changed from ${payload.old.status} to ${payload.new.status}`,
          });
          
          setOrder(current => current ? { ...current, status: payload.new.status } : null);
        } else {
          fetchOrderDetails();
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, toast]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;
    
    setUpdating(true);
    try {
      setOrder(current => current ? { ...current, status: newStatus } : null);
      
      const { error } = await supabase.functions.invoke('update-order-status', {
        body: { orderId: order.id, newStatus },
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      
      fetchOrderDetails();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/orders')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <h1 className="text-2xl font-semibold">Order Details</h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrderDetails}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : order ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Order #{order.order_id}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Order Date</p>
                      <p className="font-medium">{new Date(order.order_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">{formatCurrency(order.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profit</p>
                      <p className="font-medium text-green-600">{formatCurrency(order.profit)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Delivery Status</h3>
                    <Progress value={getDeliveryProgress(order.status)} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Order Placed</span>
                      <span>Processing</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                    
                    {order.estimated_delivery && (
                      <p className="text-sm mt-4">
                        Estimated Delivery: <span className="font-medium">{new Date(order.estimated_delivery).toLocaleDateString()}</span>
                      </p>
                    )}
                    
                    {order.actual_delivery && (
                      <p className="text-sm mt-1">
                        Delivered On: <span className="font-medium">{new Date(order.actual_delivery).toLocaleDateString()}</span>
                      </p>
                    )}
                    
                    {order.tracking_number && (
                      <div className="mt-4 flex flex-col gap-2">
                        <p className="text-sm">
                          Tracking Number: <span className="font-medium">{order.tracking_number}</span>
                        </p>
                        {order.tracking_url && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 w-fit"
                            onClick={() => window.open(order.tracking_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Track Package
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Order Management</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateOrderStatus('processing')}
                        disabled={updating || order.status === 'processing'}
                        className={updating ? 'opacity-50' : ''}
                      >
                        <PackageOpen className="mr-2 h-4 w-4" />
                        Mark as Processing
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateOrderStatus('shipped')}
                        disabled={updating || order.status === 'shipped'}
                        className={updating ? 'opacity-50' : ''}
                      >
                        <Truck className="mr-2 h-4 w-4" />
                        Mark as Shipped
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateOrderStatus('delivered')}
                        disabled={updating || order.status === 'delivered'}
                        className={updating ? 'opacity-50' : ''}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Mark as Delivered
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateOrderStatus('cancelled')}
                        disabled={updating || order.status === 'cancelled'}
                        className={updating ? 'opacity-50' : ''}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    {order.product.image_url && (
                      <div className="shrink-0">
                        <img 
                          src={order.product.image_url} 
                          alt={order.product.name} 
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{order.product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Retailer: {order.retailer.name}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Price:</span>
                          <span className="font-medium">{formatCurrency(order.amount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Cost:</span>
                          <span className="font-medium">{formatCurrency(order.cost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Profit:</span>
                          <span className="font-medium text-green-600">{formatCurrency(order.profit)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Customer Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{order.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{order.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Shipping Address</p>
                      <p className="font-medium whitespace-pre-line">{order.customer_address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Product Cost:</span>
                      <span>{formatCurrency(order.cost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Profit:</span>
                      <span className="text-green-600">{formatCurrency(order.profit)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>{formatCurrency(order.amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md">
            <p className="text-muted-foreground">Order not found</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/orders')}
              className="mt-4"
            >
              Back to Orders
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderDetails;
