
import { Button } from "@/components/ui/button";
import { CuisineType } from "@/types";
import { useRecipe } from "@/contexts/RecipeContext"; // Use context instead of static import

interface CuisineFilterProps {
  selectedCuisine: CuisineType | null;
  onSelectCuisine: (cuisine: CuisineType | null) => void;
}

const CuisineFilter = ({ selectedCuisine, onSelectCuisine }: CuisineFilterProps) => {
  const { recipes } = useRecipe();
  // Get unique cuisines from recipes
  const cuisines = Array.from(new Set(recipes.map(r => r.cuisine))).sort();
  return (
    <div className="flex flex-wrap gap-2 py-4">
      <Button
        variant={selectedCuisine === null ? "default" : "outline"}
        className={selectedCuisine === null ? "bg-qzene-purple" : ""}
        onClick={() => onSelectCuisine(null)}
      >
        All
      </Button>
      
      {cuisines.map(cuisine => (
        <Button
          key={cuisine}
          variant={selectedCuisine === cuisine ? "default" : "outline"}
          className={selectedCuisine === cuisine ? "bg-qzene-purple" : ""}
          onClick={() => onSelectCuisine(cuisine)}
        >
          {cuisine}
        </Button>
      ))}
    </div>
  );
}

export default CuisineFilter;
