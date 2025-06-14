import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../components/admin/Sidebar";
import { Dashboard } from "../components/admin/Dashboard";
import { RecipeManagement } from "../components/admin/RecipeManagement";
import { IngredientManagement } from "../components/admin/IngredientManagement";
import { OrderManagement } from "../components/admin/OrderManagement";
import { ChefManagement } from "../components/admin/ChefManagement";
import { UserManagement } from "../components/admin/UserManagement";
import { EnumsManagement } from "../components/admin/EnumsManagement";
import { RecipeVerification } from "../components/admin/RecipeVerification";
import { Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { API_URL } from "@/lib/constants";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/v1/admin/enums/categories/all`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        // Assuming you want to do something with the response, e.g., setData(await response.json())
      } catch (error) {
        toast.error("Failed to fetch data");
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      }
    };
    if (user?.roles.includes("admin")) {
      fetchData();
    }
  }, [user, logout]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "recipes":
        return <RecipeManagement />;
      case "verify-recipes":
        return <RecipeVerification />;
      case "ingredients":
        return <IngredientManagement />;
      case "orders":
        return <OrderManagement />;
      case "chefs":
        return <ChefManagement />;
      case "users":
        return <UserManagement />;
      case "enums":
        return <EnumsManagement />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "recipes":
        return "Recipe Management";
      case "verify-recipes":
        return "Recipe Verification";
      case "ingredients":
        return "Ingredient Management";
      case "orders":
        return "Order Management";
      case "chefs":
        return "Chef Management";
      case "users":
        return "User Management";
      case "enums":
        return "Enums Management";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[60px] bg-white border-b border-gray-200 px-6 flex-shrink-0">
          <div className="flex items-center justify-between h-full">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F25A38] rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              {/* User Avatar with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F25A38] to-[#CD1265] 
                   flex items-center justify-center cursor-pointer 
                   hover:scale-105 active:scale-95 transition-transform shadow-md"
                  aria-label="Toggle user menu"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                >
                  <span className="text-white text-base font-semibold">
                    {user?.username?.[0]?.toUpperCase() || "A"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false); // Close dropdown after action
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      role="menuitem"
                    >
                      {/* Logout Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                    {/* You can add more links here, like "Profile" or "Settings" */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs could go here */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
