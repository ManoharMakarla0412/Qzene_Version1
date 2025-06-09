const express = require('express');
const { 
  createRecipe, 
  getRecipe, 
  updateRecipe, 
  getAllRecipes,
  updateRecipeStatus, 
  deleteRecipe
} = require('../../controllers/recipe.controller');

const router = express.Router();

router.get('/recipes', getAllRecipes);
router.post('/recipes', createRecipe);
router.get('/recipes/:id', getRecipe);
router.put('/recipes/:id', updateRecipe);
router.patch('/recipes/:id/status', updateRecipeStatus);
router.delete('/recipes', deleteRecipe); // 👈 add this route

module.exports = router;