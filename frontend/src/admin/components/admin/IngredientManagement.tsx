import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { toast } from 'sonner';
import { API_URL } from "@/lib/constants";

export const IngredientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [categories, setCategories] = useState(["All Categories"]);
  const [ingredients, setIngredients] = useState([]);
  const [stats, setStats] = useState({ total: 0, ingredientsCount: 0, spicesCount: 0, oilsCount: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    type: "",
    image: null,
    prep_method: [],
    allergen: [],
    nutrient: { protein: 0, calories: 0, carbs: 0, fat: 0 },
    brand: "",
    description: "",
  });
  const [editIngredient, setEditIngredient] = useState(null);
  const [loading, setLoading] = useState(false);
  const category = "Food_Items";

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/admin/enums/${category}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to fetch categories');
          return;
        }
        const data = await response.json();
        const categoryValues = data.data.map((item: { value: string }) => item.value);
        setCategories(["All Categories", ...categoryValues]);
      } catch {
        toast.error('Something went wrong while fetching categories.');
      }
    };
    fetchCategories();
  }, []);

  // Fetch ingredients
  const fetchIngredients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/ingredients`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to fetch ingredients');
        return;
      }
      const data = await response.json();
      const fetchedIngredients = data.data.map(ingredient => ({
        ...ingredient,
        id: ingredient._id,
        usageCount: 0, // Placeholder
      }));

      // Calculate statistics
      const total = fetchedIngredients.length;
      const ingredientsCount = fetchedIngredients.filter(ing => ing.type === 'Ingredients').length;
      const spicesCount = fetchedIngredients.filter(ing => ing.type === 'Spices').length;
      const oilsCount = fetchedIngredients.filter(ing => ing.type === 'Oil').length;

      setIngredients(fetchedIngredients);
      setStats({ total, ingredientsCount, spicesCount, oilsCount });
    } catch {
      toast.error('Something went wrong while fetching ingredients.');
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || ingredient.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    const colors = {
      "Water": "bg-blue-100 text-blue-800",
      "Oil": "bg-yellow-100 text-yellow-800",
      "Spices": "bg-orange-100 text-orange-800",
      "Ingredients": "bg-green-100 text-green-800",
    };
    return <Badge className={colors[category] || "bg-gray-100 text-gray-800"}>{category}</Badge>;
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', newIngredient.name);
      formData.append('type', newIngredient.type);
      if (newIngredient.image) formData.append('image', newIngredient.image);
      formData.append('prep_method', JSON.stringify(newIngredient.prep_method));
      formData.append('allergen', JSON.stringify(newIngredient.allergen));
      formData.append('nutrient', JSON.stringify(newIngredient.nutrient));
      formData.append('brand', newIngredient.brand);
      formData.append('description', newIngredient.description);

      const response = await fetch(`${API_URL}/api/v1/admin/ingredients`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add ingredient');
        return;
      }

      toast.success('Ingredient added successfully!');
      setShowAddForm(false);
      setNewIngredient({
        name: "",
        type: "",
        image: null,
        prep_method: [],
        allergen: [],
        nutrient: { protein: 0, calories: 0, carbs: 0, fat: 0 },
        brand: "",
        description: "",
      });
      fetchIngredients();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', editIngredient.name);
      formData.append('type', editIngredient.type);
      if (editIngredient.image && typeof editIngredient.image !== 'string') {
        formData.append('image', editIngredient.image);
      }
      formData.append('prep_method', JSON.stringify(editIngredient.prep_method));
      formData.append('allergen', JSON.stringify(editIngredient.allergen));
      formData.append('nutrient', JSON.stringify(editIngredient.nutrient));
      formData.append('brand', editIngredient.brand);
      formData.append('description', editIngredient.description);

      const response = await fetch(`${API_URL}/api/v1/admin/ingredients/${editIngredient.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update ingredient');
        return;
      }

      toast.success('Ingredient updated successfully!');
      setShowEditForm(false);
      setEditIngredient(null);
      fetchIngredients();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/admin/ingredients/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete ingredient');
        return;
      }

      toast.success('Ingredient deleted successfully!');
      fetchIngredients();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F25A38] to-[#CD1265] bg-clip-text text-transparent">
          Ingredient Management
        </h1>
        <Button className="bg-[#CD1265] text-white hover:bg-[#CD1265]/90" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="qzene-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-[#F25A38] mr-3" />
              <div>
                <div className="text-2xl font-bold text-[#F25A38]">{stats.total}</div>
                <p className="text-sm text-gray-500">Total Ingredients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="qzene-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">I</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.ingredientsCount}</div>
                <p className="text-sm text-gray-500">Ingredients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="qzene-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-orange-600 font-bold">S</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.spicesCount}</div>
                <p className="text-sm text-gray-500">Spices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="qzene-card">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-bold">O</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.oilsCount}</div>
                <p className="text-sm text-gray-500">Oils</p>
              </div>
            </div>
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
                placeholder="Search ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25A38] bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Add Ingredient Form */}
      {showAddForm && (
        <Card className="qzene-card border-2 border-[#F25A38]">
          <CardHeader>
            <CardTitle className="text-[#F25A38]">Add New Ingredient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddIngredient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    placeholder="Enter ingredient name"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newIngredient.type}
                    onChange={(e) => setNewIngredient({ ...newIngredient, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25A38]"
                    required
                  >
                    <option value="">Select Type</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setNewIngredient({ ...newIngredient, image: e.target.files?.[0] || null })}
                    className="border-gray-300"
                  />
                  {newIngredient.image && (
                    <p className="text-xs text-gray-500 mt-1">{newIngredient.image.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Methods (comma-separated)</label>
                  <Input
                    placeholder="e.g., chop, grate"
                    value={newIngredient.prep_method.join(',')}
                    onChange={(e) => setNewIngredient({
                      ...newIngredient,
                      prep_method: e.target.value.split(',').map(item => item.trim()).filter(Boolean),
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergens (comma-separated)</label>
                  <Input
                    placeholder="e.g., nuts, dairy"
                    value={newIngredient.allergen.join(',')}
                    onChange={(e) => setNewIngredient({
                      ...newIngredient,
                      allergen: e.target.value.split(',').map(item => item.trim()).filter(Boolean),
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <Input
                    placeholder="Enter brand name"
                    value={newIngredient.brand}
                    onChange={(e) => setNewIngredient({ ...newIngredient, brand: e.target.value })}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Input
                    placeholder="Enter description"
                    value={newIngredient.description}
                    onChange={(e) => setNewIngredient({ ...newIngredient, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient: Protein (g)</label>
                  <Input
                    type="number"
                    placeholder="Protein"
                    value={newIngredient.nutrient.protein}
                    onChange={(e) => setNewIngredient({
                      ...newIngredient,
                      nutrient: { ...newIngredient.nutrient, protein: Number(e.target.value) || 0 },
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient: Calories (kcal)</label>
                  <Input
                    type="number"
                    placeholder="Calories"
                    value={newIngredient.nutrient.calories}
                    onChange={(e) => setNewIngredient({
                      ...newIngredient,
                      nutrient: { ...newIngredient.nutrient, calories: Number(e.target.value) || 0 },
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient: Carbs (g)</label>
                  <Input
                    type="number"
                    placeholder="Carbs"
                    value={newIngredient.nutrient.carbs}
                    onChange={(e) => setNewIngredient({
                      ...newIngredient,
                      nutrient: { ...newIngredient.nutrient, carbs: Number(e.target.value) || 0 },
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient: Fat (g)</label>
                  <Input
                    type="number"
                    placeholder="Fat"
                    value={newIngredient.nutrient.fat}
                    onChange={(e) => setNewIngredient({
                      ...newIngredient,
                      nutrient: { ...newIngredient.nutrient, fat: Number(e.target.value) || 0 },
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#CD1265] text-white hover:bg-[#CD1265]/90" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Ingredient'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Ingredient Form */}
      {showEditForm && editIngredient && (
        <Card className="qzene-card border-2 border-[#F25A38]">
          <CardHeader>
            <CardTitle className="text-[#F25A38]">Edit Ingredient</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditIngredient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    placeholder="Enter ingredient name"
                    value={editIngredient.name}
                    onChange={(e) => setEditIngredient({ ...editIngredient, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editIngredient.type}
                    onChange={(e) => setEditIngredient({ ...editIngredient, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F25A38]"
                    required
                  >
                    <option value="">Select Type</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setEditIngredient({ ...editIngredient, image: e.target.files?.[0] || null })}
                    className="border-gray-300"
                  />
                  {editIngredient.image && typeof editIngredient.image === 'string' && (
                    <img src={editIngredient.image} alt="Current" className="w-16 h-16 object-cover rounded-lg mt-2" />
                  )}
                  {editIngredient.image && typeof editIngredient.image !== 'string' && (
                    <p className="text-xs text-gray-500 mt-1">{editIngredient.image.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Methods (comma-separated)</label>
                  <Input
                    placeholder="e.g., chop, grate"
                    value={editIngredient.prep_method.join(',')}
                    onChange={(e) => setEditIngredient({
                      ...editIngredient,
                      prep_method: e.target.value.split(',').map(item => item.trim()).filter(Boolean),
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergens (comma-separated)</label>
                  <Input
                    placeholder="e.g., nuts, dairy"
                    value={editIngredient.allergen.join(',')}
                    onChange={(e) => setEditIngredient({
                      ...editIngredient,
                      allergen: e.target.value.split(',').map(item => item.trim()).filter(Boolean),
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <Input
                    placeholder="Enter brand name"
                    value={editIngredient.brand}
                    onChange={(e) => setEditIngredient({ ...editIngredient, brand: e.target.value })}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Input
                    placeholder="Enter description"
                    value={editIngredient.description}
                    onChange={(e) => setEditIngredient({ ...editIngredient, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient: Protein (g)</label>
                  <Input
                    type="number"
                    placeholder="Protein"
                    value={editIngredient.nutrient.protein}
                    onChange={(e) => setEditIngredient({
                      ...editIngredient,
                      nutrient: { ...editIngredient.nutrient, protein: Number(e.target.value) || 0 },
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient: Calories (kcal)</label>
                  <Input
                    type="number"
                    placeholder="Calories"
                    value={editIngredient.nutrient.calories}
                    onChange={(e) => setEditIngredient({
                      ...editIngredient,
                      nutrient: { ...editIngredient.nutrient, calories: Number(e.target.value) || 0 },
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient: Carbs (g)</label>
                  <Input
                    type="number"
                    placeholder="Carbs"
                    value={editIngredient.nutrient.carbs}
                    onChange={(e) => setEditIngredient({
                      ...editIngredient,
                      nutrient: { ...editIngredient.nutrient, carbs: Number(e.target.value) || 0 },
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nutrient: Fat (g)</label>
                  <Input
                    type="number"
                    placeholder="Fat"
                    value={editIngredient.nutrient.fat}
                    onChange={(e) => setEditIngredient({
                      ...editIngredient,
                      nutrient: { ...editIngredient.nutrient, fat: Number(e.target.value) || 0 },
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowEditForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#CD1265] text-white hover:bg-[#CD1265]/90" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Ingredient'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIngredients.map((ingredient) => (
          <Card key={ingredient.id} className="qzene-card hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                  {ingredient.image && (
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      className="w-16 h-16 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {getCategoryBadge(ingredient.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Used in recipes:</span>
                  <span className="font-medium">{ingredient.usageCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Created by:</span>
                  <span className="font-medium">{ingredient.createdBy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Brand:</span>
                  <span className="font-medium">{ingredient.brand || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Allergens:</span>
                  <span className="font-medium">{ingredient.allergen.length ? ingredient.allergen.join(', ') : 'None'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Prep Methods:</span>
                  <span className="font-medium">{ingredient.prep_method.length ? ingredient.prep_method.join(', ') : 'None'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Description:</span>
                  <span className="font-medium">{ingredient.description || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Nutrients:</span>
                  <span className="font-medium">
                    {ingredient.nutrient ? `${ingredient.nutrient.protein}g Protein, ${ingredient.nutrient.calories}kcal, ${ingredient.nutrient.carbs}g Carbs, ${ingredient.nutrient.fat}g Fat` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t space-x-2">
                  <Button
                    size="sm"
                    className="bg-[#CD1265] text-white hover:bg-[#CD1265]/90 flex-1"
                    onClick={() => {
                      setEditIngredient({ ...ingredient, image: ingredient.image });
                      setShowEditForm(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteIngredient(ingredient.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
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