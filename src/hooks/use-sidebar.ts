
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useSidebar = () => {
  const [open, setOpen] = useState(() => {
    // Try to get saved state from localStorage
    const savedState = localStorage.getItem('sidebarOpen');
    // Default to closed on mobile, open on desktop
    if (savedState) {
      return savedState === 'true';
    }
    return window.innerWidth >= 768;
  });
  
  const location = useLocation();
  
  // Close sidebar on route changes only on mobile devices
  useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [location.pathname]);
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', open.toString());
  }, [open]);
  
  const toggleSidebar = () => setOpen(prev => !prev);
  const closeSidebar = () => setOpen(false);
  const openSidebar = () => setOpen(true);
  
  return {
    open,
    toggleSidebar,
    closeSidebar,
    openSidebar
  };
};
