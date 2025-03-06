
import { useState } from "react";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  const onExpand = () => setCollapsed(false);
  const onCollapse = () => setCollapsed(true);
  
  return {
    collapsed,
    onExpand,
    onCollapse,
  };
}
