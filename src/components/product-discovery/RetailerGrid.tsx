
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Link as LinkIcon, Plus, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RetailerInfo {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
}

interface RetailerGridProps {
  retailers: RetailerInfo[];
  selectedRetailer: string | null;
  onSelectRetailer: (id: string) => void;
}

export function RetailerGrid({ 
  retailers, 
  selectedRetailer, 
  onSelectRetailer 
}: RetailerGridProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectedRetailers, setConnectedRetailers] = useState<string[]>([]);

  // Fetch connected retailers when component mounts
  useState(() => {
    if (user) {
      fetchConnectedRetailers();
    }
  });

  const fetchConnectedRetailers = async () => {
    try {
      const { data, error } = await supabase
        .from('integrated_retailers')
        .select('id')
        .eq('active', true);
      
      if (error) throw error;
      
      if (data) {
        setConnectedRetailers(data.map(item => item.id));
      }
    } catch (error) {
      console.error("Error fetching connected retailers:", error);
    }
  };

  const handleConnect = async (retailerId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect a retailer",
        variant: "destructive",
      });
      return;
    }

    setConnecting(retailerId);
    
    try {
      // Check if already connected
      if (connectedRetailers.includes(retailerId)) {
        // If already connected, disconnect
        const { error } = await supabase
          .from('integrated_retailers')
          .update({ active: false })
          .eq('id', retailerId);
        
        if (error) throw error;
        
        setConnectedRetailers(prev => prev.filter(id => id !== retailerId));
        
        toast({
          title: "Retailer disconnected",
          description: `${retailers.find(r => r.id === retailerId)?.name} has been disconnected from your store.`,
        });
      } else {
        // Connect the retailer
        const retailer = retailers.find(r => r.id === retailerId);
        if (!retailer) throw new Error("Retailer not found");
        
        // Attempt to upsert the retailer
        const { error } = await supabase
          .from('integrated_retailers')
          .upsert({
            id: retailerId,
            name: retailer.name,
            api_endpoint: `https://api.${retailer.id.toLowerCase()}.com/v1`,
            api_key: `demo_${retailerId}_${Date.now()}`, // In a real app, you'd collect this from the user
            active: true
          }, { onConflict: 'id' });
        
        if (error) throw error;
        
        setConnectedRetailers(prev => [...prev, retailerId]);
        
        toast({
          title: "Retailer connected",
          description: `${retailer.name} has been connected to your store. Products will sync automatically.`,
        });
        
        // Call the scrape-products function to fetch initial products
        const { error: scrapeError } = await supabase.functions.invoke('scrape-products', {
          body: { source: retailer.name, limit: 10 }
        });
        
        if (scrapeError) {
          console.error("Error importing initial products:", scrapeError);
          toast({
            title: "Warning",
            description: "Connected successfully, but there was an issue importing initial products.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error connecting retailer:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect the retailer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Retailer Selection</CardTitle>
        <CardDescription>
          Choose a retailer to import products from or connect to your store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {retailers.map((retailer) => (
            <div
              key={retailer.id}
              className={`p-4 rounded-lg border bg-white dark:bg-gray-800 cursor-pointer transition-all hover:shadow-md ${
                selectedRetailer === retailer.id 
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
              onClick={() => onSelectRetailer(retailer.id)}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-16 w-full flex items-center justify-center mb-1">
                  <img 
                    src={retailer.logo} 
                    alt={retailer.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="font-medium">{retailer.name}</div>
                <div className="flex flex-col gap-2 w-full mt-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(retailer.url, '_blank');
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant={connectedRetailers.includes(retailer.id) ? "default" : "outline"}
                    className="w-full gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(retailer.id);
                    }}
                    disabled={connecting === retailer.id}
                  >
                    {connecting === retailer.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Connecting...
                      </>
                    ) : connectedRetailers.includes(retailer.id) ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Connected
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-3.5 w-3.5" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
