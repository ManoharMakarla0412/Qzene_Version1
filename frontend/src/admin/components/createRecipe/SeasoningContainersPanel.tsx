
import React, { useState } from 'react';
import { Container, Ingredient } from '@/types/recipeMaker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import IngredientDetailsDialog from './IngredientDetailsDialog';

interface SeasoningContainersPanelProps {
  containers: Container[];
  dragging: Ingredient | null;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, containerId: number) => void;
  onDragStart: (e: React.DragEvent, ingredient: Ingredient, source: "container", containerId: number) => void;
  onRemoveIngredient: (containerId: number, ingredientId: string) => void;
  onItemClick?: (ingredient: Ingredient, containerId: number) => void;
  updateIngredientQuantity?: (containerId: number, ingredientId: string, quantity: number, units?: string, prepType?: string) => void;
}

const SeasoningContainersPanel = ({
  containers,
  dragging,
  onDragOver,
  onDrop,
  onDragStart,
  onRemoveIngredient,
  onItemClick,
  updateIngredientQuantity
}: SeasoningContainersPanelProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(null);

  const handleDrop = (e: React.DragEvent, containerId: number) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { ingredient, source, containerId: sourceContainerId } = data;
      
      // If it's just moving between containers or within the same container, use normal drop
      if (source === 'container') {
        onDrop(e, containerId);
        return;
      }
      
      // For new ingredients from the panels, show the dialog
      setSelectedIngredient(ingredient);
      setSelectedContainerId(containerId);
      setDialogOpen(true);
    } catch (err) {
      console.error("Error processing drop:", err);
      // Fallback to normal drop
      onDrop(e, containerId);
    }
  };

  const handleDialogAdd = (ingredient: Ingredient, quantity: number, units: string, prepType?: string) => {
    if (selectedContainerId !== null && updateIngredientQuantity) {
      // Create a modified ingredient with quantity, units and prepType
      const modifiedIngredient = {
        ...ingredient,
        quantity: quantity,
        units: units,
        prepType: prepType || 'whole'
      };
      
      // Create a synthetic drag event to reuse the existing logic
      const syntheticEvent = {
        preventDefault: () => {},
        dataTransfer: {
          getData: () => JSON.stringify({
            ingredient: modifiedIngredient,
            source: 'seasoning-list'
          })
        }
      } as unknown as React.DragEvent;
      
      onDrop(syntheticEvent, selectedContainerId);
    }
    
    // Close the dialog
    setDialogOpen(false);
    setSelectedIngredient(null);
    setSelectedContainerId(null);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        {containers.map((container, index) => (
          <Card key={container.id} className="h-full">
            <CardHeader className="py-1 bg-gray-50">
              <CardTitle className="text-xs">Seasoning {index + 1}</CardTitle>
            </CardHeader>
            <CardContent
              className={`p-2 min-h-[60px] ${dragging ? 'border-2 border-dashed border-[#986CF5] bg-[#986CF5]/5 rounded-b-lg' : ''}`}
              onDragOver={onDragOver}
              onDrop={(e) => handleDrop(e, container.id)}
            >
              {container.ingredients.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs border-2 border-dashed rounded-md p-2">
                  <div className="flex flex-col items-center">
                    <Plus className="w-3 h-3 mb-1" />
                    <span>Seasonings</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {container.ingredients.map(ingredient => (
                    <div 
                      key={ingredient.id} 
                      className="flex items-center justify-between p-1 border rounded-md bg-white hover:shadow-md transition-shadow cursor-pointer"
                      draggable
                      onClick={() => onItemClick && onItemClick(ingredient, container.id)}
                      onDragStart={(e) => onDragStart(e, ingredient, "container", container.id)}
                    >
                      <div className="flex items-center gap-1">
                        {ingredient.image_url ? (
                          <img 
                            src={ingredient.image_url} 
                            alt={ingredient.name} 
                            className="w-4 h-4 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-4 h-4 bg-gray-200 rounded-md" />
                        )}
                        <span className="text-xs">{ingredient.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs mr-2">
                          {ingredient.quantity || 1} {ingredient.units || ''} 
                          {ingredient.prepType && ingredient.prepType !== 'whole' ? ` (${ingredient.prepType})` : ''}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveIngredient(container.id, ingredient.id);
                          }}
                        >
                          <Trash className="h-2 w-2" />
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

      {/* Ingredient Details Dialog */}
      <IngredientDetailsDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedIngredient(null);
        }}
        ingredient={selectedIngredient}
        onAdd={handleDialogAdd}
      />
    </>
  );
};

export default SeasoningContainersPanel;
