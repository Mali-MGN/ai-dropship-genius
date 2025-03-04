
import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Bot,
  User,
  Send,
  MessageSquare,
  Sparkles,
  Zap,
  Mic,
  StopCircle,
  ShoppingCart,
  Megaphone,
  BarChart,
  Target,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hello! I'm your AI assistant. How can I help you with your dropshipping business today?", timestamp: new Date().toISOString() },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate a session ID if one doesn't exist
  useEffect(() => {
    if (!sessionId) {
      setSessionId(uuidv4());
    }
  }, [sessionId]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = { 
      id: messages.length + 1, 
      role: "user", 
      content: inputMessage, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = {
        "product ideas": "Based on current trends, consider adding these products to your store:\n\n1. Portable UV Sanitizer Box\n2. Smart LED Galaxy Projector\n3. Foldable Laptop Stand with Cooling Fan\n\nThese items have high profit margins and growing demand.",
        "pricing strategy": "Looking at your current inventory, I recommend:\n\n• Increase prices for your top 5 products by 10%\n• Run a limited-time promotion on slow-moving inventory\n• Add bundle deals for complementary products\n\nThis should increase your average order value by approximately 15%.",
        "marketing tips": "To boost your conversion rate:\n\n• Create urgency with limited-time offers\n• Implement exit-intent popups with discounts\n• Optimize product images with lifestyle photos\n• Add video demonstrations to top products",
        "competitor": "After analyzing your niche, your main competitors are:\n\n1. GadgetHub - Strong in electronics, weak in shipping times\n2. TrendyDrops - Good marketing, higher prices than yours\n3. QuickShip - Fast delivery, limited product variety\n\nYou can differentiate by improving your product descriptions and offering faster shipping.",
        "sales": "Your sales are up 12% from last month! I recommend focusing on:\n\n• Email marketing to previous customers\n• Expanding your Facebook ad campaigns\n• Adding more products in the 'Home Gadgets' category",
        "default": "I'm here to help with your dropshipping business. I can provide insights on product trends, pricing strategies, marketing ideas, and competitor analysis. What specific aspect of your business would you like assistance with?"
      };
      
      // Check for keywords to determine response
      const lowercaseInput = userMessage.content.toLowerCase();
      let responseContent = aiResponses.default;
      
      if (lowercaseInput.includes("product") || lowercaseInput.includes("item") || lowercaseInput.includes("trend")) {
        responseContent = aiResponses["product ideas"];
      } else if (lowercaseInput.includes("price") || lowercaseInput.includes("cost") || lowercaseInput.includes("margin")) {
        responseContent = aiResponses["pricing strategy"];
      } else if (lowercaseInput.includes("market") || lowercaseInput.includes("promot") || lowercaseInput.includes("advertis")) {
        responseContent = aiResponses["marketing tips"];
      } else if (lowercaseInput.includes("competitor") || lowercaseInput.includes("rival") || lowercaseInput.includes("other store")) {
        responseContent = aiResponses["competitor"];
      } else if (lowercaseInput.includes("sale") || lowercaseInput.includes("revenue") || lowercaseInput.includes("performance")) {
        responseContent = aiResponses["sales"];
      }
      
      const assistantMessage = { 
        id: messages.length + 2, 
        role: "assistant", 
        content: responseContent, 
        timestamp: new Date().toISOString() 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Your message has been transcribed.",
      });
      setInputMessage("How can I improve my product descriptions?");
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak clearly into your microphone.",
      });
    }
  };

  const openFeedbackForm = (messageId: number) => {
    setFeedbackMessage(messageId);
    setShowFeedbackForm(true);
  };

  const closeFeedbackForm = () => {
    setFeedbackMessage(null);
    setFeedbackRating(null);
    setFeedbackText("");
    setShowFeedbackForm(false);
  };

  const submitFeedback = async () => {
    if (feedbackRating === null || feedbackMessage === null) {
      toast({
        title: "Error",
        description: "Please provide a rating before submitting feedback.",
        variant: "destructive",
      });
      return;
    }

    try {
      const messageIndex = messages.findIndex(m => m.id === feedbackMessage);
      if (messageIndex < 1) return; // Need at least 2 messages (user question and AI response)
      
      const userMessage = messages[messageIndex - 1];
      const aiMessage = messages[messageIndex];
      
      // Get current authenticated user (if any)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Insert feedback into the database
      await supabase.from('ai_assistant_feedback').insert({
        user_id: user?.id || null,
        message_content: userMessage.content,
        assistant_response: aiMessage.content,
        rating: feedbackRating,
        feedback_text: feedbackText.trim() || null,
        session_id: sessionId
      });

      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve our AI assistant.",
      });
      
      closeFeedbackForm();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock recommendations data
  const productRecommendations = [
    { id: 1, name: "Portable Ring Light with Phone Holder", confidence: 92, category: "Electronics" },
    { id: 2, name: "Eco-Friendly Bamboo Cutlery Set", confidence: 88, category: "Kitchen" },
    { id: 3, name: "Foldable Solar Powered Camping Lantern", confidence: 85, category: "Outdoors" }
  ];

  const marketingRecommendations = [
    { id: 1, name: "Flash Sale for Weekend Shoppers", confidence: 94, target: "All Visitors" },
    { id: 2, name: "Abandoned Cart Email Sequence", confidence: 90, target: "Cart Abandoners" },
    { id: 3, name: "New Customer Welcome Discount", confidence: 87, target: "First-time Visitors" }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground text-lg">Your intelligent business advisor and chatbot</p>
        </div>

        <Tabs defaultValue="chat" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Assistant
            </TabsTrigger>
            <TabsTrigger value="advisor" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Business Advisor
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Assistant Settings
            </TabsTrigger>
          </TabsList>

          {/* Chat Assistant Tab */}
          <TabsContent value="chat" className="space-y-4 pb-20">
            <Card className="border-none shadow-none">
              <CardContent className="p-0">
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-4 py-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`flex gap-3 max-w-[80%] ${
                            message.role === "assistant"
                              ? "bg-muted rounded-lg p-3"
                              : "bg-primary text-primary-foreground rounded-lg p-3"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="h-8 w-8 border">
                              <Bot className="h-4 w-4" />
                            </Avatar>
                          )}
                          <div className="space-y-1">
                            <div className="whitespace-pre-line text-sm">
                              {message.content}
                            </div>
                            <div className="text-xs opacity-50">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            {message.role === "assistant" && (
                              <div className="flex space-x-2 pt-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => openFeedbackForm(message.id)}
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                          {message.role === "user" && (
                            <Avatar className="h-8 w-8 border">
                              <User className="h-4 w-4" />
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border">
                              <Bot className="h-4 w-4" />
                            </Avatar>
                            <div className="flex gap-1">
                              <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={endOfMessagesRef} />
                  </div>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-20 pointer-events-none" />
              </CardContent>
            </Card>

            {/* Feedback Dialog */}
            {showFeedbackForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle>Rate this response</CardTitle>
                    <CardDescription>
                      Your feedback helps us improve our AI assistant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={feedbackRating === rating ? "default" : "outline"}
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => setFeedbackRating(rating)}
                        >
                          <Star 
                            className={`h-6 w-6 ${feedbackRating !== null && rating <= feedbackRating ? "fill-current text-yellow-400" : ""}`} 
                          />
                        </Button>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="feedback" className="text-sm font-medium">
                        Additional comments (optional)
                      </label>
                      <Textarea
                        id="feedback"
                        placeholder="Tell us what you liked or how we could improve..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={closeFeedbackForm}>
                      Cancel
                    </Button>
                    <Button onClick={submitFeedback}>
                      Submit Feedback
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            <div className="fixed bottom-4 left-4 right-4 bg-background z-10 max-w-5xl mx-auto">
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceToggle}
                  className={isRecording ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : ""}
                >
                  {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your dropshipping business..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex gap-1 overflow-x-auto pb-2 text-xs">
                <Badge variant="outline" className="cursor-pointer whitespace-nowrap" onClick={() => setInputMessage("What products are trending right now?")}>
                  Trending products
                </Badge>
                <Badge variant="outline" className="cursor-pointer whitespace-nowrap" onClick={() => setInputMessage("How should I price my products?")}>
                  Pricing strategy
                </Badge>
                <Badge variant="outline" className="cursor-pointer whitespace-nowrap" onClick={() => setInputMessage("Give me marketing tips")}>
                  Marketing tips
                </Badge>
                <Badge variant="outline" className="cursor-pointer whitespace-nowrap" onClick={() => setInputMessage("Who are my main competitors?")}>
                  Competitor analysis
                </Badge>
                <Badge variant="outline" className="cursor-pointer whitespace-nowrap" onClick={() => setInputMessage("How are my sales performing?")}>
                  Sales performance
                </Badge>
              </div>
            </div>
          </TabsContent>

          {/* Business Advisor Tab */}
          <TabsContent value="advisor" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-blue-500" />
                    Product Recommendations
                  </CardTitle>
                  <CardDescription>
                    AI-suggested products to add to your store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productRecommendations.map((product) => (
                      <div key={product.id} className="flex items-start justify-between border-b pb-2">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{product.category}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-amber-500" />
                              <span>{product.confidence}% match</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Import</Button>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">View More Recommendations</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-blue-500" />
                    Marketing Recommendations
                  </CardTitle>
                  <CardDescription>
                    AI-suggested marketing strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketingRecommendations.map((strategy) => (
                      <div key={strategy.id} className="flex items-start justify-between border-b pb-2">
                        <div>
                          <h3 className="font-medium">{strategy.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs py-0 font-normal">
                              {strategy.target}
                            </Badge>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3 text-green-500" />
                              <span>{strategy.confidence}% effective</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Apply</Button>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">View More Strategies</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-blue-500" />
                  Business Insights
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of your store performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Weekly Sales Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Your sales have increased by 15% compared to last week. Here's what's working:
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <div className="bg-green-500/20 text-green-600 p-1 rounded-full mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Your "Home Gadgets" category is outperforming all others</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-500/20 text-green-600 p-1 rounded-full mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Your email campaign had a 32% open rate (8% above industry average)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-green-500/20 text-green-600 p-1 rounded-full mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Free shipping promotion increased average order value by 22%</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Improvement Opportunities</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">
                      Based on your store data, here are areas where you can improve:
                    </p>
                    <ul className="text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <div className="bg-amber-500/20 text-amber-600 p-1 rounded-full mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9797 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02029 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98663 7.5 8.98663C7.2208 8.98663 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Mobile checkout conversion is 15% lower than desktop</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-amber-500/20 text-amber-600 p-1 rounded-full mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9797 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02029 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98663 7.5 8.98663C7.2208 8.98663 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Customer reviews are below average for "Electronics" category</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="bg-amber-500/20 text-amber-600 p-1 rounded-full mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.4449 0.608765C8.0183 -0.107015 6.9817 -0.107015 6.55509 0.608766L0.161178 11.3368C-0.275824 12.07 0.252503 13 1.10608 13H13.8939C14.7475 13 15.2758 12.07 14.8388 11.3368L8.4449 0.608765ZM7.4141 1.12073C7.45288 1.05566 7.54712 1.05566 7.5859 1.12073L13.9797 11.8488C14.0196 11.9154 13.9715 12 13.8939 12H1.10608C1.02849 12 0.980454 11.9154 1.02029 11.8488L7.4141 1.12073ZM6.8269 4.48611C6.81221 4.10423 7.11783 3.78663 7.5 3.78663C7.88217 3.78663 8.18778 4.10423 8.1731 4.48612L8.01921 8.48701C8.00848 8.766 7.7792 8.98663 7.5 8.98663C7.2208 8.98663 6.99151 8.766 6.98078 8.48701L6.8269 4.48611ZM8.24989 10.476C8.24989 10.8902 7.9141 11.226 7.49989 11.226C7.08567 11.226 6.74989 10.8902 6.74989 10.476C6.74989 10.0618 7.08567 9.72599 7.49989 9.72599C7.9141 9.72599 8.24989 10.0618 8.24989 10.476Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span>Social media engagement is 20% below competitors</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assistant Settings</CardTitle>
                <CardDescription>Configure your AI assistant's behavior and capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Proactive Suggestions</h4>
                      <p className="text-sm text-muted-foreground">Allow assistant to provide unsolicited business recommendations</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Voice Interaction</h4>
                      <p className="text-sm text-muted-foreground">Enable voice commands and responses</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Collection</h4>
                      <p className="text-sm text-muted-foreground">Allow AI to learn from your interactions to improve responses</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Desktop Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive desktop alerts for important insights</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Digests</h4>
                      <p className="text-sm text-muted-foreground">Receive weekly email summaries of AI insights</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-apply Recommendations</h4>
                      <p className="text-sm text-muted-foreground">Automatically implement high-confidence suggestions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">AI Knowledge Areas</h3>
                  <p className="text-sm text-muted-foreground">Select which expertise areas your assistant should focus on</p>
                  
                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Industry Focus</h4>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry focus" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                            <SelectItem value="electronics">Electronics & Gadgets</SelectItem>
                            <SelectItem value="home">Home & Garden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Response Detail Level</h4>
                        <Select defaultValue="balanced">
                          <SelectTrigger>
                            <SelectValue placeholder="Select detail level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="brief">Brief</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="detailed">Detailed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <h4 className="font-medium mt-4 mb-2">Assistant Capabilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="product-research" defaultChecked />
                        <label htmlFor="product-research" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Product Research</label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="pricing-strategy" defaultChecked />
                        <label htmlFor="pricing-strategy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pricing Strategy</label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="marketing-tips" defaultChecked />
                        <label htmlFor="marketing-tips" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Marketing Tips</label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="competitor-analysis" defaultChecked />
                        <label htmlFor="competitor-analysis" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Competitor Analysis</label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox id="sales-insights" defaultChecked />
                        <label htmlFor="sales-insights" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Sales Insights</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AIAssistant;
