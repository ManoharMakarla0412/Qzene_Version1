import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RecipeGrid from "../../components/createRecipe/RecipeGrid";
import CookingInstructions from "../../components/createRecipe/CookingInstructions";
import CookingInstructionsV2 from "../../components/createRecipe/CookingInstructionsv2";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { RecipeStep, InstructionStep } from "@/types/recipeMaker";
import { DifficultyLevel, Recipe, RecipeType } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipeMaker } from "../../hooks/useRecipeMaker";
import { API_URL } from "@/lib/constants";

interface CreateRecipeProps {
  isEditing?: boolean;
  initialData?: Recipe;
  disableLayout?: boolean;
}

const CreateRecipe = ({
  isEditing = false,
  initialData,
  disableLayout = false,
}: CreateRecipeProps = {}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // Store the image file
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  ); // For preview
  const [currentStep, setCurrentStep] = useState(1);
  const [useNewUI, setUseNewUI] = useState(true);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [recipeTypes, setRecipeTypes] = useState<string[]>([]);

  const [recipeData, setRecipeData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "0.00",
    category: initialData?.category || "",
    difficulty: initialData?.difficulty || "Medium",
    cookingTime: initialData?.cookingTime?.toString() || "30",
    cuisine_type: initialData?.cuisine_type || "",
    recipe_type: initialData?.recipe_type || "",
  });

  const {
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
    resetRecipe,
    initializeRecipeData,
  } = useRecipeMaker();

  const [allInstructionsData, setAllInstructionsData] = useState<
    InstructionStep[]
  >([]);

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const cuisineRes = await fetch(
          `${API_URL}/api/v1/admin/enums/Cuisine`,
          {
            credentials: "include",
          }
        );
        const cuisineData = await cuisineRes.json();
        if (cuisineData.success) {
          setCuisines(cuisineData.data.map((item: any) => item.value));
        }

        const categoryRes = await fetch(
          `${API_URL}/api/v1/admin/enums/Culinary%20Classification`,
          { credentials: "include" }
        );
        const categoryData = await categoryRes.json();
        if (categoryData.success) {
          setCategories(categoryData.data.map((item: any) => item.value));
        }

        const recipeTypeRes = await fetch(
          `${API_URL}/api/v1/admin/enums/Dietary`,
          {
            credentials: "include",
          }
        );
        const recipeTypeData = await recipeTypeRes.json();
        if (recipeTypeData.success) {
          setRecipeTypes(recipeTypeData.data.map((item: any) => item.value));
        }
      } catch (error) {
        console.error("Error fetching enums:", error);
        toast({
          title: "Error fetching data",
          description: "Failed to load cuisines, categories, or recipe types.",
          variant: "destructive",
        });
      }
    };

    fetchEnums();
  }, [toast]);

  useEffect(() => {
    if (isEditing && initialData?.recipe_json) {
      try {
        setRecipeName(initialData.name);
        if (initialData.recipe_json.servingSize) {
          setServingSize(initialData.recipe_json.servingSize);
        }
        if (
          initialData.recipe_json.containers &&
          Array.isArray(initialData.recipe_json.containers)
        ) {
          initializeRecipeData(initialData.recipe_json);
        }
        if (
          initialData.recipe_json.steps &&
          Array.isArray(initialData.recipe_json.steps)
        ) {
          setRecipeSteps(
            initialData.recipe_json.steps.map((step: any) => ({
              id: step.id,
              description: step.description,
              time: step.time || 0,
              temperature: step.temperature || 0,
              additionalData: step.additionalData || {},
            }))
          );
        }
        if (
          initialData.recipe_json.instructions_array &&
          Array.isArray(initialData.recipe_json.instructions_array)
        ) {
          setAllInstructionsData(
            initialData.recipe_json.instructions_array.map((instr: any) => ({
              step: instr.step,
              instruction: instr.instruction,
              quantity: instr.quantity,
              units: instr.units,
              raw: instr.raw,
              image_url: instr.image_url,
            }))
          );
        }
      } catch (error) {
        console.error("Error initializing recipe data for editing:", error);
        toast({
          title: "Error loading recipe data",
          description: "Some recipe data could not be loaded properly.",
          variant: "destructive",
        });
      }
    }
  }, [
    isEditing,
    initialData,
    setRecipeName,
    setServingSize,
    initializeRecipeData,
    setRecipeSteps,
    toast,
  ]);

  const handleInstructionsProcessed = (stepInstructions: InstructionStep[]) => {
    setAllInstructionsData((prevInstructions) => {
      const combinedInstructions = [...prevInstructions];
      stepInstructions.forEach((newInstruction) => {
        const existingIndex = combinedInstructions.findIndex(
          (i) =>
            i.instruction === newInstruction.instruction &&
            i.step === newInstruction.step
        );
        if (existingIndex >= 0) {
          combinedInstructions[existingIndex] = newInstruction;
        } else {
          combinedInstructions.push(newInstruction);
        }
      });
      return combinedInstructions;
    });
  };

  const syncNameToRecipeMaker = (name: string) => {
    setRecipeName(name);
    setRecipeData((prev) => ({ ...prev, name }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setRecipeName(value);
    }
  };

  const handleRadioChange = (value: RecipeType) => {
    setRecipeData((prev) => ({ ...prev, recipe_type: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!recipeData.name.trim()) {
        toast({ title: "Recipe name is required", variant: "destructive" });
        return;
      }
      setRecipeName(recipeData.name);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (containers.every((c) => c.ingredients.length === 0)) {
        toast({
          title: "Please add at least one ingredient",
          variant: "destructive",
        });
        return;
      }
      setShowCookingInstructions(true);
      setCurrentStep(3);
      if (recipeSteps.length === 0) {
        addRecipeStep();
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 3) {
      setShowCookingInstructions(false);
    }
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const collectAllInstructions = (): InstructionStep[] => {
    if (allInstructionsData.length > 0) {
      return allInstructionsData;
    }
    let collectedInstructions: InstructionStep[] = [];
    let stepCounter = 1;
    recipeSteps.forEach((step) => {
      if (step.additionalData?.instructions?.Instructions) {
        step.additionalData.instructions.Instructions.forEach(
          (instrObj: any) => {
            collectedInstructions.push({
              step: stepCounter++,
              instruction: instrObj.instruction,
              quantity: instrObj.quantity || null,
              units: instrObj.units || null,
              raw: instrObj.raw || null,
              image_url: instrObj.image_url || null,
            });
          }
        );
      } else {
        console.log(`Step ${step.id} has no structured instructions`);
      }
    });
    return collectedInstructions;
  };
const handleSubmit = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (!user || !user.id) {
    toast({
      title: "You must be logged in to create recipes",
      variant: "destructive",
    });
    return;
  }

  setLoading(true);
  try {
    if (!recipeData.name.trim()) {
      toast({ title: "Recipe name is required", variant: "destructive" });
      throw new Error("Recipe name is missing");
    }
    if (containers.every((c) => c.ingredients.length === 0)) {
      toast({
        title: "At least one ingredient is required",
        variant: "destructive",
      });
      throw new Error("No ingredients added");
    }
    if (
      recipeSteps.length === 0 ||
      recipeSteps.some((step) => !step.description.trim())
    ) {
      toast({
        title: "All steps must have a description",
        variant: "destructive",
      });
      throw new Error("Invalid or missing steps");
    }
    if (
      !recipeData.cuisine_type ||
      !recipeData.category ||
      !recipeData.recipe_type
    ) {
      toast({
        title: "Cuisine, category, and recipe type are required",
        variant: "destructive",
      });
      throw new Error("Missing required fields");
    }

    const instructionsArray = collectAllInstructions();
    const ingredientsList = containers
      .flatMap((c) => c.ingredients)
      .map(
        (i) =>
          `${i.quantity || 1} ${i.units || ""} ${
            i.prepType ? ` ${i.prepType} ` : ""
          }${i.name}`
      )
      .join("\n");
    const instructionsList = recipeSteps
      .map((step, index) => `${index + 1}. ${step.description}`)
      .join("\n");
    const cookingTime = parseInt(recipeData.cookingTime) || 0;

    const simplifiedContainers = containers.map((container) => ({
      id: container.id,
      name: container.name,
      ingredients: container.ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        type: ing.type,
        quantity: ing.quantity,
        units: ing.units,
        prepType: ing.prepType,
        image_url: ing.image_url,
      })),
    }));

    const simplifiedSteps = recipeSteps.map((step) => ({
      id: step.id,
      description: step.description,
      time: step.time || 0,
      temperature: step.temperature || 0,
    }));

    const recipeJson = {
      name: recipeData.name,
      description: recipeData.description,
      category: recipeData.category,
      difficulty: recipeData.difficulty,
      cookingTime,
      cuisine_type: recipeData.cuisine_type || "Custom",
      recipe_type: recipeData.recipe_type,
      price: parseFloat(recipeData.price) || 0,
      servingSize,
      containers: simplifiedContainers,
      steps: simplifiedSteps,
      instructions_array: instructionsArray,
    };

    const recipePayload = {
      name: recipeData.name,
      description: recipeData.description,
      ingredients: ingredientsList,
      instructions: instructionsList,
      cookingTime,
      difficulty: recipeData.difficulty,
      cuisine_type: recipeData.cuisine_type || "Custom",
      category: recipeData.category,
      recipe_type: recipeData.recipe_type,
      price: parseFloat(recipeData.price) || 0,
      user_id: user.id,
      recipe_json: recipeJson,
    };

   const formData = new FormData();
  formData.append("recipe", JSON.stringify(recipePayload)); // Ensure this is stringified
  if (imageFile) {
    formData.append("image", imageFile);
  }

  // Remove the Content-Type header - let the browser set it automatically
  const response = await fetch(
    isEditing && initialData?.id
      ? `${API_URL}/api/v1/admin/recipes/${initialData.id}`
      :  `${API_URL}/api/v1/admin/recipes`,
    {
      method: isEditing ? "PUT" : "POST",
      credentials: "include",
      body: formData, // Let browser set Content-Type with boundary
    }
  );


    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.message || `Failed to ${isEditing ? "update" : "create"} recipe`
      );
    }

    toast({
      title: `Recipe ${isEditing ? "updated" : "created"} successfully`,
      description: `Your recipe has been ${isEditing ? "updated" : "saved"}`,
    });
    resetRecipe();
    navigate("/admin");
  } catch (error: any) {
    console.error(
      `Error ${isEditing ? "updating" : "saving"} recipe:`,
      error
    );
    toast({
      title: `Error ${isEditing ? "updating" : "saving"} recipe`,
      description: error.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToNextStep();
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Recipe Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={recipeData.name}
                  onChange={handleChange}
                  placeholder="Enter recipe name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={recipeData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your recipe"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Recipe Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Upload a high-quality image of your finished recipe (JPEG,
                  PNG, or WebP, max 5MB)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={recipeData.category}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={recipeData.difficulty}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                  <Input
                    id="cookingTime"
                    name="cookingTime"
                    type="number"
                    min="5"
                    max="300"
                    value={recipeData.cookingTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine_type">Cuisine Type</Label>
                  <select
                    id="cuisine_type"
                    name="cuisine_type"
                    value={recipeData.cuisine_type}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Select Cuisine</option>
                    {cuisines.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Recipe Type</Label>
                  <RadioGroup
                    value={recipeData.recipe_type}
                    onValueChange={handleRadioChange}
                    className="flex space-x-4"
                  >
                    {recipeTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={type.toLowerCase()} />
                        <Label htmlFor={type.toLowerCase()}>
                          {type.replace("-", " ")}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={recipeData.price}
                  onChange={handleChange}
                  placeholder="0.00 for free recipes"
                />
                <p className="text-xs text-gray-500">
                  Set to 0.00 for free recipes, or add a price for premium
                  recipes
                </p>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Label>Serving Size:</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={servingSize}
                  onChange={(e) => setServingSize(parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
            <RecipeGrid
              ingredients={ingredients}
              containers={containers}
              seasonings={seasonings}
              waterAndOils={waterAndOils}
              dragging={dragging}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onRemoveIngredient={removeIngredient}
              updateIngredientQuantity={updateIngredientQuantity}
              onStartCooking={handleStartCooking}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            {useNewUI ? (
              <CookingInstructionsV2
                recipeName={recipeName}
                containers={containers}
                recipeSteps={recipeSteps}
                onBack={() => {}}
                onAddStep={addRecipeStep}
                onUpdateStep={updateRecipeStep}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setUseNewUI(true)}
                    className="text-[#986CF5] border-[#986CF5] hover:bg-[#986CF5]/10"
                  >
                    Try New UI
                  </Button>
                </div>
                <CookingInstructions
                  recipeName={recipeName}
                  containers={containers}
                  recipeSteps={recipeSteps}
                  onBack={() => {}}
                  onAddStep={addRecipeStep}
                  onUpdateStep={updateRecipeStep}
                  onRemoveStep={removeRecipeStep}
                  onSaveRecipe={() => {}}
                  onInstructionsProcessed={handleInstructionsProcessed}
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 m-w-screen">
      <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-qzene-gradient transition-bg-color duration-500 rounded-lg shadow-md mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-8">
            {isEditing ? "Edit Recipe" : "Create New Recipe"}
          </h1>
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === 1 ? "bg-[#986CF5] text-white" : "bg-gray-200"
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5" /> : 1}
              </div>
              <div className="h-1 w-12 bg-gray-200 mt-4"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === 2
                    ? "bg-[#986CF5] text-white"
                    : currentStep > 2
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {currentStep > 2 ? <Check className="w-5 h-5" /> : 2}
              </div>
              <div className="h-1 w-12 bg-gray-200 mt-4"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep === 3 ? "bg-[#986CF5] text-white" : "bg-gray-200"
                }`}
              >
                3
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              Step {currentStep}:{" "}
              {currentStep === 1
                ? "Basic Information"
                : currentStep === 2
                ? "Add Ingredients"
                : "Create Instructions"}
            </div>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {recipeData.name || (isEditing ? "Edit Recipe" : "New Recipe")}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 &&
                `Fill in the details of your ${
                  isEditing ? "recipe" : "new recipe"
                } below`}
              {currentStep === 2 && "Drag ingredients to create your recipe"}
              {currentStep === 3 &&
                "Add detailed instructions for preparing your recipe"}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              {currentStep < 3 ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/recipes")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#986CF5] hover:bg-[#986CF5]/90 flex items-center"
                    onClick={goToNextStep}
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="bg-[#986CF5] hover:bg-[#986CF5]/90"
                  onClick={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading
                    ? isEditing
                      ? "Updating..."
                      : "Saving..."
                    : isEditing
                    ? "Update Recipe"
                    : "Save Recipe"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateRecipe;
