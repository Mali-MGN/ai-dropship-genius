
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

interface SidebarProps {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Sidebar = ({ className, open, onOpenChange }: SidebarProps) => {
  const { collapsed, onExpand, onCollapse } = useSidebar();

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
        "group relative flex h-full w-64 flex-col border-r bg-secondary",
        className
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-8 flex items-center justify-start space-x-2.5 px-4">
          <Icons.logo className="h-6 w-6 text-foreground" />
          <span className="hidden text-lg font-semibold">{`AI Dropship Genius`}</span>
        </div>
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
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
