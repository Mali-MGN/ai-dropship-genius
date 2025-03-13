
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface InventoryBadgeProps {
  productId: string;
}

export const InventoryBadge: React.FC<InventoryBadgeProps> = ({ productId }) => {
  const [inStock, setInStock] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInventoryStatus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scraped_products')
        .select('in_stock')
        .eq('id', productId)
        .single();

      if (error) {
        console.error("Error fetching inventory status:", error);
        setLoading(false);
        return;
      }

      setInStock(data?.in_stock ?? false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryStatus();

    const inventoryChannel = supabase
      .channel('inventory-badge-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'scraped_products',
          filter: `id=eq.${productId}`
        },
        (payload) => {
          console.log('Inventory change for badge:', payload);
          fetchInventoryStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
    };
  }, [productId]);

  if (loading) {
    return <Badge variant="secondary">Loading...</Badge>;
  }

  if (inStock === null) {
    return <Badge variant="destructive">Error</Badge>;
  }

  return (
    <Badge variant={inStock ? "default" : "destructive"}>
      {inStock ? "In Stock" : "Out of Stock"}
    </Badge>
  );
};
