
import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ai/StarRating";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { 
  Send, 
  Zap, 
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  HelpCircle,
  Search
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const sessionId = useRef(`session-${Date.now()}`);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: "Hello! I'm your AI Dropshipping Assistant. I can help you find trending products, optimize your store, suggest marketing strategies, and more. How can I assist you today?",
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Here would be the actual API call to your AI service
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: generateMockResponse(inputValue),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const generateMockResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("trending product") || lowerInput.includes("popular product")) {
      return "Based on our data, current trending products include portable UV sanitizers, smart LED projectors, collapsible water bottles, and magnetic phone chargers. These products have shown consistent growth in the past 3 months with profit margins between 25-40%.";
    } else if (lowerInput.includes("supplier") || lowerInput.includes("manufacturer")) {
      return "I recommend checking AliExpress, Alibaba, and CJDropshipping for reliable suppliers. When choosing a supplier, verify their business license, check customer reviews, and request product samples. It's also important to understand their shipping times and return policies.";
    } else if (lowerInput.includes("marketing") || lowerInput.includes("advertise")) {
      return "For dropshipping, the most effective marketing channels are typically Facebook/Instagram ads, Google Shopping, and TikTok. I suggest starting with a small daily budget ($10-20) to test different ad creatives and targeting options before scaling up your successful campaigns.";
    } else if (lowerInput.includes("shipping time") || lowerInput.includes("delivery")) {
      return "Long shipping times can be a challenge in dropshipping. Consider using suppliers with warehouses in your target market country, or use services like CJDropshipping that offer faster shipping options. Always be transparent with customers about expected delivery times to reduce complaints and returns.";
    } else {
      return "I'd be happy to help with your dropshipping business. I can provide insights on trending products, supplier selection, marketing strategies, pricing optimization, and more. Could you please provide more specific details about what you're looking for?";
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text copied",
      description: "Message content copied to clipboard",
    });
  };

  const handleFeedback = (messageId: string) => {
    setShowFeedback(messageId);
  };

  const submitFeedback = async (messageId: string) => {
    // Find the user message and AI response pair
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex < 0 || messageIndex === 0) return;
    
    const aiMessage = messages[messageIndex];
    const userMessage = messages[messageIndex - 1];
    
    try {
      await supabase
        .from('ai_assistant_feedback')
        .insert({
          user_id: user?.id || null,
          message_content: userMessage.content,
          assistant_response: aiMessage.content,
          rating: rating,
          feedback_text: feedbackText,
          session_id: sessionId.current
        });
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve our AI assistant.",
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
    
    setShowFeedback(null);
    setRating(0);
    setFeedbackText("");
  };

  const clearChat = () => {
    // Generate a new session ID for new conversation
    sessionId.current = `session-${Date.now()}`;
    
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: "Hello! I'm your AI Dropshipping Assistant. I can help you find trending products, optimize your store, suggest marketing strategies, and more. How can I assist you today?",
        timestamp: new Date()
      }
    ]);
    
    toast({
      title: "Chat cleared",
      description: "Started a new conversation",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground text-lg">Your personal AI assistant for all things dropshipping</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col h-[70vh]">
              <CardHeader className="px-4 py-3 border-b flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">AI Dropshipping Assistant</CardTitle>
                    <CardDescription>Powered by AI to help grow your business</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full px-4 py-2">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div 
                          className={`flex gap-3 max-w-[90%] ${
                            message.role === "user" 
                              ? "flex-row-reverse" 
                              : "flex-row"
                          }`}
                        >
                          <Avatar className={`h-8 w-8 mt-0.5 ${
                            message.role === "user" 
                              ? "bg-blue-500" 
                              : "bg-primary/10"
                          }`}>
                            {message.role === "user" ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-primary" />
                            )}
                          </Avatar>
                          
                          <div>
                            <div className={`rounded-lg p-3 ${
                              message.role === "user" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            }`}>
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-1 mt-1">
                                <button 
                                  onClick={() => handleCopyText(message.content)}
                                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 p-1 rounded"
                                >
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </button>
                                
                                <span className="text-muted-foreground">•</span>
                                
                                <button 
                                  onClick={() => handleFeedback(message.id)}
                                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 p-1 rounded"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                  Feedback
                                </button>
                                
                                {showFeedback === message.id && (
                                  <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
                                    <Card className="w-full max-w-md">
                                      <CardHeader>
                                        <CardTitle>Provide Feedback</CardTitle>
                                        <CardDescription>
                                          How helpful was this response?
                                        </CardDescription>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <StarRating 
                                          rating={rating} 
                                          onRatingChange={setRating} 
                                        />
                                        <Textarea
                                          placeholder="Additional comments (optional)"
                                          value={feedbackText}
                                          onChange={(e) => setFeedbackText(e.target.value)}
                                          className="resize-none"
                                          rows={3}
                                        />
                                      </CardContent>
                                      <CardFooter className="flex justify-between">
                                        <Button 
                                          variant="outline" 
                                          onClick={() => setShowFeedback(null)}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          onClick={() => submitFeedback(message.id)}
                                          disabled={rating === 0}
                                        >
                                          Submit Feedback
                                        </Button>
                                      </CardFooter>
                                    </Card>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                          <Avatar className="h-8 w-8 mt-0.5 bg-primary/10">
                            <Bot className="h-4 w-4 text-primary" />
                          </Avatar>
                          <div className="rounded-lg p-3 bg-muted">
                            <div className="flex items-center gap-1">
                              <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse"></div>
                              <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse delay-150"></div>
                              <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse delay-300"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
              
              <CardFooter className="p-4 border-t">
                <div className="flex gap-2 w-full">
                  <Textarea
                    placeholder="Ask anything about dropshipping..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 resize-none"
                    disabled={isLoading}
                    rows={1}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !inputValue.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Tools and suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={clearChat}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Conversation
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Suggested Questions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                      onClick={() => {
                        setInputValue("What are the trending products right now?");
                      }}
                    >
                      <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="line-clamp-2">What are the trending products right now?</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                      onClick={() => {
                        setInputValue("How can I find reliable suppliers?");
                      }}
                    >
                      <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="line-clamp-2">How can I find reliable suppliers?</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                      onClick={() => {
                        setInputValue("What marketing strategies work best for dropshipping?");
                      }}
                    >
                      <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="line-clamp-2">What marketing strategies work best for dropshipping?</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full justify-start h-auto py-2 px-3 text-left font-normal"
                      onClick={() => {
                        setInputValue("How do I handle long shipping times?");
                      }}
                    >
                      <Search className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="line-clamp-2">How do I handle long shipping times?</span>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm mb-2">Tips</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="flex gap-2">
                      <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Be specific with your questions for better answers</span>
                    </p>
                    <p className="flex gap-2">
                      <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>You can ask follow-up questions to dive deeper</span>
                    </p>
                    <p className="flex gap-2">
                      <HelpCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Provide feedback to help improve responses</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIAssistant;
