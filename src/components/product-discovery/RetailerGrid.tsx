
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

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
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Retailer Selection</CardTitle>
        <CardDescription>
          Choose a retailer to import products from
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {retailers.map((retailer) => (
            <div
              key={retailer.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedRetailer === retailer.id 
                  ? "border-primary bg-primary/5" 
                  : "hover:bg-accent"
              }`}
              onClick={() => onSelectRetailer(retailer.id)}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 flex items-center justify-center">
                  <img 
                    src={retailer.logo} 
                    alt={retailer.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="font-medium text-sm">{retailer.name}</div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="w-full text-xs px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(retailer.url, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Visit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
