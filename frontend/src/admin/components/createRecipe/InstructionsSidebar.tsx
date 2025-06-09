import React from "react";
import { Instruction } from "@/types/instruction";
import { Card } from "@/components/ui/card";
import { ArrowUpDown, Clock } from "lucide-react";
import { useInstructions } from "@/admin/hooks/useInstructions";
import { RecipeStep } from "@/types/recipeMaker";

interface InstructionsSidebarProps {
  recipeSteps?: RecipeStep[];
  currentStep?: number;
  onUpdateStep?: (id: number, updates: Partial<RecipeStep>) => void;
  onDragStart: (e: React.DragEvent, instruction: Instruction) => void;
}

const InstructionsSidebar = ({ 
  recipeSteps = [], 
  currentStep = 1, 
  onUpdateStep,
  onDragStart
}: InstructionsSidebarProps) => {
  
  const {
    instructions,
    handleDragInstructionStart,
  } = useInstructions({
    recipeSteps,
    currentStep,
    onUpdateStep,
  });

  const isLoading = instructions.length === 0;

  return (
    <div className="md:col-span-3 border-r bg-gray-50 p-4">
      <div className="space-y-4 h-full">
        <Card className="p-4 h-[95%] min-h-[500px]">
          <h3 className="font-medium text-sm mb-4">Available Instructions</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-gray-500">Loading instructions...</p>
            </div>
          ) : instructions.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-gray-500">No instructions available</p>
            </div>
          ) : (
            <div className="h-[95%] max-h-[500px] overflow-y-auto pr-2 space-y-2">
              {instructions.map((instruction) => (
                <div 
                  key={instruction.id}
                  className="flex items-center p-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-move hover:bg-gray-50 transition-colors"
                  draggable
                  onDragStart={(e) => onDragStart(e, instruction)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    {instruction.image_url ? (
                      <img 
                        src={instruction.image_url}
                        alt={instruction.name} 
                        className="h-8 w-8 rounded object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {instruction.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">
                        {instruction.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InstructionsSidebar;