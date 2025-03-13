
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { supabase } from "@/integrations/supabase/client";

export const InventoryManagement = () => {
  const [inventoryCount, setInventoryCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scraped_products')
        .select('in_stock, stock_quantity');

      if (error) {
        console.error("Error fetching inventory:", error);
        return;
      }

      let total = 0;
      let lowStock = 0;
      let outOfStock = 0;

      data.forEach(item => {
        if (item.in_stock === true) {
          total++;
          if (item.stock_quantity !== null && item.stock_quantity <= 10) {
            lowStock++;
          }
        } else {
          outOfStock++;
        }
      });

      setInventoryCount(total);
      setLowStockCount(lowStock);
      setOutOfStockCount(outOfStock);
    } catch (error) {
      console.error("Error processing inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();

    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'scraped_products' 
        }, 
        (payload) => {
          console.log('Inventory change received:', payload);
          fetchInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
        <CardDescription>Track your product stock levels.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Products in Stock"
          value={inventoryCount.toString()}
          isLoading={loading}
        />
        <MetricCard
          title="Products with Low Stock"
          value={lowStockCount.toString()}
          isLoading={loading}
        />
        <MetricCard
          title="Products Out of Stock"
          value={outOfStockCount.toString()}
          isLoading={loading}
        />
      </CardContent>
    </Card>
  );
};
