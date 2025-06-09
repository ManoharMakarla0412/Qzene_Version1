import React, { useEffect, useMemo } from "react";
import { RecipeStep } from "@/types/recipeMaker";
import { Instruction } from "@/types/instruction";
import { Ingredient } from "@/types/recipeMaker";
import { ArrowRight, ChefHat, CookingPot, Plus, X } from "lucide-react";

// The props and internal logic remain the same. The changes are primarily in the JSX structure.
interface InstructionsAreaProps {
  recipeName: string;
  recipeSteps: RecipeStep[];
  currentStep: number;
  totalSteps: number;
  draggingInstruction: Instruction | null;
  draggingIngredient: Ingredient | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveInstruction: (instructionText: string) => void;
  onInstructionsProcessed?: (instructionsArray: any[]) => void;
}

const InstructionsArea = ({
  recipeName,
  recipeSteps,
  currentStep,
  totalSteps,
  draggingInstruction,
  draggingIngredient,
  onDragOver,
  onDrop,
  onRemoveInstruction,
  onInstructionsProcessed,
}: InstructionsAreaProps) => {
  const currentStepData = useMemo(() => 
    recipeSteps[currentStep - 1] || {
      id: 0,
      description: "",
      time: 0,
      temperature: 0,
      additionalData: {}
    },
  [recipeSteps, currentStep]);

  const parseInstructions = useMemo(() => (description: string): string[] => {
    if (!description) return [];
    return description.split('\n').filter(line => line.trim() !== '');
  }, []);

  const instructions = useMemo(() => 
    parseInstructions(currentStepData.description),
  [currentStepData.description, parseInstructions]);

  useEffect(() => {
    if (instructions.length > 0 && currentStepData.id) {
      const instructionsJsonArray = instructions.map((instruction, index) => {
        let displayName = instruction;
        let displayValue = "";
        let displayUnits = "";
        
        const nameMatch = instruction.match(/^(Add\s+)?([^(]+)(?:\s*\(.*\))?/);
        const valueUnitsMatch = instruction.match(/\((\d+\.?\d*)?(?:\s*)([a-zA-Z]+)?\)/);
        
        if (nameMatch) {
          displayName = nameMatch[2].trim();
        }
        
        if (valueUnitsMatch) {
          displayValue = valueUnitsMatch[1] || "";
          displayUnits = valueUnitsMatch[2] || "";
        }

        return {
          step: index + 1,
          instruction: displayName,
          quantity: displayValue,
          units: displayUnits,
          raw: instruction,
          image_url: ""
        };
      });

      if (currentStepData.additionalData === undefined) {
        currentStepData.additionalData = {};
      }
      
      const currentInstructions = currentStepData.additionalData?.instructions?.Instructions;
      const instructionsChanged = JSON.stringify(currentInstructions) !== JSON.stringify(instructionsJsonArray);
      
      if (instructionsChanged) {
        currentStepData.additionalData.instructions = {
          Instructions: instructionsJsonArray
        };
        
        if (onInstructionsProcessed) {
          onInstructionsProcessed(instructionsJsonArray);
        }
      }
    }
  }, [instructions, currentStepData, onInstructionsProcessed]);


  return (
    <div className="md:col-span-6 p-4">
      {/* Main drop zone container with flowchart styling */}
      <div 
        className="min-h-[500px] border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col relative"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Step {currentStep}: Instructions
        </h2>

        {/* Use ordered list for semantic, sequential steps */}
        {instructions.length > 0 ? (
          <ol className="relative space-y-8 border-l-2 border-dashed border-gray-200">
            {instructions.map((instruction, index) => {
              // ... (parsing logic remains the same)
              let displayName = instruction.match(/^(Add\s+)?([^(]+)/)?.[2].trim() || instruction;
              let valueUnits = instruction.match(/\(([^)]+)\)/)?.[1];
              
              return (
                <li key={index} className="relative flex items-start">
                  {/* Circular node on the flowchart line */}
                  <span className="absolute -left-[1.3rem] top-1.5 flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full ring-4 ring-white">
                    <CookingPot className="w-5 h-5 text-indigo-600" />
                  </span>
                  
                  {/* Instruction Card - The main node content */}
                  <div className="ml-8 w-full bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{displayName}</p>
                        {valueUnits && (
                          <span className="mt-1 inline-block text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {valueUnits}
                          </span>
                        )}
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => onRemoveInstruction(instruction)}
                        className="text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 p-1"
                        aria-label={`Remove instruction: ${displayName}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          // Polished empty state
          <div className="flex flex-col items-center justify-center h-[400px] text-center text-gray-500">
            <ChefHat className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="font-semibold">Build Your Recipe</h3>
            <p className="mt-1 text-sm">
              Drag instructions or ingredients from the left panel to get started.
            </p>
          </div>
        )}
        
        {/* Dragging overlay - remains the same, but enhances the new UI */}
        {(draggingInstruction || draggingIngredient) && (
          <div className="absolute inset-0 bg-indigo-500/10 rounded-lg flex items-center justify-center border-2 border-indigo-500 border-dashed transition-all">
            <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3 animate-pulse">
              <Plus className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-semibold text-gray-700">
                Drop to add: {draggingInstruction?.name || draggingIngredient?.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionsArea;