
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SaleData {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  created_at: string;
}

export function RecentSales() {
  const [sales, setSales] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSales = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("user_orders")
          .select("id, customer_name, customer_email, amount, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        
        // Transform the data to match our expected structure
        const formattedData = data.map(sale => ({
          id: sale.id,
          customer_name: sale.customer_name || "Anonymous Customer",
          customer_email: sale.customer_email || "no-email@example.com",
          total_amount: sale.amount || 0,
          created_at: sale.created_at
        }));
        
        setSales(formattedData);
      } catch (error) {
        console.error("Error fetching recent sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSales();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>
          You made {sales.length} sales in the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="ml-4 space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {sales.map((sale) => (
              <div key={sale.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://avatar.vercel.sh/${sale.customer_email}`} alt={sale.customer_name} />
                  <AvatarFallback>{getInitials(sale.customer_name)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{sale.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{sale.customer_email}</p>
                </div>
                <div className="ml-auto font-medium">+${sale.total_amount.toFixed(2)}</div>
              </div>
            ))}
            
            {sales.length === 0 && !loading && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No recent sales found</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
