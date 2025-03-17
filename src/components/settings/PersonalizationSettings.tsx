import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CheckCircle, XCircle, Info, Shield, Sparkles, Users, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserPreferences } from '@/lib/utils';
import { AIService } from "@/utils/AIService";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [enableSocialRecommendations, setEnableSocialRecommendations] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState({
    social: 0,
    thirdParty: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
      fetchConnectedAccounts();
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      const data = await AIService.getUserPreferences(user?.id);

      if (data) {
        onPreferencesChange({
          interests: data.interests || [],
          priceRange: {
            min: data.price_range_min,
            max: data.price_range_max
          },
          enablePersonalization: data.enable_personalization
        });
        setEnableSocialRecommendations(data.enable_social_recommendations || false);
      } else if (user) {
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

  const fetchConnectedAccounts = async () => {
    try {
      const socialData = await AIService.getSocialConnections(user?.id);
      const thirdPartyData = await AIService.getThirdPartyConnections(user?.id);
      
      setConnectedAccounts({
        social: socialData?.length || 0,
        thirdParty: thirdPartyData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
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
          enable_personalization: DEFAULT_PREFERENCES.enablePersonalization,
          enable_social_recommendations: false
        });

      if (error) throw error;

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
      await AIService.saveUserPreferences({
        enable_personalization: enabled,
        interests: preferences.interests,
        price_range_min: preferences.priceRange.min,
        price_range_max: preferences.priceRange.max,
        enable_social_recommendations: enableSocialRecommendations
      }, user.id);
    } catch (error) {
      console.error('Error updating personalization setting:', error);
      toast({
        title: "Error",
        description: "Failed to update personalization setting.",
        variant: "destructive",
      });
    }
  };

  const handleSocialRecommendationsToggle = async (enabled: boolean) => {
    if (!user) return;

    setEnableSocialRecommendations(enabled);

    try {
      await AIService.saveUserPreferences({
        enable_personalization: preferences.enablePersonalization,
        interests: preferences.interests,
        price_range_min: preferences.priceRange.min,
        price_range_max: preferences.priceRange.max,
        enable_social_recommendations: enabled
      }, user.id);
      
      toast({
        title: "Setting Updated",
        description: `Social recommendations ${enabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error('Error updating social recommendations setting:', error);
      toast({
        title: "Error",
        description: "Failed to update social recommendations setting.",
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
        await AIService.saveUserPreferences({
          enable_personalization: preferences.enablePersonalization,
          interests: updatedInterests,
          price_range_min: preferences.priceRange.min,
          price_range_max: preferences.priceRange.max,
          enable_social_recommendations: enableSocialRecommendations
        }, user.id);
        
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
      await AIService.saveUserPreferences({
        enable_personalization: preferences.enablePersonalization,
        interests: updatedInterests,
        price_range_min: preferences.priceRange.min,
        price_range_max: preferences.priceRange.max,
        enable_social_recommendations: enableSocialRecommendations
      }, user.id);
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
      await AIService.saveUserPreferences({
        enable_personalization: preferences.enablePersonalization,
        interests: preferences.interests,
        price_range_min: preferences.priceRange.min,
        price_range_max: preferences.priceRange.max,
        enable_social_recommendations: enableSocialRecommendations
      }, user.id);
      
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="social-recommendations-toggle">Social Recommendations</Label>
                  <p className="text-sm text-muted-foreground">
                    Use data from your connected social media accounts and third-party apps
                  </p>
                </div>
                <Switch
                  id="social-recommendations-toggle"
                  checked={enableSocialRecommendations}
                  onCheckedChange={handleSocialRecommendationsToggle}
                  disabled={disabled || (connectedAccounts.social === 0 && connectedAccounts.thirdParty === 0)}
                />
              </div>
              
              {(connectedAccounts.social === 0 && connectedAccounts.thirdParty === 0) && (
                <div className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  <span>Connect at least one account in the "Connected" tab to enable social recommendations.</span>
                </div>
              )}
              
              {enableSocialRecommendations && (connectedAccounts.social > 0 || connectedAccounts.thirdParty > 0) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {connectedAccounts.social} social accounts
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <LinkIcon className="h-3.5 w-3.5" />
                    {connectedAccounts.thirdParty} third-party apps
                  </Badge>
                </div>
              )}
            </div>

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
                    Your preferences and social connections are stored securely and only used to enhance your product discovery. 
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
