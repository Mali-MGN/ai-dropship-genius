
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
}

interface RetailerSelectorProps {
  onRetailerSelect: (retailerId: string | null) => void;
}

export const RetailerSelector = ({ onRetailerSelect }: RetailerSelectorProps) => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const { data, error } = await supabase
          .from('integrated_retailers')
          .select('id, name')
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
            <SelectItem key={retailer.id} value={retailer.id}>
              {retailer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
