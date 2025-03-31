
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductInsightCardProps {
  title: string;
  description: string;
  trend: "upward" | "downward" | "stable";
  confidence: number;
  tags: string[];
}

export function ProductInsightCard({
  title,
  description,
  trend,
  confidence,
  tags
}: ProductInsightCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium">{title}</h3>
          <Badge 
            className={cn(
              "ml-2",
              trend === "upward" 
                ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-200" 
                : trend === "downward" 
                  ? "bg-rose-500/15 text-rose-600 hover:bg-rose-500/25 border-rose-200" 
                  : "bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-200"
            )}
          >
            {trend === "upward" ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : trend === "downward" ? (
              <TrendingDown className="h-3 w-3 mr-1" />
            ) : (
              <Zap className="h-3 w-3 mr-1" />
            )}
            {trend === "upward" ? "Trending Up" : trend === "downward" ? "Declining" : "Stable"}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">AI Confidence</span>
            <span className="text-xs font-medium">{confidence}%</span>
          </div>
          <Progress 
            value={confidence} 
            className={cn(
              confidence >= 80 ? "bg-emerald-100 text-emerald-600" : 
              confidence >= 50 ? "bg-amber-100 text-amber-600" : 
              "bg-rose-100 text-rose-600"
            )}
          />
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
