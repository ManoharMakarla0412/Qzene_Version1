
import React from "react";
import { Card } from "@/components/ui/card";
import { Ingredient } from "@/types/recipeMaker";
import { ArrowUpDown } from "lucide-react";

interface IngredientsSidebarProps {
  ingredientsByStep: { step: number; ingredients: Ingredient[] }[];
  allSeasonings: Ingredient[];
  waterAndOils: Ingredient[];
  currentStep: number;
  onDragIngredientStart: (e: React.DragEvent, ingredient: Ingredient) => void;
  onEditIngredient?: (ingredient: Ingredient) => void; // New prop for editing
}

const IngredientsSidebar = ({
  ingredientsByStep,
  allSeasonings,
  waterAndOils,
  currentStep,
  onDragIngredientStart,
  onEditIngredient
}: IngredientsSidebarProps) => {
  // Find ingredients for current step
  const currentStepIngredients = ingredientsByStep.find(
    (stepData) => stepData.step === currentStep
  )?.ingredients || [];

  const handleIngredientClick = (ingredient: Ingredient) => {
    if (onEditIngredient) {
      onEditIngredient(ingredient);
    }
  };

  return (
    <div className="md:col-span-3 border-r bg-gray-50 p-4">
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-medium text-sm mb-4">Ingredients for Step {currentStep}</h3>
          <div className=" max-h-[200px] pr-2">
            {currentStepIngredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center p-2 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-move hover:bg-gray-50"
                draggable
                onDragStart={(e) => onDragIngredientStart(e, ingredient)}
                onClick={() => handleIngredientClick(ingredient)}
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  {ingredient.image_url ? (
                    <img
                      src={ingredient.image_url}
                      alt={ingredient.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">{ingredient.name.substring(0, 2)}</span>
                    </div>
                  )}
                  <span className="text-sm">{ingredient.name}</span>
                  {ingredient.quantity && (
                    <span className="ml-auto text-xs text-gray-500">
                      {ingredient.quantity} {ingredient.units || ""}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-sm mb-4">Seasonings</h3>
          <div className=" max-h-[150px] pr-2">
            {allSeasonings.map((seasoning) => (
              <div
                key={seasoning.id}
                className="flex items-center p-2 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-move hover:bg-gray-50"
                draggable
                onDragStart={(e) => onDragIngredientStart(e, seasoning)}
                onClick={() => handleIngredientClick(seasoning)}
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  {seasoning.image_url ? (
                    <img
                      src={seasoning.image_url}
                      alt={seasoning.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">{seasoning.name.substring(0, 2)}</span>
                    </div>
                  )}
                  <span className="text-sm">{seasoning.name}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-sm mb-4">Water & Oils</h3>
          <div className=" max-h-[100px] pr-2">
            {waterAndOils.map((liquid) => (
              <div
                key={liquid.id}
                className="flex items-center p-2 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-move hover:bg-gray-50"
                draggable
                onDragStart={(e) => onDragIngredientStart(e, liquid)}
                onClick={() => handleIngredientClick(liquid)}
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  {liquid.image_url ? (
                    <img
                      src={liquid.image_url}
                      alt={liquid.name}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs">{liquid.name.substring(0, 2)}</span>
                    </div>
                  )}
                  <span className="text-sm">{liquid.name}</span>
                  {liquid.quantity && (
                    <span className="ml-auto text-xs text-gray-500">
                      {liquid.quantity} {liquid.units || "ml"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IngredientsSidebar;
