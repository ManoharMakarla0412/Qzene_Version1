import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container, RecipeStep, InstructionStep } from "@/types/recipeMaker";
import { Button } from "@/components/ui/button";
import StepNavigation from "./StepNavigation";
import InstructionsSidebar from "./InstructionsSidebar";
import AddItemDialog from "./AddItemDialog";
import IngredientsSidebar from "./IngredientsSidebar";
import InstructionsArea from "./InstructionsArea";
import { useInstructions } from "@/admin/hooks/useInstructions";

interface CookingInstructionsV2Props {
  recipeName: string;
  containers: Container[];
  recipeSteps: RecipeStep[];
  onBack: () => void;
  onSaveRecipe?: () => void;
  onAddStep?: () => void;
  onUpdateStep?: (id: number, updates: Partial<RecipeStep>) => void;
}

const CookingInstructionsV2 = ({ 
  recipeName, 
  containers, 
  recipeSteps, 
  onBack,
  onSaveRecipe,
  onAddStep,
  onUpdateStep
}: CookingInstructionsV2Props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = recipeSteps.length;
  const [allInstructions, setAllInstructions] = useState<Record<number, InstructionStep[]>>({});
  
  const {
    draggingInstruction,
    draggingIngredient,
    dialogOpen,
    setDialogOpen,
    itemToAdd,
    itemType,
    quantity,
    setQuantity,
    units,
    setUnits,
    handleDragInstructionStart,
    handleDragIngredientStart,
    handleDragOver,
    handleDropOnInstructions,
    handleAddItemFromDialog,
    handleRemoveInstruction,
    getAllInstructions
  } = useInstructions({
    recipeSteps,
    currentStep,
    onUpdateStep
  });

  const navigateNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else if (onAddStep) {
      onAddStep();
      setCurrentStep(totalSteps + 1);
    }
  }, [currentStep, totalSteps, onAddStep]);
  
  const navigatePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleInstructionsProcessed = useCallback((stepInstructions: InstructionStep[]) => {
    setAllInstructions(prev => ({
      ...prev,
      [currentStep]: stepInstructions
    }));
    
    if (onUpdateStep && recipeSteps[currentStep - 1]) {
      const stepId = recipeSteps[currentStep - 1].id;
      onUpdateStep(stepId, {
        additionalData: {
          instructions: {
            Instructions: stepInstructions
          }
        }
      });
    }
  }, [currentStep, onUpdateStep, recipeSteps]);

  const handleSaveRecipe = useCallback(() => {
    if (onSaveRecipe) {
      onSaveRecipe();
    }
  }, [onSaveRecipe]);

  const allIngredients = useMemo(() => {
    const ingredientMap = new Map();
    
    containers.forEach(container => {
      container.ingredients.forEach(ingredient => {
        if (ingredient && ingredient.id && !ingredientMap.has(ingredient.id)) {
          ingredientMap.set(ingredient.id, ingredient);
        }
      });
    });
    
    return Array.from(ingredientMap.values());
  }, [containers]);
  
  const ingredientsByStep = useMemo(() => {
    const result = [];
    const chunkSize = Math.ceil(allIngredients.length / totalSteps);
    
    for (let i = 0; i < totalSteps; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, allIngredients.length);
      result.push({
        step: i + 1,
        ingredients: allIngredients.slice(start, end)
      });
    }
    
    return result;
  }, [allIngredients, totalSteps]);
  
  const allSeasonings = useMemo(() => {
    const seasonings = containers.flatMap(container => 
      container.ingredients.filter(ingredient => ingredient.type === 'seasoning')
    );
    
    const seasoningCount = new Map();
    seasonings.forEach(seasoning => {
      const count = seasoningCount.get(seasoning.id) || 0;
      seasoningCount.set(seasoning.id, count + 1);
    });
    
    return Array.from(
      new Map(seasonings.map(seasoning => [seasoning.id, { ...seasoning, count: seasoningCount.get(seasoning.id) }])).values()
    );
  }, [containers]);
  
  const waterAndOils = useMemo(() => {
    return containers.flatMap(container => 
      container.ingredients.filter(ingredient => 
        ingredient.type === 'water' || ingredient.type === 'oil'
      )
    );
  }, [containers]);
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <StepNavigation 
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevStep={navigatePrev}
        onNextStep={navigateNext}
        recipeName={recipeName}
        onBack={onBack}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        <InstructionsSidebar 
        recipeSteps={recipeSteps}
        currentStep={currentStep}
        onUpdateStep={onUpdateStep}
        onDragStart={handleDragInstructionStart}
      />
        
        <InstructionsArea
          recipeName={recipeName}
          recipeSteps={recipeSteps}
          currentStep={currentStep}
          totalSteps={totalSteps}
          draggingInstruction={draggingInstruction}
          draggingIngredient={draggingIngredient}
          onDragOver={handleDragOver}
          onDrop={handleDropOnInstructions}
          onRemoveInstruction={handleRemoveInstruction}
          onInstructionsProcessed={handleInstructionsProcessed}
        />
        
        <IngredientsSidebar
          ingredientsByStep={ingredientsByStep}
          allSeasonings={allSeasonings}
          waterAndOils={waterAndOils}
          currentStep={currentStep}
          onDragIngredientStart={handleDragIngredientStart}
        />
      </div>

      <AddItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        itemToAdd={itemToAdd}
        itemType={itemType}
        quantity={quantity}
        onQuantityChange={setQuantity}
        units={units}
        onUnitsChange={setUnits}
        onAddItem={handleAddItemFromDialog}
      />
    </div>
  );
};

export default CookingInstructionsV2;