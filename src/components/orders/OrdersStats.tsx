
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface OrdersStatsProps {
  newOrdersCount: number;
  processingCount: number;
  deliveredCount: number;
  cancelledCount: number;
}

export const OrdersStats = ({
  newOrdersCount = 152,
  processingCount = 87,
  deliveredCount = 243,
  cancelledCount = 18,
}: OrdersStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-primary">{newOrdersCount}</div>
            <p className="text-sm text-muted-foreground">New Orders</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-blue-500">{processingCount}</div>
            <p className="text-sm text-muted-foreground">Processing</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-green-500">{deliveredCount}</div>
            <p className="text-sm text-muted-foreground">Delivered</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-red-500">{cancelledCount}</div>
            <p className="text-sm text-muted-foreground">Cancelled</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
