
import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  const [newInterest, setNewInterest] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user preferences from the database on component mount
  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If preferences exist in the database, update the state
      if (data) {
        onPreferencesChange({
          interests: data.interests || [],
          priceRange: {
            min: data.price_range_min,
            max: data.price_range_max
          },
          enablePersonalization: data.enable_personalization
        });
      } else if (user) {
        // If no preferences exist yet, create a default one
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load your personalization preferences.",
        variant: "destructive",
      });
    }
  };

  const createDefaultPreferences = async () => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user?.id,
          interests: DEFAULT_PREFERENCES.interests,
          price_range_min: DEFAULT_PREFERENCES.priceRange.min,
          price_range_max: DEFAULT_PREFERENCES.priceRange.max,
          enable_personalization: DEFAULT_PREFERENCES.enablePersonalization
        });

      if (error) throw error;

      // Set the default preferences in state
      onPreferencesChange(DEFAULT_PREFERENCES);
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  const handlePersonalizationToggle = async (enabled: boolean) => {
    if (!user) return;

    onPreferencesChange(prev => ({
      ...prev,
      enablePersonalization: enabled
    }));

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ enable_personalization: enabled })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating personalization setting:', error);
      toast({
        title: "Error",
        description: "Failed to update personalization setting.",
        variant: "destructive",
      });
    }
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

  const addInterest = async () => {
    if (!newInterest.trim() || !user) return;
    
    if (!preferences.interests.includes(newInterest.trim().toLowerCase())) {
      const updatedInterests = [...preferences.interests, newInterest.trim().toLowerCase()];
      
      onPreferencesChange(prev => ({
        ...prev,
        interests: updatedInterests
      }));
      
      try {
        const { error } = await supabase
          .from('user_preferences')
          .update({ interests: updatedInterests })
          .eq('user_id', user.id);

        if (error) throw error;
        
        setNewInterest("");
      } catch (error) {
        console.error('Error adding interest:', error);
        toast({
          title: "Error",
          description: "Failed to save your interest.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Interest already exists",
        description: "This interest is already in your list.",
        variant: "destructive",
      });
    }
  };

  const removeInterest = async (interest: string) => {
    if (!user) return;
    
    const updatedInterests = preferences.interests.filter(i => i !== interest);
    
    onPreferencesChange(prev => ({
      ...prev,
      interests: updatedInterests
    }));
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ interests: updatedInterests })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing interest:', error);
      toast({
        title: "Error",
        description: "Failed to remove the interest.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          price_range_min: preferences.priceRange.min,
          price_range_max: preferences.priceRange.max,
          interests: preferences.interests,
          enable_personalization: preferences.enablePersonalization,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Preferences saved",
        description: "Your personalization preferences have been updated.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
            
            <Button 
              onClick={handleSave} 
              disabled={disabled || isSaving}
              className="w-full"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PersonalizationSettings;
