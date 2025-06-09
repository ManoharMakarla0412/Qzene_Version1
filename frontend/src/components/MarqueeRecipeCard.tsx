// src/components/MarqueeRecipeCard.tsx

import { Link } from "react-router-dom";
import { Recipe } from "@/types";
import { Badge } from "@/components/ui/badge";

interface MarqueeRecipeCardProps {
  recipe: Recipe;
}

const MarqueeRecipeCard = ({ recipe }: MarqueeRecipeCardProps) => {
  const fallbackImage = "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

  return (
    <Link to={`/recipes/${recipe.id}`} className="block group">
      <div 
        // Using a fixed height `h-48` is the correct approach.
        className="relative w-full h-48 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"
      >
        <img
          src={recipe.image || fallbackImage}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:brightness-105"
          onError={(e) => { e.currentTarget.src = fallbackImage; }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        {recipe.deviceSupport !== 'None' && (
          <div className="absolute top-3 right-3">
            {recipe.deviceSupport === 'MoMe' && (
              <Badge className="bg-green-600 hover:bg-green-700 border-none shadow-lg">MoMe</Badge>
            )}
            {recipe.deviceSupport === 'Simmr' && (
              <Badge className="bg-amber-600 hover:bg-amber-700 border-none shadow-lg">Simmr</Badge>
            )}
            {recipe.deviceSupport === 'Both' && (
              <Badge className="bg-qzene-purple-dark hover:bg-qzene-purple/90 border-none shadow-lg">MoMe & Simmr</Badge>
            )}
          </div>
        )}
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="font-bold text-base leading-tight drop-shadow-md">
            {recipe.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default MarqueeRecipeCard;