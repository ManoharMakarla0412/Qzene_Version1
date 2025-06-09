
import React from 'react';
import { Container, Ingredient } from '@/types/recipeMaker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';

interface MainContainersPanelProps {
  containers: Container[];
  dragging: Ingredient | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, containerId: number) => void;
  onDragStart: (e: React.DragEvent, ingredient: Ingredient, source: "container", containerId: number) => void;
  onRemoveIngredient: (containerId: number, ingredientId: string) => void;
  updateIngredientQuantity?: (containerId: number, ingredientId: string, quantity: number, units?: string) => void;
  onItemClick?: (ingredient: Ingredient, containerId: number) => void; // Added new prop
}

const MainContainersPanel = ({
  containers,
  dragging,
  onDragOver,
  onDrop,
  onDragStart,
  onRemoveIngredient,
  onItemClick
}: MainContainersPanelProps) => {
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {containers.map(container => (
        <Card key={container.id} className="h-full">
          <CardHeader className="py-2 bg-gray-50">
            <CardTitle className="text-sm">{container.name}</CardTitle>
          </CardHeader>
          <CardContent
            className={`p-3 min-h-[70px] ${dragging ? 'border-2 border-dashed border-[#986CF5] bg-[#986CF5]/5 rounded-b-lg' : ''}`}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, container.id)}
          >
            {container.ingredients.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed rounded-md p-2">
                <div className="flex flex-col items-center">
                  <Plus className="w-4 h-4 mb-1" />
                  <span>Main ingredients</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {container.ingredients.map(ingredient => (
                  <div 
                    key={ingredient.id} 
                    className="flex items-center justify-between p-2 border rounded-md bg-white hover:shadow-md transition-shadow cursor-pointer"
                    draggable
                    onDragStart={(e) => onDragStart(e, ingredient, "container", container.id)}
                    onClick={() => onItemClick && onItemClick(ingredient, container.id)}
                  >
                    <div className="flex items-center gap-2">
                      {ingredient.image_url ? (
                        <img 
                          src={ingredient.image_url} 
                          alt={ingredient.name} 
                          className="w-6 h-6 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-md" />
                      )}
                      <span className="text-xs">
                        {ingredient.name}
                        {ingredient.quantity && <span className="text-xs text-gray-500 ml-1">
                          {ingredient.quantity}{ingredient.units ? ` ${ingredient.units}` : ''}
                          {ingredient.prepType ? ` (${ingredient.prepType})` : ''}
                        </span>}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-5 w-5 ml-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveIngredient(container.id, ingredient.id);
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MainContainersPanel;
