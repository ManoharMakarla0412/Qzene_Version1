import { useState, useEffect } from "react";
import { RecipeStep, Ingredient, InstructionStep } from "@/types/recipeMaker";
import { Instruction } from "@/types/instruction";

interface UseInstructionsProps {
  recipeSteps: RecipeStep[];
  currentStep: number;
  onUpdateStep?: (id: number, updates: Partial<RecipeStep>) => void;
}

export const useInstructions = ({
  recipeSteps = [], // Provide default empty array
  currentStep,
  onUpdateStep,
}: UseInstructionsProps) => {
  const [draggingInstruction, setDraggingInstruction] = useState<Instruction | null>(null);
  const [draggingIngredient, setDraggingIngredient] = useState<Ingredient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<Instruction | Ingredient | null>(null);
  const [itemType, setItemType] = useState<'instruction' | 'ingredient' | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [units, setUnits] = useState<string>("gm");
  const [instructions, setInstructions] = useState<Instruction[]>([]);

  // Get current step data with proper null checking
  const currentStepData = (recipeSteps && recipeSteps.length > 0 && currentStep > 0) 
    ? recipeSteps[currentStep - 1] 
    : null;

  const safeCurrentStepData = currentStepData || {
    id: 0,
    description: "",
    time: 0,
    temperature: 0,
  };

  // Fetch instructions from API
  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/v1/admin/enums/Instructions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication, if needed
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch instructions");
        }

        const fetchedInstructions: Instruction[] = data.data.map((item: any) => ({
          id: item._id,
          name: item.value,
          image_url: null, // API doesn't provide image_url; set to null
        }));

        setInstructions(fetchedInstructions);
      } catch (error) {
        console.error("Error fetching instructions:", error);
        // Optionally, use a toast notification for user feedback
        // toast({ title: "Error fetching instructions", description: error.message, variant: "destructive" });
      }
    };

    fetchInstructions();
  }, []);

  // Handle dragging instruction start
  const handleDragInstructionStart = (e: React.DragEvent, instruction: Instruction) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: "instruction", data: instruction }));
    setDraggingInstruction(instruction);
  };

  // Handle dragging ingredient start
  const handleDragIngredientStart = (e: React.DragEvent, ingredient: Ingredient) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ type: "ingredient", data: ingredient }));
    setDraggingIngredient(ingredient);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop on instructions area
  const handleDropOnInstructions = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");

    try {
      const parsedData = JSON.parse(data);

      if (parsedData.type === "instruction") {
        const instruction = parsedData.data as Instruction;
        // Open dialog for instructions
        setItemToAdd(instruction);
        setItemType("instruction");
        setDialogOpen(true);
      } else if (parsedData.type === "ingredient") {
        const ingredient = parsedData.data as Ingredient;
        // Open dialog for ingredients
        setItemToAdd(ingredient);
        setItemType("ingredient");
        setQuantity(ingredient.quantity?.toString() || "1");
        setUnits(ingredient.units || "gm");
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Error dropping item:", error);
    }

    setDraggingInstruction(null);
    setDraggingIngredient(null);
  };

  // Add instruction to current step
  const addInstructionToStep = (instruction: Instruction) => {
    if (onUpdateStep && safeCurrentStepData.id) {
      const currentDescription = safeCurrentStepData.description || "";
      const newDescription =
        currentDescription + (currentDescription ? "\n" : "") + instruction.name;

      // Create structured instruction data with step number to match InstructionStep type
      const instructionStep: InstructionStep = {
        step: currentStep,
        instruction: instruction.name,
        raw: instruction.name,
        image_url: instruction.image_url || null,
        quantity: null,
        units: null,
      };

      // Get existing instructions array or create a new one
      const existingInstructions = safeCurrentStepData.additionalData?.instructions?.Instructions || [];
      const updatedInstructions = [...existingInstructions, instructionStep];

      // Update step with both text description and structured data
      onUpdateStep(safeCurrentStepData.id, {
        description: newDescription,
        additionalData: {
          instructions: {
            Instructions: updatedInstructions,
          },
        },
      });

      console.log(`Added instruction to step ${safeCurrentStepData.id}:`, instruction.name);
      console.log(`Updated instructions array:`, updatedInstructions);
    }
  };

  // Add ingredient to current step
  const addIngredientToStep = (ingredient: Ingredient, quantity?: string, units?: string) => {
    if (onUpdateStep && safeCurrentStepData.id) {
      const currentDescription = safeCurrentStepData.description || "";
      const ingredientText = `Add ${ingredient.name}${quantity ? ` (${quantity}${units || ""})` : ""}`;

      const newDescription = currentDescription + (currentDescription ? "\n" : "") + ingredientText;

      // Create structured ingredient instruction data including step number to match InstructionStep type
      const instructionStep: InstructionStep = {
        step: currentStep,
        instruction: ingredientText,
        raw: `Add ${ingredient.name}`,
        image_url: ingredient.image_url || null,
        quantity: quantity || null,
        units: units || null,
      };

      // Get existing instructions array or create a new one
      const existingInstructions = safeCurrentStepData.additionalData?.instructions?.Instructions || [];
      const updatedInstructions = [...existingInstructions, instructionStep];

      // Update step with both text description and structured data
      onUpdateStep(safeCurrentStepData.id, {
        description: newDescription,
        additionalData: {
          instructions: {
            Instructions: updatedInstructions,
          },
        },
      });

      console.log(`Added ingredient to step ${safeCurrentStepData.id}:`, ingredientText);
      console.log(`Updated instructions array:`, updatedInstructions);
    }
  };

  // Handle add button click in dialog
  const handleAddItemFromDialog = () => {
    if (itemType === "instruction" && itemToAdd) {
      addInstructionToStep(itemToAdd as Instruction);
    } else if (itemType === "ingredient" && itemToAdd) {
      addIngredientToStep(itemToAdd as Ingredient, quantity, units);
    }

    // Reset and close dialog
    setDialogOpen(false);
    setItemToAdd(null);
    setItemType(null);
    setQuantity("");
  };

  // Remove an instruction from current step
  const handleRemoveInstruction = (instructionText: string) => {
    if (onUpdateStep && safeCurrentStepData.id && safeCurrentStepData.description) {
      const instructions = safeCurrentStepData.description.split("\n");
      const filteredInstructions = instructions.filter(
        (instruction) => instruction !== instructionText
      );
      const newDescription = filteredInstructions.join("\n");

      // Also update the structured instructions data
      const existingInstructions = safeCurrentStepData.additionalData?.instructions?.Instructions || [];
      const updatedInstructions = existingInstructions.filter(
        (instr) => instr.instruction !== instructionText
      );

      onUpdateStep(safeCurrentStepData.id, {
        description: newDescription,
        additionalData: {
          instructions: {
            Instructions: updatedInstructions,
          },
        },
      });

      console.log(`Removed instruction from step ${safeCurrentStepData.id}:`, instructionText);
      console.log(`Updated instructions array:`, updatedInstructions);
    }
  };

  // Extract all instructions from all steps
  const getAllInstructions = () => {
    if (!recipeSteps || recipeSteps.length === 0) {
      return [];
    }

    let allInstructions: InstructionStep[] = [];
    let stepCounter = 1;

    recipeSteps.forEach((step) => {
      if (step.additionalData?.instructions?.Instructions) {
        step.additionalData.instructions.Instructions.forEach((instrObj) => {
          // Ensure the instruction object conforms to InstructionStep type
          allInstructions.push({
            step: stepCounter++,
            instruction: instrObj.instruction,
            quantity: instrObj.quantity || null,
            units: instrObj.units || null,
            raw: instrObj.raw || null,
            image_url: instrObj.image_url || null,
          });
        });
      }
    });

    return allInstructions;
  };

  return {
    instructions, // Expose fetched instructions
    draggingInstruction,
    draggingIngredient,
    dialogOpen,
    setDialogOpen,
    itemToAdd,
    itemType,
    quantity,
    setQuantity,
    units,
    setUnits,
    currentStepData: safeCurrentStepData,
    handleDragInstructionStart,
    handleDragIngredientStart,
    handleDragOver,
    handleDropOnInstructions,
    handleAddItemFromDialog,
    handleRemoveInstruction,
    getAllInstructions,
  };
};