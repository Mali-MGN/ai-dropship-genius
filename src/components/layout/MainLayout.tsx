
import { useEffect } from "react";
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
  
  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobile && open) {
        closeSidebar();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isMobile, open, closeSidebar]);
  
  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    if (!isMobile || !open) return;
    
    const handleOutsideClick = (event: MouseEvent) => {
      const sidebar = document.getElementById('main-sidebar');
      if (sidebar && !sidebar.contains(event.target as Node)) {
        closeSidebar();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobile, open, closeSidebar]);
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        id="main-sidebar"
        open={open} 
        onClose={closeSidebar}
      />
      
      <div className={`flex flex-col flex-1 w-full overflow-hidden transition-all duration-300 ${
        !isMobile && open ? 'ml-64' : 'ml-0 md:ml-16'
      }`}>
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
