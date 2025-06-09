import { useState, useEffect } from 'react';
import { Sidebar } from '../components/admin/Sidebar';
import { Dashboard } from '../components/admin/Dashboard';
import { RecipeManagement } from '../components/admin/RecipeManagement';
import { IngredientManagement } from '../components/admin/IngredientManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { ChefManagement } from '../components/admin/ChefManagement';
import { UserManagement } from '../components/admin/UserManagement';
import { EnumsManagement } from '../components/admin/EnumsManagement';
import { Bell, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout } = useAuth();

  // Fetch initial data (e.g., for Dashboard or EnumsManagement)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/v1/admin/enums/categories', {
          method: "GET",
          credentials: "include", // Send JWT cookie
          headers: { "Content-Type": "application/json" }, // If token is stored in user
        });

        console.log('Categories:', response);
      } catch (error) {
        toast.error('Failed to fetch data');
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
        }
      }
    };
    if (user?.roles.includes('admin')) {
      fetchData();
    }
  }, [user, logout]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'recipes':
        return <RecipeManagement />;
      case 'ingredients':
        return <IngredientManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'chefs':
        return <ChefManagement />;
      case 'users':
        return <UserManagement />;
      case 'enums':
        return <EnumsManagement />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'recipes':
        return 'Recipe Management';
      case 'ingredients':
        return 'Ingredient Management';
      case 'orders':
        return 'Order Management';
      case 'chefs':
        return 'Chef Management';
      case 'users':
        return 'User Management';
      case 'enums':
        return 'Enums Management';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#F25A38] rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              {/* User Avatar */}
              <div
                className="w-8 h-8 qzene-gradient rounded-full flex items-center justify-center cursor-pointer"
                onClick={logout}
              >
                <span className="text-white text-sm font-medium">{user?.username?.[0] || 'A'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;