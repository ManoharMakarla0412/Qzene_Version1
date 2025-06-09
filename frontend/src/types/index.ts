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

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  image: string;
  category: string;
  cuisine: CuisineType;
  cookingTime: number;
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
  instructions: string[];

  containers?: Container[];
  seasonings?: Seasoning[];
  preparationItems?: PreparationItem[];
  utensils?: Utensil[];
  waterOil?: WaterOil[];

  status?: RecipeStatus;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}
