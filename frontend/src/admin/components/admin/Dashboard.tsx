import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { ChefHat, ShoppingCart, Receipt, Users, TrendingUp, Star, ArrowUpRight, ArrowDownRight, Settings } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 12000, orders: 45, chefs: 12 },
  { month: "Feb", revenue: 15000, orders: 52, chefs: 15 },
  { month: "Mar", revenue: 18000, orders: 68, chefs: 18 },
  { month: "Apr", revenue: 22000, orders: 84, chefs: 22 },
  { month: "May", revenue: 25000, orders: 95, chefs: 25 },
  { month: "Jun", revenue: 28000, orders: 112, chefs: 28 },
];

const popularRecipes = [
  { name: "Pasta Carbonara", orders: 125, revenue: 3750 },
  { name: "Beef Wellington", orders: 89, revenue: 4450 },
  { name: "Chocolate Soufflé", orders: 76, revenue: 2280 },
  { name: "Lobster Risotto", orders: 65, revenue: 3900 },
  { name: "Duck Confit", orders: 54, revenue: 2700 },
];

const categoryData = [
  { name: "Main Course", value: 45, color: "#F25A38" },
  { name: "Desserts", value: 25, color: "#CD1265" },
  { name: "Appetizers", value: 20, color: "#FF8A65" },
  { name: "Beverages", value: 10, color: "#E91E63" },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, description }: any) => (
  <Card className="qzene-card hover:scale-105 transition-transform duration-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 qzene-gradient rounded-xl flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            {trendValue}
          </div>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F25A38] to-[#CD1265] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with Qzene today.</p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Recipes"
          value="1,247"
          icon={ChefHat}
          trend="up"
          trendValue="+12%"
          description="from last month"
        />
        <StatCard
          title="Total Orders"
          value="3,842"
          icon={ShoppingCart}
          trend="up"
          trendValue="+18%"
          description="from last month"
        />
        <StatCard
          title="Total Revenue"
          value="$142,500"
          icon={Receipt}
          trend="up"
          trendValue="+24%"
          description="from last month"
        />
        <StatCard
          title="Active Chefs"
          value="89"
          icon={Users}
          trend="up"
          trendValue="+8%"
          description="from last month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends */}
        <Card className="qzene-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#F25A38]" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value, name) => [`$${value}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="url(#gradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#F25A38', strokeWidth: 2, r: 4 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F25A38" />
                    <stop offset="100%" stopColor="#CD1265" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recipe Categories */}
        <Card className="qzene-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ChefHat className="h-5 w-5 mr-2 text-[#CD1265]" />
              Recipe Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Recipes and Top Chefs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Recipes */}
        <Card className="qzene-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Popular Recipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularRecipes} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" width={100} stroke="#666" />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'orders' ? 'Orders' : 'Revenue ($)']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="orders" fill="url(#barGradient)" radius={4} />
                <defs>
                  <linearGradient id="barGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F25A38" />
                    <stop offset="100%" stopColor="#CD1265" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Chefs */}
        <Card className="qzene-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-[#F25A38]" />
              Top Performing Chefs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Gordon Ramsay", recipes: 45, revenue: 18500, rating: 4.9, avatar: "GR" },
                { name: "Julia Child", recipes: 32, revenue: 14200, rating: 4.8, avatar: "JC" },
                { name: "Anthony Bourdain", recipes: 28, revenue: 12800, rating: 4.7, avatar: "AB" },
                { name: "Emeril Lagasse", recipes: 36, revenue: 11200, rating: 4.6, avatar: "EL" },
              ].map((chef, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 qzene-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{chef.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{chef.name}</h3>
                      <p className="text-sm text-gray-500">{chef.recipes} recipes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${chef.revenue.toLocaleString()}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {chef.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="qzene-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="qzene-btn-primary p-4 rounded-xl text-center">
              <ChefHat className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">Add Recipe</div>
              <div className="text-sm opacity-80">Create new recipe</div>
            </button>
            <button className="qzene-btn-secondary p-4 rounded-xl text-center">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">Manage Chefs</div>
              <div className="text-sm opacity-80">View chef profiles</div>
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-xl text-center transition-colors">
              <Settings className="h-6 w-6 mx-auto mb-2" />
              <div className="font-medium">System Settings</div>
              <div className="text-sm opacity-80">Configure enums</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
