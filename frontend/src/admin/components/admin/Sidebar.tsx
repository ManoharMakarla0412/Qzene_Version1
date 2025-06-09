import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics",
  },
  {
    id: "recipes",
    label: "Recipes",
    icon: ChefHat,
    description: "Recipe Management",
  },
  {
    id: "ingredients",
    label: "Ingredients",
    icon: Package,
    description: "Ingredient Management",
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    description: "Order Tracking",
  },
  { id: "chefs", label: "Chefs", icon: Users, description: "Chef Management" },
  {
    id: "users",
    label: "Users",
    icon: UserCheck,
    description: "User Management",
  },
  {
    id: "enums",
    label: "Enums",
    icon: Settings,
    description: "System Configuration",
  },
];

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  console.log("User: ", user);
  return (
    <div
      className={cn(
        "bg-white shadow-xl border-r border-gray-100 transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="p-6 mb-2 relative">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute  top-6 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </button>
        <div className="flex items-center space-x-3">
          {!isCollapsed && (
            <>
              <div className="w-10 h-10 bg-gradient-to-r from-[#F25A38] to-[#CD1265] rounded-xl flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#F25A38] to-[#CD1265] bg-clip-text text-transparent">
                  Qzene Admin
                </h1>
                <p className="text-xs text-gray-500 mt-1">Recipe Marketplace</p>
              </div>
            </>
          )}
        </div>
      </div>
      <Separator className="text-gray-400" />

      {/* Navigation */}
      <nav className="mt-6 px-4 pb-20">
        {" "}
        {/* Added padding-bottom to avoid overlap */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center p-3 text-left text-sm font-medium transition-all duration-200 rounded-xl group",
                  isActive
                    ? "bg-gradient-to-r from-[#F25A38] to-[#CD1265] shadow-lg"
                    : "text-[#CD1265] hover:bg-gray-100 hover:text-[#F25A38]", // Darker hover background
                  isActive && "hover:opacity-90" // Subtle hover effect on active item
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-gray-600 group-hover:text-[#F25A38]", // Better contrast
                    isCollapsed ? "mx-auto" : "mr-3"
                  )}
                />

                {!isCollapsed && (
                  <div className="flex-1">
                    <div
                      className={cn(
                        "font-medium",
                        isActive ? "text-white" : "text-gray-900"
                      )}
                    >
                      {item.label}
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        isActive ? "text-white/80" : "text-gray-500"
                      )}
                    >
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
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
            <div className="w-8 h-8 bg-gradient-to-r from-[#F25A38] to-[#CD1265] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {user.username}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
