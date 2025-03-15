
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

interface Connection {
  id: string;
  provider: string;
  provider_id: string;
  username: string;
  connected_at: string;
}

export function SocialConnections() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [socialConnections, setSocialConnections] = useState<Connection[]>([]);
  const [thirdPartyConnections, setThirdPartyConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      // Fetch social media connections
      const { data: socialData, error: socialError } = await supabase
        .from('social_connections')
        .select('*')
        .eq('user_id', user?.id);

      if (socialError) throw socialError;
      
      // Fetch third-party connections
      const { data: thirdPartyData, error: thirdPartyError } = await supabase
        .from('third_party_connections')
        .select('*')
        .eq('user_id', user?.id);

      if (thirdPartyError) throw thirdPartyError;
      
      setSocialConnections(socialData || []);
      setThirdPartyConnections(thirdPartyData || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: "Error",
        description: "Failed to load your connected accounts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const connectSocialAccount = async (provider: string) => {
    try {
      toast({
        title: "Connecting...",
        description: `Initiating ${provider} authentication.`,
      });
      
      // In a real implementation, this would authenticate with the provider
      // Then store the connection details in the database
      
      // Simulating a successful connection for demonstration purposes
      const connectionData = {
        user_id: user?.id,
        provider,
        provider_id: `mock_${provider}_id_${Math.random().toString(36).substring(7)}`,
        username: `${provider.toLowerCase()}_user_${Math.random().toString(36).substring(7)}`,
        connected_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('social_connections')
        .insert(connectionData);
        
      if (error) throw error;
      
      toast({
        title: "Connected",
        description: `Successfully connected your ${provider} account.`,
      });
      
      // Refresh connections
      fetchConnections();
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
      toast({
        title: "Connection Failed",
        description: `Could not connect your ${provider} account. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const connectThirdPartyApp = async (provider: string) => {
    try {
      toast({
        title: "Connecting...",
        description: `Initiating ${provider} integration.`,
      });
      
      // In a real implementation, this would authenticate with the third-party service
      // Then store the connection details in the database
      
      // Simulating a successful connection for demonstration purposes
      const connectionData = {
        user_id: user?.id,
        provider,
        provider_id: `mock_${provider}_id_${Math.random().toString(36).substring(7)}`,
        username: `${provider.toLowerCase()}_user_${Math.random().toString(36).substring(7)}`,
        connected_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('third_party_connections')
        .insert(connectionData);
        
      if (error) throw error;
      
      toast({
        title: "Connected",
        description: `Successfully connected your ${provider} account.`,
      });
      
      // Refresh connections
      fetchConnections();
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
      toast({
        title: "Connection Failed",
        description: `Could not connect your ${provider} app. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const disconnectAccount = async (id: string, type: 'social' | 'third-party') => {
    try {
      toast({
        title: "Disconnecting...",
        description: "Removing connection.",
      });
      
      const tableName = type === 'social' ? 'social_connections' : 'third_party_connections';
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Disconnected",
        description: "Successfully disconnected the account.",
      });
      
      // Refresh connections
      fetchConnections();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast({
        title: "Disconnection Failed",
        description: "Could not disconnect the account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSocialIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'shopify':
        return (
          <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getConnectionStatus = (provider: string) => {
    // Check if this social provider is connected
    const socialConnection = socialConnections.find(
      conn => conn.provider.toLowerCase() === provider.toLowerCase()
    );
    
    // Check if this third-party provider is connected
    const thirdPartyConnection = thirdPartyConnections.find(
      conn => conn.provider.toLowerCase() === provider.toLowerCase()
    );
    
    const connection = socialConnection || thirdPartyConnection;
    
    if (connection) {
      return {
        isConnected: true,
        username: connection.username,
        id: connection.id,
        type: socialConnection ? 'social' : 'third-party' as 'social' | 'third-party'
      };
    }
    
    return {
      isConnected: false,
      username: '',
      id: '',
      type: 'social' as 'social' | 'third-party'
    };
  };

  if (loading) {
    return <div className="py-4 text-center">Loading connections...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Social Media</h3>
        <p className="text-sm text-muted-foreground">Link or unlink your social media accounts</p>
      </div>
      
      <div className="space-y-4">
        {/* Facebook */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Facebook className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Facebook</p>
              {getConnectionStatus('facebook').isConnected ? (
                <p className="text-xs text-muted-foreground">Connected as @{getConnectionStatus('facebook').username}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          {getConnectionStatus('facebook').isConnected ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => disconnectAccount(
                getConnectionStatus('facebook').id,
                getConnectionStatus('facebook').type
              )}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => connectSocialAccount('facebook')}
            >
              Connect
            </Button>
          )}
        </div>
        
        <Separator />
        
        {/* Twitter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Twitter className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium">Twitter</p>
              {getConnectionStatus('twitter').isConnected ? (
                <p className="text-xs text-muted-foreground">Connected as @{getConnectionStatus('twitter').username}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          {getConnectionStatus('twitter').isConnected ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => disconnectAccount(
                getConnectionStatus('twitter').id,
                getConnectionStatus('twitter').type
              )}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => connectSocialAccount('twitter')}
            >
              Connect
            </Button>
          )}
        </div>
        
        <Separator />
        
        {/* Instagram */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Instagram className="h-5 w-5 text-pink-500" />
            <div>
              <p className="text-sm font-medium">Instagram</p>
              {getConnectionStatus('instagram').isConnected ? (
                <p className="text-xs text-muted-foreground">Connected as @{getConnectionStatus('instagram').username}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          {getConnectionStatus('instagram').isConnected ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => disconnectAccount(
                getConnectionStatus('instagram').id,
                getConnectionStatus('instagram').type
              )}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => connectSocialAccount('instagram')}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
      
      <div className="pt-6">
        <h3 className="text-lg font-medium">Third-Party Integrations</h3>
        <p className="text-sm text-muted-foreground">Manage connections to third-party services and applications</p>
      </div>
      
      <div className="space-y-4">
        {/* GitHub */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Github className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">GitHub</p>
              {getConnectionStatus('github').isConnected ? (
                <p className="text-xs text-muted-foreground">Connected as @{getConnectionStatus('github').username}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          {getConnectionStatus('github').isConnected ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => disconnectAccount(
                getConnectionStatus('github').id,
                getConnectionStatus('github').type
              )}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => connectThirdPartyApp('github')}
            >
              Connect
            </Button>
          )}
        </div>
        
        <Separator />
        
        {/* Shopify */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-sm font-medium">Shopify</p>
              {getConnectionStatus('shopify').isConnected ? (
                <p className="text-xs text-muted-foreground">Connected as @{getConnectionStatus('shopify').username}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Not connected</p>
              )}
            </div>
          </div>
          {getConnectionStatus('shopify').isConnected ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => disconnectAccount(
                getConnectionStatus('shopify').id,
                getConnectionStatus('shopify').type
              )}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => connectThirdPartyApp('shopify')}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
      
      <div className="pt-4 mt-6 bg-muted/20 p-4 rounded-lg border">
        <p className="text-sm">
          <strong>Note:</strong> Connecting your social media accounts and third-party apps helps us provide more personalized product recommendations. Your data is securely stored and used only to enhance your shopping experience.
        </p>
      </div>
    </div>
  );
}

export default SocialConnections;
