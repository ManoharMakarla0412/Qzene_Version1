import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Recipe } from "@/types";
import { API_URL } from "@/lib/constants";

type RecipeContextType = {
  recipes: Recipe[];
  loading: boolean;
  refresh: () => void;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/recipes`);
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, loading, refresh: fetchRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = () => {
  const ctx = useContext(RecipeContext);
  if (!ctx) throw new Error("useRecipe must be used within a RecipeProvider");
  return ctx;
};