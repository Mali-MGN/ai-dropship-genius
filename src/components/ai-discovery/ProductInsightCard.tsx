
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium">{title}</h3>
          {trend === "upward" ? (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">
              <TrendingUp className="h-3.5 w-3.5 mr-1 text-emerald-600" />
              Rising Trend
            </Badge>
          ) : trend === "downward" ? (
            <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-0">
              <TrendingDown className="h-3.5 w-3.5 mr-1 text-rose-600" />
              Falling Trend
            </Badge>
          ) : (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
              Stable Market
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">AI Confidence</span>
            <span className="text-muted-foreground">{confidence}%</span>
          </div>
          <Progress 
            value={confidence} 
            className={cn(
              "h-2",
              confidence > 80 ? "bg-emerald-500" : 
              confidence > 60 ? "bg-amber-500" : 
              "bg-rose-500"
            )}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-secondary/50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
