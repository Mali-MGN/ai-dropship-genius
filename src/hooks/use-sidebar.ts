
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useSidebar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  // Close sidebar when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  
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
