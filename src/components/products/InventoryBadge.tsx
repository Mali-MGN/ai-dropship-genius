
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define type for the real-time payload
interface RealtimePayload {
  new: {
    id: string;
    in_stock?: boolean;
    stock_quantity?: number;
    [key: string]: any;
  };
  old?: {
    id: string;
    [key: string]: any;
  };
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
}

interface InventoryBadgeProps {
  inStock: boolean;
  quantity: number | null;
  lowStockThreshold?: number;
  className?: string;
  productId?: string;
}

export const InventoryBadge = ({ 
  inStock: initialInStock, 
  quantity: initialQuantity, 
  lowStockThreshold = 10,
  className = "",
  productId 
}: InventoryBadgeProps) => {
  const [inStock, setInStock] = useState(initialInStock);
  const [quantity, setQuantity] = useState(initialQuantity);
  
  useEffect(() => {
    // Update local state when props change
    setInStock(initialInStock);
    setQuantity(initialQuantity);
  }, [initialInStock, initialQuantity]);
  
  useEffect(() => {
    // Only set up real-time monitoring if we have a productId
    if (!productId) return;
    
    const channel = supabase
      .channel(`inventory-badge-${productId}`)
      .on(
        'postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scraped_products',
          filter: `id=eq.${productId}`
        }, 
        (payload: RealtimePayload) => {
          console.log('Real-time inventory update received:', payload);
          if (payload.new) {
            setInStock(payload.new.in_stock !== null ? payload.new.in_stock : true);
            setQuantity(payload.new.stock_quantity);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);
  
  if (!inStock || quantity === 0) {
    return <StatusBadge status="out of stock" variant="inventory" className={className} />;
  }
  
  if (quantity !== null && quantity <= lowStockThreshold) {
    return <StatusBadge status="low stock" variant="inventory" className={className} />;
  }
  
  return <StatusBadge status="in stock" variant="inventory" className={className} />;
};
