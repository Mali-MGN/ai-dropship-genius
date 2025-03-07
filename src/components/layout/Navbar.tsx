import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Menu, X, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
    navigate("/auth");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full transition-all duration-200",
        scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            
            <h1 className="text-xl font-semibold">AI-Dropship Genius</h1>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, stores..."
                className="pl-10 w-[240px] bg-muted/50 focus-visible:bg-background border-none focus-visible:ring-1"
              />
            </div>
            
            {user && (
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] font-bold flex items-center justify-center text-white rounded-full">
                      {notifications}
                    </span>
                  )}
                </Button>
              </div>
            )}
            
            {user ? (
              <>
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                  {user.email?.substring(0, 2).toUpperCase() || 'AG'}
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={handleSignIn}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
