
import { Container, Ingredient } from "@/types/recipeMaker";
import IngredientsPanel from "./IngredientsPanel";
import MainContainersPanel from "./MainContainersPanel";
import LiquidsContainersPanel from "./LiquidsContainersPanel";
import WaterAndOilsPanel from "./WaterAndOilsPanel";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";
import IngredientDetailsDialog from "./IngredientDetailsDialog";
import { useState } from "react";
import SeasoningsPanel from "./SeasoningsPanel";
import SeasoningContainersPanel from "./SeasoningContainersPanel";

interface RecipeGridProps {
  ingredients: Ingredient[];
  containers: Container[];
  seasonings: Ingredient[];
  waterAndOils: Ingredient[];
  dragging: Ingredient | null;
  onDragStart: (e: React.DragEvent, ingredient: Ingredient, source: "ingredient-list" | "container" | "seasoning-list" | "water-oil-list", containerId?: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, containerId: number) => void;
  onRemoveIngredient: (containerId: number, ingredientId: string) => void;
  updateIngredientQuantity?: (containerId: number, ingredientId: string, quantity: number, units?: string, prepType?: string) => void;
  onStartCooking: () => void;
}

const RecipeGrid = ({ 
  ingredients, 
  containers, 
  seasonings,
  waterAndOils,
  dragging, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onRemoveIngredient,
  updateIngredientQuantity,
  onStartCooking 
}: RecipeGridProps) => {
  // Split containers based on their index
  const mainContainers = containers.slice(0, 6);
  const seasoningContainers = containers.slice(6, 14);
  const liquidContainers = containers.slice(14, 16);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(null);

  const handleContainerItemClick = (ingredient: Ingredient, containerId: number) => {
    setSelectedIngredient(ingredient);
    setSelectedContainerId(containerId);
    setDialogOpen(true);
  };

  const handleDropWithDialog = (e: React.DragEvent, containerId: number) => {
    e.preventDefault();
    
    // Check if this is a new drop from an ingredient panel (not from another container)
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && data.ingredient && data.source && data.source !== 'container') {
        // This is a new ingredient being dropped, open the dialog
        setSelectedIngredient(data.ingredient);
        setSelectedContainerId(containerId);
        
        // Execute the drop operation first to add the ingredient to the container
        onDrop(e, containerId);
        
        // Then open the dialog to edit quantity, units, etc.
        setDialogOpen(true);
        return;
      }
    } catch (err) {
      console.error('Error parsing drag data:', err);
    }
    
    // Default drop behavior for container-to-container moves
    onDrop(e, containerId);
  };

  const handleDialogAdd = (ingredient: Ingredient, quantity: number, units: string, prepType?: string) => {
    if (selectedContainerId !== null && updateIngredientQuantity) {
      updateIngredientQuantity(
        selectedContainerId, 
        ingredient.id, 
        quantity, 
        units, 
        prepType
      );
    }
    
    // Close the dialog
    setDialogOpen(false);
    setSelectedIngredient(null);
    setSelectedContainerId(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left sidebar with ingredient panels */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-4">
          {/* Ingredients panel - 30% of viewport height */}
          <div className="h-[30vh]">
            <IngredientsPanel ingredients={ingredients} onDragStart={onDragStart} />
          </div>
          
          {/* Seasonings panel - 30% of viewport height */}
          <div className="h-[30vh]">
            <SeasoningsPanel seasonings={seasonings} onDragStart={onDragStart} />
          </div>
          
          {/* Water & Oils panel - 20% of viewport height */}
          <div className="h-[20vh]">
            <WaterAndOilsPanel waterAndOils={waterAndOils} onDragStart={onDragStart} />
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-8 flex flex-col space-y-6">
          {/* Main Ingredients Containers (2x3 grid) */}
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Main Ingredients</h3>
            <MainContainersPanel 
              containers={mainContainers}
              dragging={dragging}
              onDragOver={onDragOver}
              onDrop={handleDropWithDialog}
              onDragStart={onDragStart}
              onRemoveIngredient={onRemoveIngredient}
              onItemClick={handleContainerItemClick}
            />
          </div>
          
          {/* Seasonings Containers (2x4 grid) */}
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Seasonings</h3>
            <SeasoningContainersPanel 
              containers={seasoningContainers}
              dragging={dragging}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragStart={onDragStart}
              onRemoveIngredient={onRemoveIngredient}
              onItemClick={handleContainerItemClick}
              updateIngredientQuantity={updateIngredientQuantity}
            />
          </div>
          
          {/* Liquids Containers (1x2 grid) */}
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Oils & Water</h3>
            <LiquidsContainersPanel 
              containers={liquidContainers}
              dragging={dragging}
              onDragOver={onDragOver}
              onDrop={handleDropWithDialog}
              onDragStart={onDragStart}
              onRemoveIngredient={onRemoveIngredient}
              onItemClick={handleContainerItemClick}
            />
          </div>
          
          {/* Create Recipe Button */}
          <div className="flex justify-center pt-4">
            {/* <Button 
              className="bg-[#986CF5] hover:bg-[#986CF5]/90 flex items-center gap-2"
              onClick={onStartCooking}
            >
              <Utensils className="w-4 h-4" /> 
              Create Recipe Instructions
            </Button> */}
          </div>
        </div>
      </div>

      {/* Ingredient Details Dialog for editing */}
      <IngredientDetailsDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedIngredient(null);
        }}
        ingredient={selectedIngredient}
        onAdd={handleDialogAdd}
      />
    </div>
  );
};

export default RecipeGrid;
