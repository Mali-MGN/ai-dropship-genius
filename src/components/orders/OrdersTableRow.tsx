
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/orders";
import { formatCurrency } from "@/lib/utils";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrdersTableRowProps {
  order: Order;
  realTimeHighlight: boolean;
  isUpdating: boolean;
  onViewDetails: (orderId: string) => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

export const OrdersTableRow: React.FC<OrdersTableRowProps> = ({
  order,
  realTimeHighlight,
  isUpdating,
  onViewDetails,
  onUpdateStatus,
}) => {
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TableRow
      className={`${realTimeHighlight ? "bg-primary/5 transition-colors duration-1000" : ""}`}
    >
      <TableCell className="font-medium">#{order.order_id}</TableCell>
      <TableCell>{order.product?.name || "N/A"}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{order.customer_name}</span>
          <span className="text-xs text-muted-foreground">{order.customer_email}</span>
        </div>
      </TableCell>
      <TableCell>{order.retailer?.name || "N/A"}</TableCell>
      <TableCell>{formatCurrency(order.amount)}</TableCell>
      <TableCell>{formatDate(order.order_date)}</TableCell>
      <TableCell>
        <Badge
          variant={
            order.status === "delivered"
              ? "success"
              : order.status === "shipped"
              ? "default"
              : order.status === "processing"
              ? "outline"
              : order.status === "cancelled"
              ? "destructive"
              : "secondary"
          }
          className={`${isUpdating ? "opacity-50 animate-pulse" : ""}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(order.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isUpdating}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <DropdownMenuItem onClick={() => onViewDetails(order.id)}>
                  View Details
                </DropdownMenuItem>
              )}
              {statusOptions
                .filter((option) => option.value !== order.status)
                .map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => onUpdateStatus(order.id, option.value)}
                  >
                    Mark as {option.label}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};
