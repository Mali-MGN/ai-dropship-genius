
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { AITool } from '@/data/aiTools';

interface AIToolCardProps {
  tool: AITool;
}

export function AIToolCard({ tool }: AIToolCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden">
            <img 
              src={tool.imageUrl} 
              alt={tool.name} 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + tool.name.charAt(0);
              }}
            />
          </div>
          <Badge variant="outline" className="capitalize">
            {tool.pricing.includes('Free') ? 'Free tier' : 'Paid'}
          </Badge>
        </div>
        <CardTitle className="mt-2">{tool.name}</CardTitle>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Key Features:</h4>
          <ul className="text-sm space-y-1.5">
            {tool.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {tool.pricing}
        </div>
        <Button variant="outline" size="sm" onClick={() => window.open(tool.url, '_blank')}>
          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
          Visit
        </Button>
      </CardFooter>
    </Card>
  );
}
