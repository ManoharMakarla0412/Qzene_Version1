
// If this file exists, we'll just add to it
export interface Ingredient {
  id: string;
  name: string;
  image_url?: string;
  type?: 'ingredient' | 'seasoning' | 'water' | 'oil' | string;
  quantity?: number;
  units?: string;
  prepType?: string;
  
  // Optional fields from database that won't break our existing code
  allergen?: string;
  carbohydrate?: number;
  created_on?: string;
  fat?: number;
  fiber?: number;
  others?: number;
  prep_method?: string;
  protein?: number;
  updated_on?: string;
}

export interface Container {
  id: number;
  name: string;
  ingredients: Ingredient[];
}

export interface InstructionStep {
  step: number;
  instruction: string;
  quantity?: string | null;
  units?: string | null;
  raw?: string | null;
  image_url?: string | null;
}

export interface RecipeStep {
  id: number;
  description: string;
  time?: number; 
  temperature?: number;
  // New fields for JSON instructions format
  additionalData?: {
    instructions?: {
      Instructions: InstructionStep[]
    }
  };
  instructionsJson?: {
    instructions: Record<string, string>;
  };
}

export interface RecipeData {
  name: string;
  servingSize: number;
  containers: Container[];
  seasonings: Ingredient[];
  waters?: Ingredient[];
  oils?: Ingredient[];
  steps: RecipeStep[];
  // Basic recipe metadata from the form
  description?: string;
  category?: string;
  difficulty?: string;
  cooking_time?: number;
  cuisine_type?: string;
  recipe_type?: string;
  price?: number;
  image_url?: string;
  // New field for structured instructions
  instructions_array?: InstructionStep[];
}

export const PREPARATION_TYPES = [
  "whole",
  "boiled",
  "chopped",
  "chunks",
  "crushed",
  "diced",
  "julienne",
  "marinated",
  "minced",
  "powdered",
  "pureed",
  "sliced"
];
