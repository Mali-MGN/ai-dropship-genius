
import React from "react";
import {
  Home,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Sparkles,
  Bot
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { Icons } from "@/components/icons";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const Sidebar = ({ open = false, onOpenChange, className }: SidebarProps) => {
  // We'll still use the useSidebar hook for additional functionality,
  // but respect the incoming open/onOpenChange props
  const { collapsed } = useSidebar();

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
      href: "/product-discovery",
      icon: ShoppingCart,
      label: "Product Discovery",
    },
    {
      href: "/ai-product-discovery",
      icon: Sparkles,
      label: "AI Discovery",
    },
    {
      href: "/ai-assistant",
      icon: Bot,
      label: "AI Assistant",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <div
      className={cn(
        "group relative flex h-full w-64 flex-col border-r bg-secondary transition-all duration-300",
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-8 flex items-center justify-start space-x-2.5 px-4">
          <Icons.logo className="h-6 w-6 text-foreground" />
          <span className="text-lg font-semibold">{`AI Dropship Genius`}</span>
        </div>
        <div className="space-y-2">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={() => {
                // Close sidebar on mobile when a link is clicked
                if (onOpenChange && window.innerWidth < 768) {
                  onOpenChange(false);
                }
              }}
              className={({ isActive }) =>
                cn(
                  "group flex w-full items-center space-x-3 rounded-md border-0 py-2 pl-6 pr-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
