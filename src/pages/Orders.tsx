
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TabsContent, Tabs } from "@/components/ui/tabs";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersTabs } from "@/components/orders/OrdersTabs";
import { OrdersStats } from "@/components/orders/OrdersStats";
import { OrdersList } from "@/components/orders/OrdersList";
import { FinancialStats } from "@/components/dashboard/FinancialStats";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("orders");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <OrdersHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <OrdersTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <TabsContent value="orders" className="space-y-6">
            <OrdersStats />
            <OrdersList />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <FinancialStats />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Orders;
