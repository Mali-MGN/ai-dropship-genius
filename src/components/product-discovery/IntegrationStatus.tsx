
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, RefreshCcw, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface RetailerIntegration {
  id: string;
  name: string;
  active: boolean;
  last_synced?: string;
  product_count?: number;
}

export function IntegrationStatus() {
  const [integrations, setIntegrations] = useState<RetailerIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadIntegrations();
      setupRealtimeSubscription();
    }
  }, [user]);

  const loadIntegrations = async () => {
    setLoading(true);
    
    try {
      // Get all active retailer integrations
      const { data: retailerData, error: retailerError } = await supabase
        .from("integrated_retailers")
        .select("*")
        .eq("active", true);
        
      if (retailerError) throw retailerError;
      
      if (retailerData) {
        // For each integration, get the product count
        const integrationsWithCounts = await Promise.all(
          retailerData.map(async (retailer) => {
            const { count } = await supabase
              .from("scraped_products")
              .select("*", { count: "exact", head: true })
              .eq("source", retailer.name);
              
            return {
              ...retailer,
              product_count: count || 0
            };
          })
        );
        
        setIntegrations(integrationsWithCounts);
      }
    } catch (error) {
      console.error("Error loading retailer integrations:", error);
      toast({
        title: "Error",
        description: "Failed to load retailer integrations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('retailer-integration-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events
          schema: 'public',
          table: 'integrated_retailers'
        },
        (payload) => {
          // Update our integrations list when changes occur
          loadIntegrations();
        }
      )
      .subscribe();
    
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  };

  const syncRetailer = async (retailerId: string, retailerName: string) => {
    setSyncing(retailerId);
    
    try {
      const { data, error } = await supabase.functions.invoke('scrape-products', {
        body: { 
          source: retailerName, 
          limit: 20,
          sync: true
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Sync completed",
        description: `Successfully synced products from ${retailerName}.`,
      });
      
      // Refresh integrations to show updated counts and sync time
      loadIntegrations();
    } catch (error) {
      console.error(`Error syncing ${retailerName}:`, error);
      toast({
        title: "Sync failed",
        description: `Failed to sync products from ${retailerName}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setSyncing(null);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if sync is needed (over 1 hour old)
  const syncNeeded = (lastSynced?: string) => {
    if (!lastSynced) return true;
    
    const syncTime = new Date(lastSynced).getTime();
    const oneHourAgo = Date.now() - 3600000;
    return syncTime < oneHourAgo;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Retailers</CardTitle>
          <CardDescription>Real-time integration status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <RefreshCcw className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Connected Retailers</CardTitle>
        <CardDescription>
          Real-time integration status with your store
        </CardDescription>
      </CardHeader>
      <CardContent>
        {integrations.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No retailers connected</p>
            <p className="text-sm mt-2">Connect a retailer above to start importing products</p>
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full bg-green-500`}></div>
                    <span className="font-medium">{integration.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {integration.product_count} products
                    </Badge>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => syncRetailer(integration.id, integration.name)}
                    disabled={syncing === integration.id}
                  >
                    {syncing === integration.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="h-3.5 w-3.5" />
                        Sync Now
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mt-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last synced: {formatTime(integration.last_synced)}</span>
                    
                    {syncNeeded(integration.last_synced) && (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Sync needed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
