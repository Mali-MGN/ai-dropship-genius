
import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/hooks/use-sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const { open, toggleSidebar, closeSidebar } = useSidebar();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        open={open} 
        onClose={closeSidebar}
      />
      
      <div className="flex flex-col flex-1 w-full overflow-hidden ml-0 md:ml-16">
        <Navbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-auto pb-8">
          <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
