
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Bell } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrdersTableRow } from "./OrdersTableRow";
import { OrdersPagination } from "./OrdersPagination";
import { useOrdersData } from "./useOrdersData";
import { useOrdersRealtime } from "./useOrdersRealtime";

export const OrdersTable = () => {
  const [filterStatus, setFilterStatus] = React.useState('');
  const [sortField, setSortField] = React.useState('order_date');
  const [sortOrder, setSortOrder] = React.useState('desc');
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
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
  } = useOrdersData({
    filterStatus,
    sortField,
    sortOrder,
    toast
  });

  const { realTimeStatus } = useOrdersRealtime({
    orders,
    setOrders,
    fetchOrders
  });

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
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-3">
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Bell className="h-4 w-4" />
          <span>Real-time updates enabled</span>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order_date">Order Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="customer_name">Customer Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>

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
            <OrdersTableRow
              key={order.id}
              order={order}
              realTimeHighlight={!!realTimeStatus[order.id]}
              isUpdating={updatingOrder === order.id}
              onViewDetails={viewOrderDetails}
              onUpdateStatus={updateOrderStatus}
            />
          ))}
        </TableBody>
      </Table>
      
      {totalPages > 1 && (
        <OrdersPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};
