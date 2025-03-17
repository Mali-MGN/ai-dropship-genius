
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, RefreshCcw, AlertTriangle } from "lucide-react";

interface StoreIntegration {
  id: string;
  name: string;
  active: boolean;
  lastSynced?: string;
  productCount?: number;
}

export function StoreIntegrationStatus() {
  const [integrations, setIntegrations] = useState<StoreIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load integrations when the component mounts
  useEffect(() => {
    async function loadIntegrations() {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from("integrated_retailers")
          .select("*");
          
        if (error) throw error;
        
        if (data) {
          const mappedIntegrations = data.map(item => ({
            id: item.id,
            name: item.name,
            active: item.active,
            lastSynced: new Date().toISOString(), // This would come from the real data
            productCount: Math.floor(Math.random() * 100) + 10 // Mock data for example
          }));
          
          setIntegrations(mappedIntegrations);
        }
      } catch (error) {
        console.error("Error loading store integrations:", error);
        toast({
          title: "Error",
          description: "Failed to load store integrations",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadIntegrations();
    
    // Set up real-time updates for store integrations
    const channel = supabase
      .channel('store-integration-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events
          schema: 'public',
          table: 'integrated_retailers'
        },
        (payload) => {
          const updatedIntegration = payload.new as any;
          
          if (payload.eventType === 'INSERT') {
            setIntegrations(current => [
              ...current, 
              {
                id: updatedIntegration.id,
                name: updatedIntegration.name,
                active: updatedIntegration.active,
                lastSynced: new Date().toISOString(),
                productCount: 0
              }
            ]);
            
            toast({
              title: "New Integration",
              description: `${updatedIntegration.name} has been added`,
              variant: "default"
            });
          } 
          else if (payload.eventType === 'UPDATE') {
            setIntegrations(current => 
              current.map(integration => 
                integration.id === updatedIntegration.id 
                  ? { 
                      ...integration, 
                      name: updatedIntegration.name,
                      active: updatedIntegration.active,
                      lastSynced: new Date().toISOString()
                    } 
                  : integration
              )
            );
            
            toast({
              title: "Integration Updated",
              description: `${updatedIntegration.name} has been updated`,
              variant: "default"
            });
          }
          else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setIntegrations(current => 
              current.filter(integration => integration.id !== deletedId)
            );
            
            toast({
              title: "Integration Removed",
              description: "A store integration has been removed",
              variant: "default"
            });
          }
        }
      )
      .subscribe();
    
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Store Integrations</CardTitle>
          <CardDescription>Real-time status of your connected stores</CardDescription>
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
    <Card>
      <CardHeader>
        <CardTitle>Store Integrations</CardTitle>
        <CardDescription>Real-time status of your connected stores</CardDescription>
      </CardHeader>
      <CardContent>
        {integrations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No store integrations found</p>
            <p className="text-sm mt-2">Connect a store to automatically sync inventory and products</p>
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map(integration => (
              <div key={integration.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${integration.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{integration.name}</span>
                  </div>
                  {integration.active ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <X className="h-3.5 w-3.5" />
                      Disconnected
                    </Badge>
                  )}
                </div>
                {integration.active && (
                  <div className="mt-3 text-sm grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground">Last sync:</span>{" "}
                      {integration.lastSynced ? formatTime(integration.lastSynced) : "Never"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Products:</span>{" "}
                      {integration.productCount}
                    </div>
                    {integration.lastSynced && new Date(integration.lastSynced).getTime() < (Date.now() - 3600000) && (
                      <div className="col-span-2 flex items-center gap-1 text-amber-500">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Sync needed: Last sync was over an hour ago</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
