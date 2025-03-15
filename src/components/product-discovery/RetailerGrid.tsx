
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-1 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(retailer.url, '_blank');
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
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
