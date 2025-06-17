const express = require("express");
const router = express.Router();
const recipeController = require("../../controllers/admin/recipe.controller");
const { auth } = require("../../middleware/auth.middleware");
const uploadImage = require("../../middleware/upload.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         description: { type: string }
 *         ingredients: { type: string }
 *         instructions: { type: string }
 *         cookingTime: { type: integer }
 *         difficulty: { type: string, enum: [Easy, Medium, Hard] }
 *         cuisine_type: { type: string }
 *         category: { type: string }
 *         recipe_type: { type: string }
 *         price: { type: number }
 *         user_id: { type: string }
 *         recipe_json:
 *           type: object
 *           properties:
 *             name: { type: string }
 *             description: { type: string }
 *             category: { type: string }
 *             difficulty: { type: string }
 *             cookingTime: { type: integer }
 *             cuisine_type: { type: string }
 *             recipe_type: { type: string }
 *             price: { type: number }
 *             image_url: { type: string }
 *             servingSize: { type: integer }
 *             containers: { type: array, items: { type: object } }
 *             steps: { type: array, items: { type: object } }
 *             instructions_array: { type: array, items: { type: object } }
 *             openai_generated_content:
 *              type: object
 *              properties:
 *              instructions: { type: string }
 *              nutrition:
 *               type: object
 *               properties:
 *                 protein: { type: number }
 *                 calories: { type: number }
 *                 carbs: { type: number }
 *                 fat: { type: number }
 *         image: { type: string }
 *         status: { type: string, enum: [pending, approved, rejected] }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 */

/**
 * @swagger
 * /api/v1/admin/recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recipes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Server error
 */
router.get("/", auth, recipeController.getAllRecipes);

/**
 * @swagger
 * /api/v1/admin/recipes/pending:
 *   get:
 *     summary: Get pending recipes
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending recipes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Server error
 */
router.get("/pending", auth, recipeController.getPendingRecipes);

/**
 * @swagger
 * /api/v1/admin/recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - ingredients
 *               - instructions
 *               - cookingTime
 *               - cuisine_type
 *               - category
 *               - recipe_type
 *               - user_id
 *               - recipe_json
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               ingredients: { type: string }
 *               instructions: { type: string }
 *               cookingTime: { type: integer }
 *               difficulty: { type: string, enum: [Easy, Medium, Hard] }
 *               cuisine_type: { type: string }
 *               category: { type: string }
 *               recipe_type: { type: string }
 *               price: { type: number }
 *               user_id: { type: string }
 *               recipe_json: { type: object }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Recipe' }
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/", auth, uploadImage, recipeController.createRecipe);

/**
 * @swagger
 * /api/v1/admin/recipes/{id}:
 *   put:
 *     summary: Update an existing recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - ingredients
 *               - instructions
 *               - cookingTime
 *               - cuisine_type
 *               - category
 *               - recipe_type
 *               - user_id
 *               - recipe_json
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               ingredients: { type: string }
 *               instructions: { type: string }
 *               cookingTime: { type: integer }
 *               difficulty: { type: string, enum: [Easy, Medium, Hard] }
 *               cuisine_type: { type: string }
 *               category: { type: string }
 *               recipe_type: { type: string }
 *               price: { type: number }
 *               user_id: { type: string }
 *               recipe_json: { type: object }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Recipe' }
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Recipe not found or user not authorized
 *       500:
 *         description: Server error
 */
router.put("/:id", auth, uploadImage, recipeController.updateRecipe);

/**
 * @swagger
 * /api/v1/admin/recipes/{id}/verify:
 *   post:
 *     summary: Verify a recipe (approve/reject)
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status: { type: string, enum: [approved, rejected] }
 *     responses:
 *       200:
 *         description: Recipe verification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Recipe' }
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.post("/:id/verify", auth, recipeController.verifyRecipe);

/**
 * @swagger
 * /api/v1/admin/recipes/{recipeId}/generate-details:
 *   post:
 *     summary: Generate cooking instructions and nutritional information using Open AI
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe ID
 *     responses:
 *       200:
 *         description: Recipe details generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data: { $ref: '#/components/schemas/Recipe' }
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:recipeId/generate-details",
  auth,
  recipeController.generateRecipeDetails
);


/**
 * @swagger
 * /api/v1/admin/recipes/{recipeId}/save-content:
 *   put:
 *     summary: Update OpenAI generated content for a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the recipe to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - openai_generated_content
 *             properties:
 *               openai_generated_content:
 *                 type: object
 *                 required:
 *                   - instructions
 *                   - nutrition
 *                 properties:
 *                   instructions:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["Preheat oven to 350°F", "Mix ingredients in bowl"]
 *                   nutrition:
 *                     type: object
 *                     required:
 *                       - protein
 *                       - calories
 *                       - carbs
 *                       - fat
 *                     properties:
 *                       protein:
 *                         type: number
 *                         example: 25
 *                       calories:
 *                         type: number
 *                         example: 350
 *                       carbs:
 *                         type: number
 *                         example: 40
 *                       fat:
 *                         type: number
 *                         example: 12
 *     responses:
 *       200:
 *         description: Generated content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:recipeId/save-content',
  auth,
  recipeController.updateGeneratedContent
);


module.exports = router;
