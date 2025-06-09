import React from 'react';
import { Container, RecipeStep, InstructionStep } from '@/types/recipeMaker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash, ArrowLeft } from 'lucide-react';

interface CookingInstructionsProps {
  recipeName: string;
  containers: Container[];
  recipeSteps: RecipeStep[];
  onBack: () => void;
  onAddStep?: () => void;
  onUpdateStep?: (id: number, updates: Partial<RecipeStep>) => void;
  onRemoveStep?: (id: number) => void;
  onSaveRecipe?: () => void;
  onInstructionsProcessed?: (stepInstructions: InstructionStep[]) => void; // Added prop
}

const CookingInstructions = ({
  recipeName,
  containers,
  recipeSteps = [],
  onBack,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
  onSaveRecipe,
  onInstructionsProcessed, // Destructure prop
}: CookingInstructionsProps) => {
  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Recipe Maker
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Selected Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {containers.map((container) => (
              <div key={container.id}>
                <h3 className="font-medium mb-2">{container.name}</h3>
                {container.ingredients.length === 0 ? (
                  <p className="text-sm text-gray-500">No ingredients added</p>
                ) : (
                  <ul className="list-disc pl-5 space-y-1">
                    {container.ingredients.map((ingredient) => (
                      <li key={ingredient.id} className="text-sm">
                        {ingredient.name}{' '}
                        {ingredient.quantity && `(${ingredient.quantity}${ingredient.units || ''})`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cooking Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recipeSteps.map((step, index) => (
              <div key={step.id} className="flex gap-3">
                <div className="mt-2 w-6 h-6 bg-[#986CF5] text-white rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-grow space-y-2">
                  <Textarea
                    placeholder={`Step ${index + 1} instructions...`}
                    value={step.description}
                    onChange={(e) => onUpdateStep?.(step.id, { description: e.target.value })}
                    className="w-full"
                  />
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="text-sm mb-1 block">Time (minutes)</label>
                      <Input
                        type="number"
                        value={step.time || ''}
                        onChange={(e) =>
                          onUpdateStep?.(step.id, { time: parseInt(e.target.value) || undefined })
                        }
                        placeholder="Minutes"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="text-sm mb-1 block">Temperature (°F)</label>
                      <Input
                        type="number"
                        value={step.temperature || ''}
                        onChange={(e) =>
                          onUpdateStep?.(step.id, { temperature: parseInt(e.target.value) || undefined })
                        }
                        placeholder="Temperature"
                      />
                    </div>
                  </div>
                </div>
                {onRemoveStep && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onRemoveStep(step.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {onAddStep && (
              <Button variant="outline" onClick={onAddStep} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Another Step
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {onSaveRecipe && (
        <div className="flex justify-end mt-6">
          <Button
            className="bg-[#986CF5] hover:bg-[#986CF5]/90"
            onClick={onSaveRecipe}
          >
            Save Recipe
          </Button>
        </div>
      )}
    </div>
  );
};

export default CookingInstructions;