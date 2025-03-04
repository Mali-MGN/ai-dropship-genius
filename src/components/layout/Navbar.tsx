
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full transition-all duration-200",
        scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="hidden md:block flex-1">
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
            
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
              AG
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
