
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { PersonalizationSettings } from "@/components/settings/PersonalizationSettings";
import { UserPreferences } from "@/lib/utils";
import { 
  User, 
  ShieldCheck, 
  Link, 
  Sparkles, 
  KeyRound, 
  FileText,
  BellRing,
  UserRoundCog,
  LockKeyhole,
  Clock,
  LogOut,
  Github,
  Twitter,
  Facebook,
  Instagram
} from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  
  // State for AI personalization settings
  const [aiPersonalization, setAiPersonalization] = useState(false);
  const [shoppingHistory, setShoppingHistory] = useState(false);
  const [friendPreferences, setFriendPreferences] = useState(false);
  
  // Example preferences for the PersonalizationSettings component
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    interests: ["fashion", "electronics", "home decor"],
    priceRange: {
      min: 0,
      max: 500
    },
    enablePersonalization: false
  });

  const handleSaveSettings = (section: string) => {
    // In a real implementation, this would save to the database
    toast({
      title: "Settings Saved",
      description: `Your ${section} settings have been updated.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:w-[800px]">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="connected" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span className="hidden md:inline">Connected</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Legal</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar_url || ""} alt="Profile" />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <Button size="sm">Upload New Picture</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue={user?.user_metadata?.full_name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ""} />
                  </div>
                </div>
                
                <Button onClick={() => handleSaveSettings("profile")}>Save Changes</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button onClick={() => handleSaveSettings("password")}>Update Password</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email Preferences</CardTitle>
                <CardDescription>Manage your email notifications and subscription settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about new products and offers</p>
                  </div>
                  <Switch id="marketingEmails" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
                  </div>
                  <Switch id="orderUpdates" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletterEmails">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">Subscribe to our weekly newsletter</p>
                  </div>
                  <Switch id="newsletterEmails" />
                </div>
                <Button onClick={() => handleSaveSettings("email preferences")}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Data</CardTitle>
                <CardDescription>Review and delete your account data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Your account contains personal data that you've shared with us. This page allows you to download or delete that data.</p>
                  <div className="flex gap-2">
                    <Button variant="outline">Download Data</Button>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>View and manage your recent account activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <UserRoundCog className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Profile Updated</p>
                        <p className="text-xs text-muted-foreground">You updated your profile picture</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <LockKeyhole className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Password Changed</p>
                        <p className="text-xs text-muted-foreground">You changed your password</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <LogOut className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Account Login</p>
                        <p className="text-xs text-muted-foreground">New login from Chrome on Windows</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Enhance security by enabling two-factor authentication (2FA)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="2fa" />
                  <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                </div>
                <p className="text-sm text-muted-foreground">When enabled, you'll be required to enter a code from your authenticator app in addition to your password when logging in.</p>
                <Button onClick={() => handleSaveSettings("two-factor authentication")}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Connected Accounts */}
          <TabsContent value="connected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Link or unlink your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Facebook</p>
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Twitter className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium">Twitter</p>
                      <p className="text-xs text-muted-foreground">Connected as @username</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Disconnect</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="text-sm font-medium">Instagram</p>
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>Manage connections to third-party services and applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Github className="h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">GitHub</p>
                      <p className="text-xs text-muted-foreground">Connected as @username</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Disconnect</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Shopify</p>
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* AI Personalization Settings */}
          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Personalization</CardTitle>
                <CardDescription>Enhance your shopping experience with personalized trending product recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="enableAI" 
                    checked={aiPersonalization}
                    onCheckedChange={(checked) => setAiPersonalization(checked as boolean)}
                  />
                  <Label htmlFor="enableAI">Enable AI to access my accounts and files.</Label>
                </div>
                <p className="text-sm text-muted-foreground">Note: You can revoke access at any time by disabling this feature.</p>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium">Data Analysis</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shoppingHistory" 
                      disabled={!aiPersonalization}
                      checked={shoppingHistory}
                      onCheckedChange={(checked) => setShoppingHistory(checked as boolean)}
                    />
                    <Label htmlFor="shoppingHistory">Allow AI to analyze your shopping history for personalized recommendations.</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="friendPreferences" 
                      disabled={!aiPersonalization}
                      checked={friendPreferences}
                      onCheckedChange={(checked) => setFriendPreferences(checked as boolean)}
                    />
                    <Label htmlFor="friendPreferences">Allow AI to consider your friends' preferences for gift suggestions.</Label>
                  </div>
                </div>

                <Separator className="my-4" />

                <PersonalizationSettings 
                  preferences={userPreferences}
                  onPreferencesChange={setUserPreferences}
                  disabled={!aiPersonalization}
                />
                
                <Button 
                  onClick={() => handleSaveSettings("AI personalization")}
                  disabled={!aiPersonalization}
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security options for your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Update Security Questions</h3>
                  <p className="text-sm text-muted-foreground">Security questions help verify your identity if you forget your password.</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="question1">Question 1</Label>
                      <Input id="question1" defaultValue="What was the name of your first pet?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="answer1">Answer</Label>
                      <Input id="answer1" type="password" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Session Management</h3>
                  <p className="text-sm text-muted-foreground">View and manage active sessions and sign out of other devices.</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="text-sm font-medium">Current Session</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Active now</span>
                        </div>
                      </div>
                      <p className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Current</p>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="text-sm font-medium">Chrome on iPhone</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>3 days ago</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">Sign Out</Button>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-2">Sign Out of All Devices</Button>
                </div>
                
                <Button onClick={() => handleSaveSettings("security")}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Legal and Compliance */}
          <TabsContent value="legal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Legal and Compliance</CardTitle>
                <CardDescription>Important legal documents and agreements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Terms of Service</h3>
                  <p className="text-sm text-muted-foreground">Last updated: June 1, 2023</p>
                  <div className="p-4 bg-muted rounded-md max-h-40 overflow-y-auto">
                    <p className="text-sm">
                      These Terms of Service ("Terms") govern your access to and use of AI Dropship Genius services, including our website, products, and applications (the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree to these Terms, do not access or use the Services.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Read Full Terms</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Privacy Policy</h3>
                  <p className="text-sm text-muted-foreground">Last updated: June 1, 2023</p>
                  <div className="p-4 bg-muted rounded-md max-h-40 overflow-y-auto">
                    <p className="text-sm">
                      This Privacy Policy describes how AI Dropship Genius collects, uses, and discloses information about you. We collect information when you create an account, use our services, and communicate with us. We use information to provide, improve, and develop our services, communicate with you, and for security and fraud prevention.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Read Full Policy</Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="agreeTerms" />
                  <Label htmlFor="agreeTerms">I have read and agree to the Terms of Service and Privacy Policy</Label>
                </div>
                
                <Button onClick={() => handleSaveSettings("legal agreements")}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
