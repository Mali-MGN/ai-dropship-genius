
import React from "react";
import {
  Home,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Sparkles,
  Bot,
  ChevronLeft,
  BarChart
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface SidebarProps {
  id?: string;
  className?: string;
  open: boolean;
  onClose: () => void;
}

export const Sidebar = ({ id, className, open, onClose }: SidebarProps) => {
  const sidebarLinks = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/analytics",
      icon: BarChart,
      label: "Analytics",
    },
    {
      href: "/product-discovery",
      icon: ShoppingCart,
      label: "Product Discovery",
    },
    {
      href: "/ai-product-discovery",
      icon: Sparkles,
      label: "AI Hub",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div
      id={id}
      className={cn(
        "group fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-secondary transform transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
        className
      )}
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center justify-start space-x-2.5">
          <Icons.logo className="h-6 w-6 text-foreground" />
          <span className={cn("text-lg font-semibold", !open && "md:hidden")}>
            {`AI Dropship Genius`}
          </span>
        </div>
        <Button 
          onClick={onClose} 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-2">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "group flex w-full items-center space-x-3 rounded-md border-0 py-2 pl-6 pr-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <link.icon className="h-4 w-4" />
              <span className={cn(!open && "md:hidden")}>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
