import React, { useEffect, useMemo } from "react";
import { RecipeStep } from "@/types/recipeMaker";
import { Instruction } from "@/types/instruction";
import { Ingredient } from "@/types/recipeMaker";
import { ArrowRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";

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
      temperature: 0
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
      <div 
        className="min-h-[500px] border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col relative"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <h2 className="text-2xl font-bold text-center mb-4">Instructions</h2>
        
        {instructions.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {instructions.map((instruction, index) => {
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
              
              return (
                <Card key={index} className="p-2 shadow-sm hover:shadow-md transition-shadow relative bg-white">
                  <button 
                    onClick={() => onRemoveInstruction(instruction)}
                    className="absolute top-0.5 right-0.5 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 p-0.5"
                    aria-label="Remove instruction"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  <div className="flex items-start gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#986CF5] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{displayName}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        {displayValue && (
                          <span className="text-[10px] text-gray-600">{displayValue}</span>
                        )}
                        {displayUnits && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1 rounded">{displayUnits}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <p className="text-center italic">
              Drag instructions or ingredients here to build your recipe step
            </p>
          </div>
        )}
        
        {(draggingInstruction || draggingIngredient) && (
          <div className="absolute inset-0 bg-[#986CF5]/10 rounded-lg flex items-center justify-center border-2 border-[#986CF5] border-dashed">
            <div className="bg-white p-3 rounded-lg shadow-lg flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-[#986CF5]" />
              <span className="text-sm font-medium">
                {draggingInstruction ? (
                  <>
                    Add <span className="font-semibold">{draggingInstruction.name}</span>
                    {draggingInstruction.units && ` (${draggingInstruction.units})`}
                  </>
                ) : (
                  <>
                    Add <span className="font-semibold">{draggingIngredient?.name}</span>
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionsArea;