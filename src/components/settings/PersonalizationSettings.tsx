
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, XCircle, Info, Shield, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserPreferences } from '@/lib/utils';

// This would be connected to your data store in a real implementation
const DEFAULT_PREFERENCES: UserPreferences = {
  interests: ['electronics', 'fashion', 'home'],
  priceRange: {
    min: 10,
    max: 200
  },
  enablePersonalization: false
};

interface PersonalizationSettingsProps {
  initialPreferences?: Partial<UserPreferences>;
  onSave?: (preferences: UserPreferences) => void;
}

export const PersonalizationSettings = ({ 
  initialPreferences,
  onSave
}: PersonalizationSettingsProps) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...DEFAULT_PREFERENCES,
    ...initialPreferences
  });
  const [newInterest, setNewInterest] = useState("");

  const handlePersonalizationToggle = (enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      enablePersonalization: enabled
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPreferences(prev => ({
      ...prev,
      priceRange: {
        min: value[0],
        max: value[1]
      }
    }));
  };

  const addInterest = () => {
    if (!newInterest.trim()) return;
    
    if (!preferences.interests.includes(newInterest.trim().toLowerCase())) {
      setPreferences(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim().toLowerCase()]
      }));
      setNewInterest("");
    } else {
      toast({
        title: "Interest already exists",
        description: "This interest is already in your list.",
        variant: "destructive",
      });
    }
  };

  const removeInterest = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSave = () => {
    onSave?.(preferences);
    toast({
      title: "Preferences saved",
      description: "Your personalization preferences have been updated.",
      duration: 3000,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Personalization
        </CardTitle>
        <CardDescription>
          Control how AI personalizes product recommendations for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="personalization-toggle">Enable AI Personalization</Label>
            <p className="text-sm text-muted-foreground">
              Allow AI to recommend products based on your preferences
            </p>
          </div>
          <Switch
            id="personalization-toggle"
            checked={preferences.enablePersonalization}
            onCheckedChange={handlePersonalizationToggle}
          />
        </div>

        {preferences.enablePersonalization && (
          <>
            <div className="border-t pt-4">
              <Label className="mb-2 block">Your Interests</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {preferences.interests.map(interest => (
                  <Badge key={interest} variant="secondary" className="flex items-center gap-1 capitalize">
                    {interest}
                    <button 
                      onClick={() => removeInterest(interest)}
                      className="ml-1 h-4 w-4 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {preferences.interests.length === 0 && (
                  <p className="text-sm text-muted-foreground">No interests added yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addInterest}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="mb-2 block">Price Range (${preferences.priceRange.min} - ${preferences.priceRange.max})</Label>
              <Slider
                defaultValue={[preferences.priceRange.min, preferences.priceRange.max]}
                max={1000}
                step={10}
                onValueChange={handlePriceRangeChange}
                className="my-6"
              />
            </div>

            <div className="border-t pt-4 rounded-lg bg-muted/30 p-3">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Privacy Information</p>
                  <p className="text-xs text-muted-foreground">
                    Your preferences are stored securely and only used to enhance your product discovery. 
                    You can disable personalization at any time.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonalizationSettings;
