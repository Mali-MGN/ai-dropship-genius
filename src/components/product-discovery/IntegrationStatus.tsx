
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, AlertTriangle, XCircle, Settings } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function IntegrationStatus() {
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState({
    api: "connected",
    products: 12542,
    lastSync: "2 hours ago",
    syncProgress: 100,
  });
  const { toast } = useToast();

  const handleRefresh = async () => {
    setRefreshing(true);
    setStatus(prev => ({ ...prev, syncProgress: 0 }));

    // Simulate sync process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setStatus(prev => ({ ...prev, syncProgress: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        setRefreshing(false);
        setStatus(prev => ({ ...prev, lastSync: "Just now" }));
        
        toast({
          title: "Synchronization complete",
          description: "Your product catalog has been updated.",
        });
      }
    }, 500);
  };

  const renderStatusIcon = (apiStatus: string) => {
    switch (apiStatus) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              Current status of your retailer connection
            </CardDescription>
          </div>
          <Badge 
            variant={
              status.api === "connected" ? "outline" : 
              status.api === "warning" ? "secondary" : "destructive"
            }
            className={
              status.api === "connected" ? "bg-green-50 text-green-700 border-green-200" : 
              status.api === "warning" ? "bg-amber-50 text-amber-700 border-amber-200" : 
              "bg-red-50 text-red-700 border-red-200"
            }
          >
            {renderStatusIcon(status.api)}
            <span className="ml-1 capitalize">{status.api}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground mb-1">Available Products</span>
            <span className="text-2xl font-bold">{status.products.toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground mb-1">Last Synchronized</span>
            <span className="text-2xl font-bold">{status.lastSync}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground mb-1">API Status</span>
            <div className="flex items-center gap-2">
              {renderStatusIcon(status.api)}
              <span className="text-2xl font-bold capitalize">{status.api}</span>
            </div>
          </div>
        </div>
        
        {refreshing && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Synchronizing products...</span>
              <span>{status.syncProgress}%</span>
            </div>
            <Progress value={status.syncProgress} className="h-2" />
          </div>
        )}
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {refreshing ? "Synchronizing..." : "Sync Products"}
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            API Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
