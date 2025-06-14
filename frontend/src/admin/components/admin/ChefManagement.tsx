import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, ChefHat, Star, Ban, CheckCircle } from "lucide-react";

const mockChefs = [
  {
    id: 1,
    name: "Gordon Ramsay",
    email: "gordon@qzene.com",
    status: "active",
    recipesCount: 45,
    totalEarnings: 18500,
    rating: 4.9,
    joinDate: "2024-01-15",
    speciality: "European Cuisine"
  },
  {
    id: 2,
    name: "Julia Child",
    email: "julia@qzene.com",
    status: "active",
    recipesCount: 32,
    totalEarnings: 14200,
    rating: 4.8,
    joinDate: "2024-02-03",
    speciality: "French Cuisine"
  },
  {
    id: 3,
    name: "Anthony Bourdain",
    email: "anthony@qzene.com",
    status: "suspended",
    recipesCount: 28,
    totalEarnings: 12800,
    rating: 4.7,
    joinDate: "2024-01-22",
    speciality: "International"
  },
];

export const ChefManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredChefs = mockChefs.filter(chef => {
    const matchesSearch = chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chef.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || chef.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Chef Management</h1>
        <Button className="bg-[#CD1265] text-white hover:bg-[#CD1265]/90">
          <Users className="h-4 w-4 mr-2" />
          Invite Chef
        </Button>
      </div>

      {/* Chef Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-emerald-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-emerald-600">89</div>
                <p className="text-sm text-gray-500">Total Chefs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">76</div>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Ban className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-red-600">8</div>
                <p className="text-sm text-gray-500">Suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">4.7</div>
                <p className="text-sm text-gray-500">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search chefs by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Chefs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChefs.map((chef) => (
          <Card key={chef.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <ChefHat className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{chef.name}</CardTitle>
                    <p className="text-sm text-gray-500">{chef.email}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(chef.status)}>
                  {chef.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Speciality:</span>
                  <span className="font-medium">{chef.speciality}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Recipes:</span>
                  <span className="font-medium">{chef.recipesCount}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Earnings:</span>
                  <span className="font-medium">${chef.totalEarnings.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Rating:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{chef.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Joined:</span>
                  <span className="font-medium">{chef.joinDate}</span>
                </div>

                <div className="flex justify-between pt-3 border-t space-x-2">
                  {chef.status === "active" ? (
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 flex-1">
                      <Ban className="h-3 w-3 mr-1" />
                      Suspend
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 flex-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activate
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
