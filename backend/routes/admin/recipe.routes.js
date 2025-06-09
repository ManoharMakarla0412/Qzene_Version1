const express = require('express');
const router = express.Router();
const recipeController = require('../../controllers/admin/recipe.controller');
const {auth} = require('../../middleware/auth.middleware');
const uploadImage = require('../../middleware/upload.middleware');
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
 *         application/json:
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               instructions:
 *                 type: string
 *               cookingTime:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *               cuisine_type:
 *                 type: string
 *               category:
 *                 type: string
 *               recipe_type:
 *                 type: string
 *               price:
 *                 type: number
 *               user_id:
 *                 type: string
 *               recipe_json:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   difficulty:
 *                     type: string
 *                   cookingTime:
 *                     type: integer
 *                   cuisine_type:
 *                     type: string
 *                   recipe_type:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image_url:
 *                     type: string
 *                   servingSize:
 *                     type: integer
 *                   containers:
 *                     type: array
 *                     items:
 *                       type: object
 *                   steps:
 *                     type: array
 *                     items:
 *                       type: object
 *                   instructions_array:
 *                     type: array
 *                     items:
 *                       type: object
 *                   step_instructions:
 *                     type: array
 *                     items:
 *                       type: object
 *     responses:
 *       201:
 *         description: Recipe created successfully
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
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

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
 *         application/json:
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               ingredients:
 *                 type: string
 *               instructions:
 *                 type: string
 *               cookingTime:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *                 enum: [Easy, Medium, Hard]
 *               cuisine_type:
 *                 type: string
 *               category:
 *                 type: string
 *               recipe_type:
 *                 type: string
 *               price:
 *                 type: number
 *               user_id:
 *                 type: string
 *               recipe_json:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   difficulty:
 *                     type: string
 *                   cookingTime:
 *                     type: integer
 *                   cuisine_type:
 *                     type: string
 *                   recipe_type:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image_url:
 *                     type: string
 *                   servingSize:
 *                     type: integer
 *                   containers:
 *                     type: array
 *                     items:
 *                       type: object
 *                   steps:
 *                     type: array
 *                     items:
 *                       type: object
 *                   instructions_array:
 *                     type: array
 *                     items:
 *                       type: object
 *                   step_instructions:
 *                     type: array
 *                     items:
 *                       type: object
 *     responses:
 *       200:
 *         description: Recipe updated successfully
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
 *         description: Missing required fields
 *       404:
 *         description: Recipe not found or user not authorized
 *       500:
 *         description: Server error
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
 *         difficulty: { type: string }
 *         cuisine_type: { type: string }
 *         category: { type: string }
 *         recipe_type: { type: string }
 *         price: { type: number }
 *         user_id: { type: string }
 *         recipe_json: { type: object }
 *         image: { type: string }
 *         created_at: { type: string, format: date-time }
 *         updated_at: { type: string, format: date-time }
 */

router.get('/', auth, recipeController.getAllRecipes);
router.post('/', auth, uploadImage, recipeController.createRecipe); 
router.put('/:id', auth, uploadImage, recipeController.updateRecipe);

module.exports = router;