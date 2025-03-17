
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { RetailerSelector } from "./RetailerSelector";
import { supabase } from "@/integrations/supabase/client";

interface OrderFormProps {
  productId: string;
  productName: string;
  productPrice: number;
  onOrderComplete: () => void;
  initialRetailer?: string | null;
}

export const OrderForm = ({ 
  productId, 
  productName, 
  productPrice, 
  onOrderComplete,
  initialRetailer = null
}: OrderFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(initialRetailer);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerAddress: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRetailerSelect = (retailerId: string | null) => {
    setSelectedRetailer(retailerId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to place an order",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRetailer) {
      toast({
        title: "Error",
        description: "Please select a retailer",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call the Supabase edge function to place the order
      const { data, error } = await supabase.functions.invoke('place-order', {
        body: {
          productId,
          retailerId: selectedRetailer,
          customerDetails: {
            name: formData.customerName,
            email: formData.customerEmail,
            address: formData.customerAddress,
          },
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
      
      onOrderComplete();
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place the order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Place Order</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Product</label>
            <Input value={productName} disabled />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Price</label>
            <Input value={`$${productPrice.toFixed(2)}`} disabled />
          </div>
          
          <RetailerSelector 
            onRetailerSelect={handleRetailerSelect} 
            initialValue={initialRetailer}
          />
          
          <div className="space-y-1">
            <label htmlFor="customerName" className="text-sm font-medium">Customer Name</label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="customerEmail" className="text-sm font-medium">Customer Email</label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="customerAddress" className="text-sm font-medium">Shipping Address</label>
            <Textarea
              id="customerAddress"
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleInputChange}
              required
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !selectedRetailer}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
