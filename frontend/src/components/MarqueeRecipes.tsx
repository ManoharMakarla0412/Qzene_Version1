// src/components/MarqueeRecipes.tsx

import { Recipe } from "@/types";
import MarqueeRecipeCard from "./MarqueeRecipeCard";

interface MarqueeRecipesProps {
  recipes: Recipe[];
  direction: "left" | "right";
}

const MarqueeRecipes = ({ recipes, direction }: MarqueeRecipesProps) => {
  if (!recipes || recipes.length === 0) {
    return null;
  }
  
  return (
    // "Viewport" that hides horizontal overflow and adds vertical spacing.
    <div className="w-full overflow-x-hidden py-4">
      {/* 
        The "Track" that moves. 'w-max' lets it be as wide as its content.
        The animation classes from App.css will be applied here.
      */}
      <div className={`flex w-max gap-6 ${direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}`}>
        {/* Double the content for a smooth infinite loop */}
        {[...recipes, ...recipes].map((recipe, index) => (
          // "Item" with fixed width that doesn't shrink.
          <div key={`${recipe.id}-${index}`} className="w-64 flex-shrink-0">
            <MarqueeRecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeRecipes;