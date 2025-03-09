
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { OrderForm } from "@/components/orders/OrderForm";
import { ShoppingCart } from "lucide-react";

interface ProductOrderButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
}

export const ProductOrderButton = ({ 
  productId, 
  productName, 
  productPrice 
}: ProductOrderButtonProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to place an order",
        variant: "destructive",
      });
      return;
    }
    setOpen(true);
  };

  const handleOrderComplete = () => {
    setOpen(false);
    toast({
      title: "Success",
      description: "Your order has been placed! You can view it in your orders page.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={handleClick}
          variant="default"
          className="w-full flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Order Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Place Order</DialogTitle>
        </DialogHeader>
        <OrderForm
          productId={productId}
          productName={productName}
          productPrice={productPrice}
          onOrderComplete={handleOrderComplete}
        />
      </DialogContent>
    </Dialog>
  );
};
