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
  ingredients: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
}