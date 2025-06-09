import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Settings, Loader2 } from "lucide-react";
import { format, isValid } from "date-fns";
import { API_URL } from "@/lib/constants";

// --- Type Definitions ---
interface EnumItem {
  _id: string;
  category: string;
  value: string;
  createdAt?: string;
}

// --- API Helper Functions ---
const api = {
  getCategories: async (): Promise<string[]> => {
    const response = await fetch(`${API_URL}/api/v1/admin/enums/categories/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return data.data;
  },
  getEnumsByCategory: async (category: string): Promise<EnumItem[]> => {
    const response = await fetch(`${API_URL}/api/v1/admin/enums/${category}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: 'include'
    });
    if (!response.ok) throw new Error(`Failed to fetch enums for ${category}`);
    const data = await response.json();
    return data.data;
  },
  createEnum: async (category: string, value: string): Promise<any> => {
    const response = await fetch(`${API_URL}/api/v1/admin/enums`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ category, value }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create enum");
    }
    return response.json();
  },
};

// --- Helper Function ---
const capitalizeFirstLetter = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const EnumsManagement = () => {
  // --- State Management ---
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [enums, setEnums] = useState<EnumItem[]>([]);
  const [loading, setLoading] = useState({ categories: true, enums: false });

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data Fetching ---
  const fetchCategories = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, categories: true }));
      const fetchedCategories = await api.getCategories();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(fetchedCategories[0]);
      }
    } catch (error) {
      toast.error("Error fetching categories. Please try again.");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  }, [selectedCategory]);

  const fetchEnums = useCallback(async () => {
    if (!selectedCategory) return;
    try {
      setLoading((prev) => ({ ...prev, enums: true }));
      const fetchedEnums = await api.getEnumsByCategory(selectedCategory);
      setEnums(fetchedEnums);
    } catch (error) {
      toast.error(`Error fetching enums for ${selectedCategory}.`);
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, enums: false }));
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchEnums();
  }, [selectedCategory, fetchEnums]);

  // --- Event Handlers ---
  const handleOpenCreateModal = () => {
    setNewCategory("");
    setNewValue("");
    setIsSubmitting(false);
    setIsCreateModalOpen(true);
  };
  
  const handleOpenAddModal = () => {
    setNewValue("");
    setIsSubmitting(false);
    setIsAddModalOpen(true);
  };

  const handleModalSubmit = async (mode: "create" | "add") => {
    const category = mode === 'add' ? selectedCategory! : newCategory;
    
    if (!category.trim() || !newValue.trim()) {
      toast.warning("Both category and value fields are required.");
      return;
    }
    
    setIsSubmitting(true);

    const finalCategory = capitalizeFirstLetter(category.trim());
    const finalValue = capitalizeFirstLetter(newValue.trim());
    
    try {
      await api.createEnum(finalCategory, finalValue);
      toast.success(`Enum "${finalValue}" created in category "${finalCategory}"`);
      
      // Close the correct modal
      if(mode === 'create') setIsCreateModalOpen(false);
      if(mode === 'add') setIsAddModalOpen(false);

      // Refetch categories if a new one was created
      if (!categories.includes(finalCategory)) {
        await fetchCategories();
      }
      
      // If the created enum belongs to the currently selected category, refresh the list
      if (finalCategory === selectedCategory) {
        fetchEnums();
      }
      
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Enums Management</h1>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Create Enum
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selection Sidebar */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading.categories ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-emerald-100 text-emerald-800 font-semibold border-l-4 border-emerald-500"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Values Management Display */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedCategory ? `${selectedCategory.replace(/_/g, " ")} Values` : "Select a Category"}
                  </CardTitle>
                  {selectedCategory && (
                    <CardDescription>
                       Manage values for the {selectedCategory.replace(/_/g, " ")} category.
                    </CardDescription>
                   )}
                </div>
                {selectedCategory && (
                  <Button variant="outline" onClick={handleOpenAddModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Value
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading.enums ? (
                 <div className="flex justify-center items-center p-10">
                   <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                 </div>
              ) : !selectedCategory ? (
                 <div className="text-center py-10 text-gray-500">
                    <p>Select a category from the left to view its enums.</p>
                 </div>
              ) : enums.length === 0 ? (
                 <div className="text-center py-10 text-gray-500">
                    <p>No enum values found for this category.</p>
                    <Button variant="link" className="mt-2" onClick={handleOpenAddModal}>
                      Add the first one
                    </Button>
                 </div>
              ) : (
                <div className="flow-root">
                  <ul className="-my-3 divide-y divide-gray-200">
                    {enums.map((item) => {
                      const date = item.createdAt ? new Date(item.createdAt) : null;
                      return (
                        <li key={item._id} className="flex items-center justify-between py-3">
                          <span className="font-medium text-gray-800">{item.value}</span>
                          {date && isValid(date) && (
                            <span className="text-xs text-gray-500">
                              Added on {format(date, 'PP')}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- MODAL FOR CREATING A NEW ENUM FROM SCRATCH --- */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New Enum</DialogTitle>
             <DialogDescription>
                Add a new value to any category, or create a new category on the fly.
              </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="category-create">Category</Label>
              <Input
                id="category-create"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Cuisine, Device"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value-create">Value</Label>
              <Input
                id="value-create"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., Italian, Simmr"
                onKeyPress={(e) => e.key === 'Enter' && handleModalSubmit('create')}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleModalSubmit('create')} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Enum
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* --- MODAL FOR ADDING A VALUE TO THE CURRENTLY SELECTED CATEGORY --- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Value to "{selectedCategory?.replace(/_/g, " ")}"</DialogTitle>
             <DialogDescription>
                This will add a new enum value to the currently selected category.
              </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
              <div className="space-y-2">
                <Label htmlFor="category-add">Category</Label>
                <Input id="category-add" value={selectedCategory?.replace(/_/g, " ") ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value-add">New Value</Label>
                <Input
                  id="value-add"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={`e.g., new value for ${selectedCategory?.replace(/_/g, " ")}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleModalSubmit('add')}
                />
              </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={() => handleModalSubmit('add')} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Value
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};