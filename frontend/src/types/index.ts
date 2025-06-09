import { InstructionStep } from "./recipeMaker";

export type CuisineType =
  | 'Indian'
  | 'Mexican'
  | 'Italian'
  | 'Chinese'
  | 'Thai'
  | 'American'
  | 'Mediterranean'
  | 'Japanese'
  | 'French'
  | 'Korean';

export type DeviceSupport = 'MoMe' | 'Simmr' | 'Both' | 'None';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type RecipeType = 'veg' | 'non-veg' | 'vegan';

export interface Recipe {
  id: string;
  name: string;
  image: string;
  category: string;
  cuisine: CuisineType;
  cookingTime: number; // Changed from cooking_time to match interface
  servings: number;
  difficulty: DifficultyLevel;
  rating: number;
  deviceSupport: DeviceSupport;
  featured?: boolean;
  chefCreated?: boolean;
  ingredients: string[];
  instructions: string[];
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  cuisine_type: CuisineType; // Added cuisine_type
  description: string; // Added description
  price?: number; // Added price (optional, as it's used in recipeData)
  recipe_type?: RecipeType; // Added recipe_type
  recipe_json?: { // Added recipe_json
    name: string;
    description: string;
    category: string;
    difficulty: DifficultyLevel;
    cookingTime: number;
    cuisine_type: CuisineType;
    recipe_type: RecipeType;
    price: number;
    image_url: string | null;
    servingSize: number;
    containers: any[]; // Adjust type as needed based on container structure
    steps: any[]; // Adjust type as needed based on step structure
    instructions_array: InstructionStep[];
    step_instructions?: any[]; // Optional, as used conditionally
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
}