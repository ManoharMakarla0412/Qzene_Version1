import { useState, useEffect } from 'react';
import { Container, Ingredient, RecipeData, RecipeStep } from '@/types/recipeMaker';
import { useToast } from './use-toast';
import { API_URL } from '@/lib/constants';

export const useRecipeMaker = () => {
  const { toast } = useToast();
  const [recipeName, setRecipeName] = useState('New Recipe');
  const [servingSize, setServingSize] = useState(2);
  const [showCookingInstructions, setShowCookingInstructions] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [seasonings, setSeasonings] = useState<Ingredient[]>([]);
  const [waterAndOils, setWaterAndOils] = useState<Ingredient[]>([]);
  const [containers, setContainers] = useState<Container[]>([
    { id: 1, name: 'Container1', ingredients: [] },
    { id: 2, name: 'Container2', ingredients: [] },
    { id: 3, name: 'Container3', ingredients: [] },
    { id: 4, name: 'Container4', ingredients: [] },
    { id: 5, name: 'Container5', ingredients: [] },
    { id: 6, name: 'Container6', ingredients: [] },
    { id: 7, name: 'Seasoning1', ingredients: [] },
    { id: 8, name: 'Seasoning2', ingredients: [] },
    { id: 9, name: 'Seasoning3', ingredients: [] },
    { id: 10, name: 'Seasoning4', ingredients: [] },
    { id: 11, name: 'Seasoning5', ingredients: [] },
    { id: 12, name: 'Seasoning6', ingredients: [] },
    { id: 13, name: 'Seasoning7', ingredients: [] },
    { id: 14, name: 'Seasoning8', ingredients: [] },
    { id: 15, name: 'Water', ingredients: [] },
    { id: 16, name: 'Oil', ingredients: [] },
  ]);
  const [dragging, setDragging] = useState<Ingredient | null>(null);
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([
    { id: 1, description: 'Prepare ingredients', time: 5 },
  ]);

  // Initialize recipe data from existing recipe
  const initializeRecipeData = (recipeData: any) => {
    try {

      // Set containers with ingredients
      if (recipeData.containers && Array.isArray(recipeData.containers)) {
        const updatedContainers = [...containers];
        recipeData.containers.forEach((sourceContainer: any) => {
          const containerIndex = updatedContainers.findIndex((c) => c.id === sourceContainer.id);
          if (containerIndex >= 0) {
            updatedContainers[containerIndex] = {
              ...updatedContainers[containerIndex],
              ingredients: sourceContainer.ingredients || [],
            };
          }
        });
        setContainers(updatedContainers);
      }

      // Set recipe steps
      if (recipeData.steps && Array.isArray(recipeData.steps)) {
        setRecipeSteps(recipeData.steps);
      }
    } catch (error) {
      console.error("Error initializing recipe data:", error);
    }
  };

  // Fetch ingredients from backend API
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/admin/ingredients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch ingredients');
        }

        const apiIngredients = data.data;

        // Categorize ingredients based on type
        const categorizedIngredients: Ingredient[] = [];
        const categorizedSeasonings: Ingredient[] = [];
        const categorizedWaterAndOils: Ingredient[] = [];

        apiIngredients.forEach((item: any) => {
          const ingredient: Ingredient = {
            id: item._id,
            name: item.name,
            type: item.type.toLowerCase(),
            image_url: item.image,
            quantity: 1,
            units: item.type === 'Oil' || item.name.toLowerCase().includes('water') ? 'ml' : 'gm',
          };

          if (item.type === 'Ingredients') {
            categorizedIngredients.push({ ...ingredient, type: 'ingredient' });
          } else if (item.type === 'Seasoning') {
            categorizedSeasonings.push({ ...ingredient, type: 'seasoning' });
          } else if (item.type === 'Oil' || item.name.toLowerCase().includes('water')) {
            categorizedWaterAndOils.push({
              ...ingredient,
              type: item.name.toLowerCase().includes('water') ? 'water' : 'oil',
            });
          }
        });

        setIngredients(categorizedIngredients);
        setSeasonings(categorizedSeasonings);
        setWaterAndOils(categorizedWaterAndOils);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        toast({
          title: 'Error fetching ingredients',
          description: 'Please try again later.',
          variant: 'destructive',
        });
      }
    };

    fetchIngredients();
  }, [toast]);

  const handleDragStart = (
    e: React.DragEvent,
    ingredient: Ingredient,
    source: 'ingredient-list' | 'container' | 'seasoning-list' | 'water-oil-list',
    containerId?: number
  ) => {
    setDragging(ingredient);
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        ingredient,
        source,
        containerId,
      })
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, containerId: number) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { ingredient, source, containerId: sourceContainerId } = data;

      // Check container type and ingredient type compatibility
      const containerType = getContainerType(containerId);
      const ingredientType = source === 'container' ? getItemTypeFromPreviousContainer(ingredient) : source;

      // Validate drop based on container type
      if (!isValidDrop(containerType, ingredientType)) {
        toast({
          title: 'Invalid Drop',
          description: `This container can only accept ${containerType.replace('-', ' ')} items`,
          variant: 'destructive',
        });
        return;
      }

      // If coming from another container, remove it from there first
      if (source === 'container' && sourceContainerId !== containerId) {
        removeIngredient(sourceContainerId, ingredient.id);
      }

      // Add to the new container with quantity if not from another container
      if (source !== 'container' || sourceContainerId !== containerId) {
        const newIngredient = {
          ...ingredient,
          quantity: ingredient.quantity || 1,
          units: ingredient.units || (ingredient.type === 'water' || ingredient.type === 'oil' ? 'ml' : 'gm'),
        };

        setContainers(
          containers.map((container) => {
            if (container.id === containerId) {
              const existingIndex = container.ingredients.findIndex((i) => i.id === newIngredient.id);
              if (existingIndex >= 0) {
                const updatedIngredients = [...container.ingredients];
                updatedIngredients[existingIndex] = {
                  ...updatedIngredients[existingIndex],
                  quantity: (updatedIngredients[existingIndex].quantity || 1) + 1,
                };
                return { ...container, ingredients: updatedIngredients };
              } else {
                return {
                  ...container,
                  ingredients: [...container.ingredients, newIngredient],
                };
              }
            }
            return container;
          })
        );
      }
    } catch (err) {
      console.error('Error processing drop:', err);
    }

    setDragging(null);
  };

  const getContainerType = (containerId: number): 'ingredient-list' | 'seasoning-list' | 'water-oil-list' => {
    if (containerId >= 1 && containerId <= 6) {
      return 'ingredient-list';
    } else if (containerId >= 7 && containerId <= 14) {
      return 'seasoning-list';
    } else {
      return 'water-oil-list';
    }
  };

  const isValidDrop = (containerType: string, itemType: string): boolean => {
    if (itemType === 'container') return true;
    return containerType === itemType;
  };

  const getItemTypeFromPreviousContainer = (ingredient: Ingredient): string => {
    if (ingredient.type === 'seasoning') return 'seasoning-list';
    if (ingredient.type === 'water' || ingredient.type === 'oil') return 'water-oil-list';
    return 'ingredient-list';
  };

  const removeIngredient = (containerId: number, ingredientId: string) => {
    setContainers(
      containers.map((container) => {
        if (container.id === containerId) {
          return {
            ...container,
            ingredients: container.ingredients.filter((i) => i.id !== ingredientId),
          };
        }
        return container;
      })
    );
  };

  const updateIngredientQuantity = (
    containerId: number,
    ingredientId: string,
    quantity: number,
    units?: string,
    prepType?: string
  ) => {
    if (quantity <= 0) {
      removeIngredient(containerId, ingredientId);
      return;
    }

    setContainers(
      containers.map((container) => {
        if (container.id === containerId) {
          return {
            ...container,
            ingredients: container.ingredients.map((ingredient) =>
              ingredient.id === ingredientId
                ? { ...ingredient, quantity, ...(units && { units }), ...(prepType && { prepType }) }
                : ingredient
            ),
          };
        }
        return container;
      })
    );
  };

  const addRecipeStep = () => {
    const newId = recipeSteps.length > 0 ? Math.max(...recipeSteps.map((step) => step.id)) + 1 : 1;
    setRecipeSteps([...recipeSteps, { id: newId, description: '' }]);
  };

  const updateRecipeStep = (id: number, updates: Partial<RecipeStep>) => {
    setRecipeSteps(recipeSteps.map((step) => (step.id === id ? { ...step, ...updates } : step)));
  };

  const removeRecipeStep = (id: number) => {
    setRecipeSteps(recipeSteps.filter((step) => step.id !== id));
  };

  const handleStartCooking = () => {
    setShowCookingInstructions(true);
  };

  const handleBackToPlanner = () => {
    setShowCookingInstructions(false);
  };

  const generateRecipeJson = (): RecipeData => ({
    name: recipeName,
    servingSize,
    containers,
    seasonings: containers.flatMap((c) => c.ingredients.filter((i) => i.type === 'seasoning')),
    waters: containers.flatMap((c) => c.ingredients.filter((i) => i.type === 'water')),
    oils: containers.flatMap((c) => c.ingredients.filter((i) => i.type === 'oil')),
    steps: recipeSteps,
  });

  const resetRecipe = () => {
    setRecipeName('New Recipe');
    setServingSize(2);
    setContainers([
      { id: 1, name: 'Container1', ingredients: [] },
      { id: 2, name: 'Container2', ingredients: [] },
      { id: 3, name: 'Container3', ingredients: [] },
      { id: 4, name: 'Container4', ingredients: [] },
      { id: 5, name: 'Container5', ingredients: [] },
      { id: 6, name: 'Container6', ingredients: [] },
      { id: 7, name: 'Seasoning1', ingredients: [] },
      { id: 8, name: 'Seasoning2', ingredients: [] },
      { id: 9, name: 'Seasoning3', ingredients: [] },
      { id: 10, name: 'Seasoning4', ingredients: [] },
      { id: 11, name: 'Seasoning5', ingredients: [] },
      { id: 12, name: 'Seasoning6', ingredients: [] },
      { id: 13, name: 'Seasoning7', ingredients: [] },
      { id: 14, name: 'Seasoning8', ingredients: [] },
      { id: 15, name: 'Water', ingredients: [] },
      { id: 16, name: 'Oil', ingredients: [] },
    ]);
    setRecipeSteps([{ id: 1, description: 'Prepare ingredients', time: 5 }]);
    setShowCookingInstructions(false);
  };

  return {
    recipeName,
    setRecipeName,
    servingSize,
    setServingSize,
    showCookingInstructions,
    setShowCookingInstructions,
    ingredients,
    seasonings,
    waterAndOils,
    containers,
    setContainers,
    dragging,
    recipeSteps,
    setRecipeSteps,
    handleDragStart,
    handleDrop,
    handleDragOver,
    removeIngredient,
    updateIngredientQuantity,
    addRecipeStep,
    updateRecipeStep,
    removeRecipeStep,
    handleStartCooking,
    handleBackToPlanner,
    generateRecipeJson,
    resetRecipe,
    initializeRecipeData,
  };
};