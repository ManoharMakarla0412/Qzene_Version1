const Recipe = require("../../models/admin/adminrecipe.model");
const openAIService = require('../../services/openai.service');

exports.generateRecipeDetails = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await Recipe.findById(recipeId);
    
    console.log('Recipe found:', recipe);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    const result = await openAIService.generateRecipeDetails(recipe); 
    console.log('OpenAI result:', result);

    recipe.openai_generated_content = {
      instructions: result.instructions,
      nutrition: {
        protein: result.nutrition.protein || 0,
        calories: result.nutrition.calories || 0,
        carbs: result.nutrition.carbs || 0,
        fat: result.nutrition.fat || 0,
      },
    };
    
    await recipe.save();

    return res.status(200).json({
      success: true,
      message: 'Recipe details generated successfully',
      data: recipe,
    });
  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// No changes needed for createRecipe, it is already correct.
exports.createRecipe = async (req, res) => {
  try {

    if (!req.body.recipe) {
      console.error('Recipe field missing in request body');
      return res.status(400).json({ 
        success: false, 
        message: "Recipe data is missing in the form-data",
      });
    }

    let recipePayload;
    try {
      recipePayload = JSON.parse(req.body.recipe);
    } catch (error) {
      console.error('Error parsing recipe JSON:', error);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid recipe JSON format' 
      });
    }
    const {
      name,
      description,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      cuisine_type,
      category,
      recipe_type,
      price,
      user_id,
      recipe_json,
    } = recipePayload;


    if (
      !name || !ingredients || !instructions || !cookingTime || !cuisine_type ||
      !category || !recipe_type || !user_id || !recipe_json
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields in recipe data" });
    }

    if (req.user.id !== user_id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const recipe = new Recipe({
      name,
      description,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      cuisine_type,
      category,
      recipe_type,
      price,
      user_id,
      recipe_json,
      image: req.body.image || null, // Use image from middleware
    });

    await recipe.save();

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create recipe",
    });
  }
};

// FIX: Rewritten updateRecipe to handle multipart/form-data
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if recipe data is present
    if (!req.body.recipe) {
      return res.status(400).json({ 
        success: false, 
        message: "Recipe data is missing in the form-data for update.",
      });
    }

    let recipePayload;
    try {
      recipePayload = JSON.parse(req.body.recipe);
    } catch (error) {
      console.error('Error parsing recipe JSON for update:', error);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid recipe JSON format for update.' 
      });
    }

    const {
      name,
      description,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      cuisine_type,
      category,
      recipe_type,
      price,
      user_id,
      recipe_json,
    } = recipePayload;

    if (
      !name || !ingredients || !instructions || !cookingTime || !cuisine_type ||
      !category || !recipe_type || !user_id || !recipe_json
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // First, find the recipe to ensure it exists and the user is authorized
    const existingRecipe = await Recipe.findById(id);

    if (!existingRecipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    // Authorization check
    if (existingRecipe.user_id.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: "Unauthorized to update this recipe" });
    }
    
    // Build the update object
    const updateData = {
      name,
      description,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      cuisine_type,
      category,
      recipe_type,
      price,
      recipe_json,
      updated_at: Date.now(),
    };
    
    // If a new image was uploaded, the middleware puts its URL in req.body.image
    if (req.body.image) {
      updateData.image = req.body.image;
    } else {
        console.log('No new image provided for update. Retaining existing image.');
        // If no new image, the existing image URL remains untouched.
    }

    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid recipe ID format' });
    }
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update recipe",
    });
  }
};


exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json({
      success: true,
      message: "Recipes fetched successfully",
      data: recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch recipes",
    });
  }
};

// Get pending recipes
exports.getPendingRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: 'pending' })
      .select('-__v')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      message: "Pending recipes fetched successfully",
      data: recipes,
    });
  } catch (error) {
    console.error("Error fetching pending recipes:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch pending recipes",
    });
  }
};

// Verify recipe (approve/reject)
exports.verifyRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be either 'approve' or 'reject'"
      });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    
    const recipe = await Recipe.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Recipe ${action}d successfully`,
      data: recipe
    });
  } catch (error) {
    console.error("Error verifying recipe:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify recipe"
    });
  }
};