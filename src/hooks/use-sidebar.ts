
import { useState } from "react";

export const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const onExpand = () => setCollapsed(false);
  const onCollapse = () => setCollapsed(true);
  
  return {
    collapsed,
    onExpand,
    onCollapse
  };
};
