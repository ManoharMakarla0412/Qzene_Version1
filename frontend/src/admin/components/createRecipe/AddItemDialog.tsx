import React from "react";
import { Ingredient } from "@/types/recipeMaker";
import { Instruction } from "@/types/instruction";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToAdd: Instruction | Ingredient | null;
  itemType: 'instruction' | 'ingredient' | null;
  quantity: string;
  onQuantityChange: (value: string) => void;
  units: string;
  onUnitsChange: (value: string) => void;
  onAddItem: () => void;
}

const AddItemDialog = ({
  open,
  onOpenChange,
  itemToAdd,
  itemType,
  quantity,
  onQuantityChange,
  units,
  onUnitsChange,
  onAddItem
}: AddItemDialogProps) => {
  // If instruction has units already, use them as default when dialog opens
  React.useEffect(() => {
    if (itemType === 'instruction' && itemToAdd && (itemToAdd as Instruction).units) {
      onUnitsChange((itemToAdd as Instruction).units || '');
    }
  }, [itemToAdd, itemType, onUnitsChange]);

  // Generate a dynamic title based on the item type
  const getDialogTitle = () => {
    if (itemType === 'instruction') {
      return 'Add Instruction';
    }
    
    if (itemType === 'ingredient' && itemToAdd) {
      const ingredient = itemToAdd as Ingredient;
      switch (ingredient.type) {
        case 'seasoning':
          return 'Add Seasoning';
        case 'water':
          return 'Add Water';
        case 'oil':
          return 'Add Oil';
        default:
          return 'Add Ingredient';
      }
    }
    
    return 'Add Item';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg p-0 overflow-hidden">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-xl font-bold text-center p-4">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Image */}
            <div className="border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center p-4">
              {itemToAdd?.image_url ? (
                <img 
                  src={itemToAdd.image_url} 
                  alt={itemToAdd.name} 
                  className="w-full h-auto max-h-[200px] object-contain"
                />
              ) : (
                <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400 text-lg">{itemToAdd?.name?.substring(0, 2) || 'NA'}</span>
                </div>
              )}
            </div>
            
            {/* Right column - Input fields */}
            <div className="space-y-4">
              {/* Name field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-gray-500">Name</label>
                <Input 
                  id="name"
                  value={itemToAdd?.name || ''} 
                  readOnly 
                  className="font-medium bg-gray-50"
                />
              </div>
              
              {/* Type dropdown (for ingredients only) */}
              {itemType === 'ingredient' && (
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm text-gray-500">Type</label>
                  <Input
                    id="type"
                    value={(itemToAdd as Ingredient)?.type || 'ingredient'}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              )}
              
              {/* Value and Units fields */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label htmlFor="value" className="text-sm text-gray-500">Value</label>
                  <Input
                    id="value"
                    value={quantity}
                    onChange={(e) => onQuantityChange(e.target.value)}
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Amount"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="units" className="text-sm text-gray-500">Units</label>
                  <Input
                    id="units"
                    value={units}
                    onChange={(e) => onUnitsChange(e.target.value)}
                    placeholder="Units"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between border-t p-4 bg-gray-50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-8 border-[#986CF5] text-[#986CF5]"
          >
            Cancel
          </Button>
          
          <Button
            onClick={onAddItem}
            className="bg-[#986CF5] hover:bg-[#986CF5]/90 text-white rounded-full px-8"
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
