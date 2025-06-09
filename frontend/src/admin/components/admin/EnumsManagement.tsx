
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Settings } from "lucide-react";

const mockEnums = {
  units: ["grams", "tablespoons", "milliliters", "cups", "pounds", "ounces", "liters"],
  foodTypes: ["Appetizer", "Main Course", "Dessert", "Beverage", "Snack", "Soup", "Salad"],
  ingredientCategories: ["Vegetables", "Spices", "Dairy", "Meat", "Seafood", "Grains", "Fruits"],
  dietaryTags: ["Vegan", "Vegetarian", "Gluten-Free", "Keto", "Paleo", "Low-Carb", "Dairy-Free"]
};

export const EnumsManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("units");
  const [newValue, setNewValue] = useState("");

  const handleAddValue = () => {
    if (newValue.trim()) {
      console.log(`Adding "${newValue}" to ${selectedCategory}`);
      setNewValue("");
    }
  };

  const handleDeleteValue = (value: string) => {
    console.log(`Deleting "${value}" from ${selectedCategory}`);
  };

  const categories = [
    { id: "units", label: "Measurement Units", icon: "⚖️" },
    { id: "foodTypes", label: "Food Types", icon: "🍽️" },
    { id: "ingredientCategories", label: "Ingredient Categories", icon: "🥬" },
    { id: "dietaryTags", label: "Dietary Tags", icon: "🏷️" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Enums Management</h1>
        <div className="text-sm text-gray-500">
          Manage dropdown values and categories
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{category.label}</div>
                      <div className="text-xs text-gray-500">
                        {mockEnums[category.id as keyof typeof mockEnums].length} items
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Values Management */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {categories.find(c => c.id === selectedCategory)?.label} Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add New Value */}
              <div className="flex gap-3 mb-6">
                <Input
                  placeholder={`Add new ${selectedCategory.slice(0, -1)}...`}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleAddValue()}
                />
                <Button onClick={handleAddValue} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Values List */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 mb-3">
                  Current Values ({mockEnums[selectedCategory as keyof typeof mockEnums].length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mockEnums[selectedCategory as keyof typeof mockEnums].map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{value}</span>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteValue(value)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Statistics */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-3">Usage Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Recipes Using</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-gray-600">Coverage</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <div className="text-sm text-gray-600">Most Popular</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Unused</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
