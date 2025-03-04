
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const statCardVariants = cva(
  "rounded-xl p-6 transition-all duration-300 flex flex-col",
  {
    variants: {
      variant: {
        default: "bg-card border shadow-subtle hover:shadow-elevation",
        glass: "glass-card",
        outline: "border border-border bg-background/50 hover:bg-background",
        filled: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  description,
  variant,
  className,
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const hasChange = isPositive || isNegative;
  
  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
        
        {hasChange && (
          <div
            className={cn(
              "flex items-center text-xs font-medium rounded-full px-1.5 py-0.5",
              isPositive ? "text-emerald-600 bg-emerald-500/10" : "text-red-600 bg-red-500/10"
            )}
          >
            {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
