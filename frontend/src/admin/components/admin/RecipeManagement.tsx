import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Filter,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner"; // Using sonner for toast notifications
import { API_URL } from "@/lib/constants";
import { useRecipe } from "@/contexts/RecipeContext";

// --- Step 1: Define TypeScript types for clarity and safety ---

// The structure of the data the component needs to display
interface DisplayRecipe {
  id: string; // a.k.a. _id from API
  name: string;
  type: string; // from category
  chef: string; // from user_id (can be enhanced to show name)
  price: number;
  status: "approved" | "pending" | "rejected"; // This is mocked, as API doesn't provide it
  rating: number; // Mocked
  orders: number; // Mocked
  tags: string[];
  image: string;
  openai_generated_content?: string; // Optional property for generated content
}

// The structure of the recipe object from your API
interface ApiRecipe {
  _id: string;
  name: string;
  category: string;
  price: number;
  user_id: string;
  image: string | null;
  cuisine_type: string;
  recipe_type: string;
  // You can add other fields from the API if needed
}

export const RecipeManagement = () => {
  const { recipes: apiRecipes, loading, refresh } = useRecipe();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<DisplayRecipe | null>(
    null
  );
  const navigate = useNavigate();

  // Transform API recipes into display format
  const recipes: DisplayRecipe[] = apiRecipes.map(
    (recipe: any): DisplayRecipe => ({
      id: recipe._id,
      name: recipe.name,
      type: recipe.category
        ? recipe.category.replace("_", " ")
        : "Uncategorized",
      chef: `User ${recipe.user_id?.substring(0, 8) || "Unknown"}...`,
      price: recipe.price || 0,
      status: "approved", // MOCK DATA: API doesn't have status, defaulting to approved
      rating: 4.5 + Math.random() * 0.5, // MOCK DATA
      orders: Math.floor(Math.random() * 250), // MOCK DATA
      tags: [recipe.cuisine_type, recipe.recipe_type].filter(Boolean),
      image: recipe.image || "/placeholder.svg",
    })
  );

  // --- Step 3: Filtering logic and UI helper functions ---
  const filteredRecipes = recipes.filter((recipe) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchLower) ||
      recipe.chef.toLowerCase().includes(searchLower);
    const matchesStatus =
      statusFilter === "all" || recipe.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // --- Step 4: Handle Edit and Delete ---
  const handleEdit = (recipeId: string) => {
    navigate(`/admin/edit-recipe/${recipeId}`);
  };

  const handleDelete = async (recipeId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/recipes/${recipeId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the recipe.");
      }

      const result = await response.json();

      if (result.success) {
        refresh(); // Refresh the recipes list after successful deletion
        toast.success("Recipe deleted successfully!");
      } else {
        throw new Error(result.message || "Deletion failed.");
      }
    } catch (err: any) {
      toast.error(
        err.message || "An error occurred while deleting the recipe."
      );
    }
  };

  const handleRecipeClick = (recipe: DisplayRecipe) => {
    setSelectedRecipe(recipe);
  };

  const handleGenerate = async (recipeId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/recipes/${recipeId}/generate-details`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate recipe details.");
      }

      const result = await response.json();

      if (result.success) {
        refresh(); // Refresh recipes to reflect updated data
        toast.success("Recipe details generated successfully!");
        // Update selectedRecipe if open
        if (selectedRecipe && selectedRecipe.id === recipeId) {
          setSelectedRecipe({
            ...selectedRecipe,
            openai_generated_content: result.data.openai_generated_content,
          });
        }
      } else {
        throw new Error(result.message || "Generation failed.");
      }
    } catch (err: any) {
      toast.error(
        err.message || "An error occurred while generating recipe details."
      );
    }
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  // --- Step 5: Render the component with loading/error states and dynamic data ---

  // Display a loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading recipes...
      </div>
    );
  }

  // Dynamic Stat Calculations
  const totalRecipes = recipes.length;
  const approvedCount = recipes.filter((r) => r.status === "approved").length;
  const pendingCount = recipes.filter((r) => r.status === "pending").length;
  const rejectedCount = recipes.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F25A38] to-[#CD1265] bg-clip-text text-transparent">
            Recipe Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all recipes in your marketplace
          </p>
        </div>
        <Button
          className="bg-[#CD1265] text-white hover:bg-[#CD1265]/90"
          onClick={() => navigate("/admin/create-recipe")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Recipe
        </Button>
      </div>

      {/* Stats Cards (Now Dynamic) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="qzene-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-[#F25A38]">
              {totalRecipes}
            </div>
            <p className="text-sm text-gray-500">Total Recipes</p>
          </CardContent>
        </Card>
        <Card className="qzene-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {approvedCount}
            </div>
            <p className="text-sm text-gray-500">Approved</p>
          </CardContent>
        </Card>
        <Card className="qzene-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
            <p className="text-sm text-gray-500">Pending Review</p>
          </CardContent>
        </Card>
        <Card className="qzene-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {rejectedCount}
            </div>
            <p className="text-sm text-gray-500">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="qzene-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search recipes or chefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25A38] bg-white"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button variant="outline" className="border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="qzene-card hover:shadow-lg transition-all duration-200 group flex flex-col cursor-pointer"
              onClick={() => handleRecipeClick(recipe)}
            >
              <CardHeader className="pb-3">
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(recipe.status)}
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-[#F25A38] transition-colors">
                    {recipe.name}
                  </CardTitle>
                  {/* <p className="text-sm text-gray-500 mt-1">by {recipe.chef}</p> */}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium">{recipe.type}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium">
                    {recipe.price === 0 ? (
                      <Badge className="bg-green-100 text-green-800">
                        Free
                      </Badge>
                    ) : (
                      `₹${recipe.price.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Rating:</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    <span className="font-medium">
                      {recipe.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Orders:</span>
                  <span className="font-medium">{recipe.orders}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <div className="hidden justify-between p-4 border-t space-x-2">
                <Button
                  size="sm"
                  className="qzene-btn-primary flex-1"
                  onClick={() => handleEdit(recipe.id)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                  onClick={() => handleDelete(recipe.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">
              No recipes found that match your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute top-4 left-4">
                {getStatusBadge(selectedRecipe.status)}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedRecipe.name}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{selectedRecipe.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">
                    {selectedRecipe.price === 0 ? (
                      <Badge className="bg-green-100 text-green-800">
                        Free
                      </Badge>
                    ) : (
                      `₹${selectedRecipe.price.toFixed(2)}`
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    <span className="font-medium">
                      {selectedRecipe.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Orders</p>
                  <p className="font-medium">{selectedRecipe.orders}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipe.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="bg-[#CD1265] text-white hover:bg-[#CD1265]/90 flex-1"
                  onClick={() => handleEdit(selectedRecipe.id)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Recipe
                </Button>
                <Button
                  variant="outline"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-1"
                  onClick={() => handleGenerate(selectedRecipe.id)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1"
                  onClick={() => handleDelete(selectedRecipe.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Recipe
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
