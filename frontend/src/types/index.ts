<<<<<<< HEAD
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
=======
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
>>>>>>> a37e3e21bfe3cbb87bce52f7cf8f47a0da97177f
  | 'Korean';

export type DeviceSupport = 'MoMe' | 'Simmr' | 'Both' | 'None';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

<<<<<<< HEAD
export type RecipeStatus = 'pending' | 'approved' | 'rejected';

export interface ContainerIngredient {
  id: string;
  name: string;
  image: string;
  quantity: number;
}

export interface Container {
  id: number;
  name: string;
  ingredients: ContainerIngredient[];
}

export interface Seasoning {
  id: string;
  name: string;
  image: string;
  count: number;
  quantity: number;
}

export interface PreparationItem {
  id: string;
  name: string;
  image: string;
}

export interface Utensil {
  id: string;
  name: string;
  image: string;
}

export interface WaterOil {
  id: string;
  name: string;
  image: string;
  quantity: number;
}
=======
export type RecipeType = 'veg' | 'non-veg' | 'vegan';
>>>>>>> a37e3e21bfe3cbb87bce52f7cf8f47a0da97177f

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  image: string;
  category: string;
  cuisine: CuisineType;
  cookingTime: number; // Changed from cooking_time to match interface
  servings: number;
  difficulty: DifficultyLevel;
  price?: number;
  author?: string;
  deviceSupport: DeviceSupport;
  preparationRequired?: boolean;
  rating: number;
  featured?: boolean;
  chefCreated?: boolean;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
<<<<<<< HEAD

  ingredients: string[];
  instructions: string[];

  containers?: Container[];
  seasonings?: Seasoning[];
  preparationItems?: PreparationItem[];
  utensils?: Utensil[];
  waterOil?: WaterOil[];

  status?: RecipeStatus;

  createdAt?: string | Date;
  updatedAt?: string | Date;
=======
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
>>>>>>> a37e3e21bfe3cbb87bce52f7cf8f47a0da97177f
}

export interface Category {
  id: string;
  name: string;
  description: string;
}