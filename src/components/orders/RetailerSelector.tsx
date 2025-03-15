
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Retailer {
  id: string;
  name: string;
  logo?: string;
}

interface RetailerSelectorProps {
  onRetailerSelect: (retailerId: string | null) => void;
  initialValue?: string | null;
}

export const RetailerSelector = ({ 
  onRetailerSelect, 
  initialValue = null 
}: RetailerSelectorProps) => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(initialValue);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const { data, error } = await supabase
          .from('integrated_retailers')
          .select('id, name, logo')
          .eq('active', true);
        
        if (error) {
          throw error;
        }

        setRetailers(data || []);
      } catch (error) {
        console.error('Error fetching retailers:', error);
        toast({
          title: "Error",
          description: "Failed to load retailers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRetailers();
  }, []);

  useEffect(() => {
    if (initialValue) {
      setSelectedRetailer(initialValue);
    }
  }, [initialValue]);

  const handleRetailerChange = (value: string) => {
    setSelectedRetailer(value);
    onRetailerSelect(value);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Retailer</label>
      <Select
        disabled={loading}
        value={selectedRetailer || ""}
        onValueChange={handleRetailerChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a retailer" />
        </SelectTrigger>
        <SelectContent>
          {retailers.map((retailer) => (
            <SelectItem 
              key={retailer.id} 
              value={retailer.id}
              className="flex items-center py-2"
            >
              {retailer.logo ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 flex-shrink-0">
                    <img 
                      src={retailer.logo} 
                      alt={retailer.name} 
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <span>{retailer.name}</span>
                </div>
              ) : (
                retailer.name
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
