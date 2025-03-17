
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  percentageChange?: number;
  positiveChange?: boolean;
  className?: string;
  loading?: boolean; // Add loading prop to the interface
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  percentageChange,
  positiveChange = true,
  className,
  loading,
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center">
            {Icon && (
              <div className="mr-3 rounded-md bg-muted p-2">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-semibold tracking-tight">
                {loading ? "Loading..." : value}
              </h3>
            </div>
          </div>

          {percentageChange !== undefined && (
            <div
              className={cn(
                "flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium",
                positiveChange
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
              )}
            >
              <span
                className={cn(
                  "mr-1 h-3 w-3",
                  positiveChange ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {positiveChange ? "↑" : "↓"}
              </span>
              {Math.abs(percentageChange)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
