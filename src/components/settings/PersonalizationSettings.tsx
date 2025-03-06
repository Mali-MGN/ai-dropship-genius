
import React, { useState, Dispatch, SetStateAction } from 'react';
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

export interface PersonalizationSettingsProps {
  preferences: UserPreferences;
  onPreferencesChange: Dispatch<SetStateAction<UserPreferences>>;
  disabled?: boolean;
}

export const PersonalizationSettings = ({ 
  preferences,
  onPreferencesChange,
  disabled = false
}: PersonalizationSettingsProps) => {
  const { toast } = useToast();
  const [newInterest, setNewInterest] = useState("");

  const handlePersonalizationToggle = (enabled: boolean) => {
    onPreferencesChange(prev => ({
      ...prev,
      enablePersonalization: enabled
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    onPreferencesChange(prev => ({
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
      onPreferencesChange(prev => ({
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
    onPreferencesChange(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSave = () => {
    toast({
      title: "Preferences saved",
      description: "Your personalization preferences have been updated.",
      duration: 3000,
    });
  };

  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
      <div className="space-y-6">
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
            disabled={disabled}
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
                      disabled={disabled}
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
                  disabled={disabled}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addInterest}
                  disabled={disabled}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="mb-2 block">Price Range (${preferences.priceRange.min} - ${preferences.priceRange.max})</Label>
              <Slider
                defaultValue={[preferences.priceRange.min, preferences.priceRange.max]}
                value={[preferences.priceRange.min, preferences.priceRange.max]}
                max={1000}
                step={10}
                onValueChange={handlePriceRangeChange}
                className="my-6"
                disabled={disabled}
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
      </div>
    </div>
  );
};

export default PersonalizationSettings;
