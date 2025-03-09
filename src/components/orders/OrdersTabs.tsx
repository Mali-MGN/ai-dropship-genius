
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, LineChart } from "lucide-react";

interface OrdersTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const OrdersTabs = ({ activeTab, setActiveTab }: OrdersTabsProps) => {
  return (
    <TabsList>
      <TabsTrigger value="orders" className="gap-2">
        <Calendar className="h-4 w-4" />
        Orders
      </TabsTrigger>
      <TabsTrigger value="analytics" className="gap-2">
        <LineChart className="h-4 w-4" />
        Analytics
      </TabsTrigger>
    </TabsList>
  );
};
