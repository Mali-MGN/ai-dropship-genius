
import { StatusBadge } from "@/components/orders/StatusBadge";

interface InventoryBadgeProps {
  inStock: boolean;
  quantity: number | null;
  lowStockThreshold?: number;
  className?: string;
}

export const InventoryBadge = ({ 
  inStock, 
  quantity, 
  lowStockThreshold = 10,
  className = "" 
}: InventoryBadgeProps) => {
  
  if (!inStock || quantity === 0) {
    return <StatusBadge status="out of stock" variant="inventory" className={className} />;
  }
  
  if (quantity !== null && quantity <= lowStockThreshold) {
    return <StatusBadge status="low stock" variant="inventory" className={className} />;
  }
  
  return <StatusBadge status="in stock" variant="inventory" className={className} />;
};
