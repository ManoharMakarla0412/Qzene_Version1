
import { useState } from "react";
import { useRecipe } from "@/contexts/RecipeContext";
import { CuisineType, DeviceSupport } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import CuisineFilter from "@/components/CuisineFilter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

const AllRecipes = () => {
  const { recipes, loading } = useRecipe(); // Use context hook
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceSupport | null>(null);
  const [cookingTimeRange, setCookingTimeRange] = useState([0, 120]);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const cuisineOptions = Array.from(new Set(recipes.map(r => r.cuisine))).sort();
  const difficultyOptions = Array.from(new Set(recipes.map(r => r.difficulty))).sort();

  
  // Filter recipes based on all filters
  const filteredRecipes = recipes.filter(recipe => {
  const query = searchQuery.toLowerCase();

  // 🔍 Search Filter (name, cuisine, ingredients)
  const matchesSearch =
    recipe.name.toLowerCase().includes(query) ||
    recipe.cuisine.toLowerCase().includes(query) ||
    recipe.ingredients.some(ingredient =>
      ingredient.toLowerCase().includes(query)
    );

  if (searchQuery && !matchesSearch) {
    return false;
  }

  // 🌍 Cuisine Filter
  if (selectedCuisine && recipe.cuisine !== selectedCuisine) {
    return false;
  }

  // 📱 Device Filter
  if (selectedDevice) {
    if (
      (selectedDevice === 'Both' && recipe.deviceSupport !== 'Both') ||
      (selectedDevice === 'MoMe' &&
        recipe.deviceSupport !== 'MoMe' &&
        recipe.deviceSupport !== 'Both') ||
      (selectedDevice === 'Simmr' &&
        recipe.deviceSupport !== 'Simmr' &&
        recipe.deviceSupport !== 'Both')
    ) {
      return false;
    }
  }

  // ⏲️ Cooking Time Filter
  if (
    recipe.cookingTime < cookingTimeRange[0] ||
    recipe.cookingTime > cookingTimeRange[1]
  ) {
    return false;
  }

  // 🧩 Difficulty Filter
  if (difficulty && recipe.difficulty !== difficulty) {
    return false;
  }

  return true;
});

const handleSearch = (query: string) => {
  setSearchQuery(query);
};

const handleResetFilters = () => {
  setSelectedCuisine(null);
  setSelectedDevice(null);
  setCookingTimeRange([0, 120]);
  setDifficulty(null);
  setSearchQuery("");
};


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={handleSearch} />
      
      <div className="container py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6">All Recipes</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg border sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className="text-qzene-purple hover:text-qzene-purple/90"
                >
                  Reset All
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Cuisine</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCuisine === null ? "default" : "outline"}
                      size="sm"
                      className={selectedCuisine === null ? "bg-qzene-purple" : ""}
                      onClick={() => setSelectedCuisine(null)}
                    >
                      All
                    </Button>
                    {cuisineOptions.map(cuisine => (
                      <Button
                        key={cuisine}
                        variant={selectedCuisine === cuisine ? "default" : "outline"}
                        size="sm"
                        className={selectedCuisine === cuisine ? "bg-qzene-purple" : ""}
                        onClick={() => setSelectedCuisine(cuisine)}
                      >
                        {cuisine}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Device Compatibility */}
                <div>
                  <h3 className="font-medium mb-2">Device Compatibility</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedDevice === null ? "default" : "outline"}
                      size="sm"
                      className={selectedDevice === null ? "bg-qzene-purple" : ""}
                      onClick={() => setSelectedDevice(null)}
                    >
                      All
                    </Button>
                    
                    <Button
                      variant={selectedDevice === 'MoMe' ? "default" : "outline"}
                      size="sm"
                      className={selectedDevice === 'MoMe' ? "bg-green-600" : ""}
                      onClick={() => setSelectedDevice('MoMe')}
                    >
                      MoMe
                    </Button>
                    
                    <Button
                      variant={selectedDevice === 'Simmr' ? "default" : "outline"}
                      size="sm"
                      className={selectedDevice === 'Simmr' ? "bg-amber-600" : ""}
                      onClick={() => setSelectedDevice('Simmr')}
                    >
                      Simmr
                    </Button>
                    
                    <Button
                      variant={selectedDevice === 'Both' ? "default" : "outline"}
                      size="sm"
                      className={selectedDevice === 'Both' ? "bg-qzene-purple" : ""}
                      onClick={() => setSelectedDevice('Both')}
                    >
                      Both
                    </Button>
                  </div>
                </div>
                
                {/* Cooking Time */}
                <div>
                  <h3 className="font-medium mb-2">Cooking Time</h3>
                  <div className="px-2">
                    <Slider
                      value={cookingTimeRange}
                      min={0}
                      max={120}
                      step={5}
                      onValueChange={setCookingTimeRange}
                      className="my-4"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{cookingTimeRange[0]} min</span>
                      <span>{cookingTimeRange[1]} min</span>
                    </div>
                  </div>
                </div>
                
                 {/* Difficulty */}
                <div>
                  <h3 className="font-medium mb-2">Difficulty</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={difficulty === null ? "default" : "outline"}
                      size="sm"
                      className={difficulty === null ? "bg-qzene-purple" : ""}
                      onClick={() => setDifficulty(null)}
                    >
                      All
                    </Button>
                    {difficultyOptions.map(level => (
                      <Button
                        key={level}
                        variant={difficulty === level ? "default" : "outline"}
                        size="sm"
                        className={difficulty === level ? "bg-qzene-purple" : ""}
                        onClick={() => setDifficulty(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-gray-500">Active filters:</span>
              
              {selectedCuisine && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedCuisine}
                  <button className="ml-1" onClick={() => setSelectedCuisine(null)}>×</button>
                </Badge>
              )}
              
              {selectedDevice && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {selectedDevice}
                  <button className="ml-1" onClick={() => setSelectedDevice(null)}>×</button>
                </Badge>
              )}
              
              {difficulty && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {difficulty}
                  <button className="ml-1" onClick={() => setDifficulty(null)}>×</button>
                </Badge>
              )}
              
              {(cookingTimeRange[0] > 0 || cookingTimeRange[1] < 120) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {cookingTimeRange[0]}-{cookingTimeRange[1]} min
                  <button className="ml-1" onClick={() => setCookingTimeRange([0, 120])}>×</button>
                </Badge>
              )}
              
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <button className="ml-1" onClick={() => setSearchQuery("")}>×</button>
                </Badge>
              )}
              
              {(selectedCuisine || selectedDevice || difficulty || searchQuery || cookingTimeRange[0] > 0 || cookingTimeRange[1] < 120) && (
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-gray-500">
                Showing {filteredRecipes.length} of {recipes.length} recipes
              </p>
            </div>
            
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold mb-2">No recipes found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={handleResetFilters} className="bg-qzene-purple hover:bg-qzene-purple/90">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default AllRecipes;
