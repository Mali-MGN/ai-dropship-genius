
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard,
  Search,
  ShoppingCart,
  BarChart4,
  Truck,
  Settings,
  MessageSquare,
  Megaphone,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const location = useLocation();
  
  const links = [
    { 
      name: "Dashboard", 
      href: "/", 
      icon: LayoutDashboard,
      current: location.pathname === "/"
    },
    { 
      name: "Product Discovery", 
      href: "/products/discovery", 
      icon: Search,
      current: location.pathname === "/products/discovery"
    },
    { 
      name: "Store Management", 
      href: "/store", 
      icon: ShoppingCart,
      current: location.pathname === "/store"
    },
    { 
      name: "Marketing", 
      href: "/marketing", 
      icon: Megaphone,
      current: location.pathname === "/marketing"
    },
    { 
      name: "Orders & Shipping", 
      href: "/orders", 
      icon: Truck,
      current: location.pathname === "/orders"
    },
    { 
      name: "Analytics", 
      href: "/analytics", 
      icon: BarChart4,
      current: location.pathname === "/analytics"
    },
    { 
      name: "AI Assistant", 
      href: "/assistant", 
      icon: MessageSquare,
      current: location.pathname === "/assistant"
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border md:relative md:z-0 md:w-64 md:translate-x-0 transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AI</span>
            </div>
            <span className="font-semibold">AI-Dropship Genius</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 py-4 h-[calc(100vh-64px)]">
          <nav className="px-2 space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors",
                  link.current
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            ))}
          </nav>
          
          <Separator className="my-4 mx-2" />
          
          <div className="px-4">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
