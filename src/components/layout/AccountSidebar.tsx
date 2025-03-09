
import React from "react";
import { User, LogOut, Settings, CreditCard, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AccountSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const AccountSidebar = ({ open, onClose }: AccountSidebarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
    navigate("/auth");
    onClose();
  };

  const accountMenuItems = [
    {
      icon: User,
      label: "My Profile",
      onClick: () => {
        navigate("/settings");
        onClose();
      }
    },
    {
      icon: CreditCard,
      label: "Billing",
      onClick: () => {
        navigate("/settings");
        onClose();
      }
    },
    {
      icon: Settings,
      label: "Account Settings",
      onClick: () => {
        navigate("/settings");
        onClose();
      }
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => {
        window.open("https://support.example.com", "_blank");
        onClose();
      }
    },
    {
      icon: LogOut,
      label: "Sign Out",
      onClick: handleSignOut
    }
  ];

  if (!user) return null;

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-200 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
            {user.email?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{user.email?.split('@')[0]}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <nav className="space-y-1">
          {accountMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex w-full items-center px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5 text-muted-foreground" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
