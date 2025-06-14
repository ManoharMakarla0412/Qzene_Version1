import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ChefHat,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  Package,
  UserCheck,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Overview & Analytics" },
  { id: "recipes", label: "Recipes", icon: ChefHat, description: "Recipe Management" },
  { id: "verify-recipes", label: "Verify Recipe", icon: CheckCircle, description: "Recipe Verification" },
  { id: "ingredients", label: "Ingredients", icon: Package, description: "Ingredient Management" },
  { id: "orders", label: "Orders", icon: ShoppingCart, description: "Order Tracking" },
  { id: "chefs", label: "Chefs", icon: Users, description: "Chef Management" },
  { id: "users", label: "Users", icon: UserCheck, description: "User Management" },
  { id: "enums", label: "Enums", icon: Settings, description: "System Configuration" },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  
  return (
    <div
      className={cn(
        "h-screen flex flex-col text-[#CD1265] transition-all duration-300",
        "bg-white", // Set background color to white
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center p-4 h-[68px] border-b border-[#CD1265]/20", // Use subtle border
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <Link to="/admin" className="flex items-center">
            <img
              src="/logo/qzene_logo.jpg"
              alt="Qzene Logo"
              className="h-10 object-contain w-32"
            />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-[#F25A38]/80 transition-colors" // Use accent color on hover
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-white" />
          ) : (
            <ArrowLeft className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2 pb-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center p-3 text-left font-medium text-[#CD1265] transition-all duration-200 rounded-lg",
                  isActive
                    ? "bg-[#F25A38] font-bold text-white" // Active state with orange color
                    : "hover:bg-[#F25A38] hover:text-white",    // Hover state with orange color
                  isCollapsed ? "justify-center" : "px-4"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")}
                />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium text-[#CD1265]">{item.label}</div>
                    <div className="text-xs text-[#CD1265]/70 mt-1">
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className={cn("p-4 border-t border-[#CD1265]/20", isCollapsed ? "flex justify-center" : "")}>
        <div className={cn(
          "flex items-center rounded-lg p-2 transition-colors",
          isCollapsed ? "justify-center w-12 h-12" : "space-x-3 w-full"
        )}>
          <div className="w-8 h-8 bg-[#CD1265] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[#CD1265] truncate">
                {user?.username || "User"}
              </div>
              <div className="text-xs text-[#CD1265]/70 truncate">
                {user?.email || "user@example.com"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};