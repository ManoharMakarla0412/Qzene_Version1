
import { Ingredient } from '@/types/recipeMaker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WaterAndOilsPanelProps {
  waterAndOils: Ingredient[];
  onDragStart: (e: React.DragEvent, item: Ingredient, source: "water-oil-list") => void;
}

const WaterAndOilsPanel = ({ waterAndOils, onDragStart }: WaterAndOilsPanelProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-1 flex-shrink-0">
        <CardTitle className="text-lg">Water & Oils</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex flex-col flex-1 min-h-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-2 gap-2">
            {waterAndOils.map(item => (
              <div
                key={item.id}
                className="p-2 border rounded-md cursor-grab bg-white hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => onDragStart(e, item, 'water-oil-list')}
              >
                <div className="flex items-center gap-2">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-6 h-6 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs">No img</span>
                    </div>
                  )}
                  <span className="text-xs truncate">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default WaterAndOilsPanel;
