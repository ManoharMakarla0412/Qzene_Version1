
import { Ingredient } from '@/types/recipeMaker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface IngredientsPanelProps {
  ingredients: Ingredient[];
  onDragStart: (e: React.DragEvent, ingredient: Ingredient, source: "ingredient-list") => void;
}

const IngredientsPanel = ({ ingredients, onDragStart }: IngredientsPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredIngredients = ingredients.filter(ingredient => 
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 flex-shrink-0">
        <CardTitle className="text-lg">Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col flex-1 min-h-0">
        <div className="relative mb-3 flex-shrink-0">
          <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search ingredients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-2 gap-2">
            {filteredIngredients.map(ingredient => (
              <div
                key={ingredient.id}
                className="p-2 border rounded-md cursor-grab bg-white hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => onDragStart(e, ingredient, 'ingredient-list')}
              >
                <div className="flex items-center gap-2">
                  {ingredient.image_url ? (
                    <img 
                      src={ingredient.image_url} 
                      alt={ingredient.name} 
                      className="w-8 h-8 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs">No img</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium truncate">{ingredient.name}</p>
                    <p className="text-xs text-gray-500">{ingredient.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default IngredientsPanel;
