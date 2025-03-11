
import { Badge } from "@/components/ui/badge";
import { Check, Clock, PackageOpen, RefreshCw, Truck, X, AlertTriangle } from "lucide-react";

type StatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'inventory' | 'payment';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'inventory'; // default is for orders, inventory for stock status
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
}

export const StatusBadge = ({ 
  status, 
  variant = 'default',
  showIcon = true, 
  className = "", 
  animated = true 
}: StatusBadgeProps) => {
  
  // Handle inventory status display
  if (variant === 'inventory') {
    switch (status.toLowerCase()) {
      case 'in stock':
        return (
          <Badge variant="success" className={`flex items-center gap-1 ${className}`}>
            {showIcon && <Check className="h-3.5 w-3.5" />}
            In Stock
          </Badge>
        );
      case 'low stock':
        return (
          <Badge variant="warning" className={`flex items-center gap-1 ${className}`}>
            {showIcon && <AlertTriangle className="h-3.5 w-3.5" />}
            Low Stock
          </Badge>
        );
      case 'out of stock':
        return (
          <Badge variant="destructive" className={`flex items-center gap-1 ${className}`}>
            {showIcon && <X className="h-3.5 w-3.5" />}
            Out of Stock
          </Badge>
        );
      default:
        return null;
    }
  }
  
  // Handle order status display
  switch (status) {
    case 'pending':
      return (
        <Badge 
          variant="outline" 
          className={`bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-900 flex items-center gap-1 ${className}`}
        >
          {showIcon && <Clock className="h-3.5 w-3.5" />}
          Pending
        </Badge>
      );
    case 'processing':
      return (
        <Badge 
          className={`bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1 ${className} ${animated ? 'transition-colors duration-300 animate-pulse' : ''}`}
        >
          {showIcon && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
          Processing
        </Badge>
      );
    case 'shipped':
      return (
        <Badge 
          className={`bg-purple-500 text-white hover:bg-purple-600 flex items-center gap-1 relative ${className}`}
        >
          {showIcon && <Truck className="h-3.5 w-3.5" />}
          <span className="relative z-10">Shipped</span>
          {animated && <span className="absolute inset-0 bg-purple-400 animate-pulse rounded-full opacity-50"></span>}
        </Badge>
      );
    case 'delivered':
      return (
        <Badge 
          variant="success" 
          className={`flex items-center gap-1 ${className}`}
        >
          {showIcon && <Check className="h-3.5 w-3.5" />}
          Delivered
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge 
          variant="destructive" 
          className={`flex items-center gap-1 ${className}`}
        >
          {showIcon && <X className="h-3.5 w-3.5" />}
          Cancelled
        </Badge>
      );
    case 'refunded':
      return (
        <Badge 
          className={`bg-yellow-500 text-black hover:bg-yellow-600 flex items-center gap-1 ${className}`}
        >
          {showIcon && <RefreshCw className="h-3.5 w-3.5" />}
          Refunded
        </Badge>
      );
    default:
      return null;
  }
};
