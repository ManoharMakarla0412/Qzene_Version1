
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Ingredient } from '@/types/recipeMaker';

interface IngredientDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onAdd: (ingredient: Ingredient, quantity: number, units: string, prepType?: string) => void;
  mode?: 'add' | 'edit'; // New prop for mode
  onSaveEdit?: (ingredient: Ingredient) => void; // New prop for saving edits
}

const IngredientDetailsDialog = ({ 
  isOpen, 
  onClose, 
  ingredient, 
  onAdd,
  mode = 'add',
  onSaveEdit
}: IngredientDetailsDialogProps) => {
  const [quantity, setQuantity] = useState('1');
  const [units, setUnits] = useState(ingredient?.units || 'gm');
  const [prepType, setPrepType] = useState(ingredient?.prepType || 'whole');
  const [name, setName] = useState(ingredient?.name || '');
  const [type, setType] = useState(ingredient?.type || 'ingredient');
  const [protein, setProtein] = useState(ingredient?.protein?.toString() || '');
  const [carbs, setCarbs] = useState(ingredient?.carbohydrate?.toString() || '');
  const [fat, setFat] = useState(ingredient?.fat?.toString() || '');
  const [fiber, setFiber] = useState(ingredient?.fiber?.toString() || '');
  const [others, setOthers] = useState(ingredient?.others?.toString() || '');
  
  // Reset form when ingredient changes
  useEffect(() => {
    if (ingredient) {
      setQuantity(ingredient.quantity?.toString() || '1');
      setUnits(ingredient.units || 'gm');
      setPrepType(ingredient.prepType || 'whole');
      setName(ingredient.name || '');
      setType(ingredient.type || 'ingredient');
      setProtein(ingredient.protein?.toString() || '');
      setCarbs(ingredient.carbohydrate?.toString() || '');
      setFat(ingredient.fat?.toString() || '');
      setFiber(ingredient.fiber?.toString() || '');
      setOthers(ingredient.others?.toString() || '');
    }
  }, [ingredient]);

  const handleAdd = () => {
    if (!ingredient) return;
    
    onAdd(
      ingredient,
      parseFloat(quantity) || 1,
      units,
      prepType
    );
  };

  const handleSaveEdit = () => {
    if (!ingredient || !onSaveEdit) return;
    
    onSaveEdit({
      ...ingredient,
      name,
      type,
      units,
      prepType,
      protein: protein ? parseFloat(protein) : null,
      carbohydrate: carbs ? parseFloat(carbs) : null,
      fat: fat ? parseFloat(fat) : null,
      fiber: fiber ? parseFloat(fiber) : null,
      others: others ? parseFloat(others) : null,
    });
  };

  if (!ingredient) return null;

  // Dynamic title based on ingredient type
  const getDialogTitle = () => {
    if (mode === 'edit') return 'Edit ' + getItemTypeName();
    return getItemTypeName() + ' Details';
  };

  // Helper function to get the item type name
  const getItemTypeName = () => {
    if (!ingredient) return 'Ingredient';
    
    switch (ingredient.type) {
      case 'seasoning':
        return 'Seasoning';
      case 'water':
        return 'Water';
      case 'oil':
        return 'Oil';
      default:
        return 'Ingredient';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="border rounded-md overflow-hidden w-full md:w-1/3 h-48 flex items-center justify-center">
              {ingredient.image_url ? (
                <img 
                  src={ingredient.image_url} 
                  alt={ingredient.name} 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <label className="text-gray-500">Name</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  disabled={mode !== 'edit'}
                  className={`mt-1 ${mode !== 'edit' ? 'bg-gray-100' : ''}`}
                />
              </div>
              
              <div>
                <label className="text-gray-500">Type</label>
                <Select 
                  disabled={mode !== 'edit'} 
                  value={type} 
                  onValueChange={setType}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingredient">Ingredient</SelectItem>
                    <SelectItem value="seasoning">Seasoning</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="oil">Oil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-gray-500">Preparation</label>
                <Select value={prepType} onValueChange={setPrepType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select preparation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whole">Whole</SelectItem>
                    <SelectItem value="boiled">Boiled</SelectItem>
                    <SelectItem value="chopped">Chopped</SelectItem>
                    <SelectItem value="chunks">Chunks</SelectItem>
                    <SelectItem value="crushed">Crushed</SelectItem>
                    <SelectItem value="diced">Diced</SelectItem>
                    <SelectItem value="julienne">Julienne</SelectItem>
                    <SelectItem value="marinated">Marinated</SelectItem>
                    <SelectItem value="minced">Minced</SelectItem>
                    <SelectItem value="powdered">Powdered</SelectItem>
                    <SelectItem value="pureed">Pureed</SelectItem>
                    <SelectItem value="sliced">Sliced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="text-gray-500">Value</label>
                  <Input 
                    type="number" 
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1"
                    disabled={mode === 'edit'}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500">Units</label>
                  <Select value={units} onValueChange={setUnits}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gm">gm</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="l">l</SelectItem>
                      <SelectItem value="cup">cup</SelectItem>
                      <SelectItem value="tbsp">tbsp</SelectItem>
                      <SelectItem value="tsp">tsp</SelectItem>
                      <SelectItem value="pcs">pcs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {mode === 'edit' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-500">Protein (g)</label>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.1"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500">Carbs (g)</label>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.1"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-500">Fat (g)</label>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.1"
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500">Fiber (g)</label>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.1"
                        value={fiber}
                        onChange={(e) => setFiber(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500">Others (g)</label>
                    <Input 
                      type="number" 
                      min="0"
                      step="0.1"
                      value={others}
                      onChange={(e) => setOthers(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-24"
          >
            Cancel
          </Button>
          {mode === 'edit' ? (
            <Button
              onClick={handleSaveEdit}
              className="bg-[#6C5CE7] hover:bg-[#6C5CE7]/90 w-24"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={handleAdd}
              className="bg-[#6C5CE7] hover:bg-[#6C5CE7]/90 w-24"
            >
              Add
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientDetailsDialog;
