
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, BarChart2, PackageCheck } from "lucide-react";

interface OrdersTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const OrdersTabs = ({ activeTab, setActiveTab }: OrdersTabsProps) => {
  return (
    <TabsList className="grid grid-cols-3 w-full max-w-md">
      <TabsTrigger 
        value="orders" 
        onClick={() => setActiveTab("orders")}
        className="flex items-center gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        <span className="hidden sm:inline">Orders</span>
      </TabsTrigger>
      <TabsTrigger 
        value="inventory" 
        onClick={() => setActiveTab("inventory")}
        className="flex items-center gap-2"
      >
        <PackageCheck className="h-4 w-4" />
        <span className="hidden sm:inline">Inventory</span>
      </TabsTrigger>
      <TabsTrigger 
        value="analytics" 
        onClick={() => setActiveTab("analytics")}
        className="flex items-center gap-2"
      >
        <BarChart2 className="h-4 w-4" />
        <span className="hidden sm:inline">Analytics</span>
      </TabsTrigger>
    </TabsList>
  );
};
