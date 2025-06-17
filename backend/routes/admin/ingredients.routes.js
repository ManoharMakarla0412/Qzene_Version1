const express = require('express');
const router = express.Router();
const { createIngredient, getIngredients, updateIngredient, deleteIngredient } = require('../../controllers/admin/ingredient.controller');
const { auth } = require('../../middleware/auth.middleware');
const adminRole = require('../../middleware/adminrole.middleware');
const uploadImage = require('../../middleware/upload.middleware');

/**
 * @swagger
 * /api/v1/admin/ingredients:
 *   post:
 *     summary: Create a new ingredient
 *     tags: [Ingredients]
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
 *               - type
 *               - createdBy
 *             properties:
 *               name: { type: string, description: 'Unique ingredient name' }
 *               type: { type: string, description: 'Ingredient category (references EnumValue)' }
 *               image: { type: string, description: 'URL of ingredient image' }
 *               prep_method: { type: array, items: { type: string }, description: 'Optional preparation methods' }
 *               allergen: { type: array, items: { type: string }, description: 'Optional allergens' }
 *               nutrient: 
 *                 type: object
 *                 properties:
 *                   protein: { type: number }
 *                   calories: { type: number }
 *                   carbs: { type: number }
 *                   fat: { type: number }
 *                 description: 'Optional nutritional information'
 *               brand: { type: string, description: 'Optional brand name' }
 *               description: { type: string, description: 'Optional descriptive text' }
 *     responses:
 *       201:
 *         description: Ingredient created
 *       400:
 *         description: Bad request (e.g., duplicate name or invalid data)
 *   get:
 *     summary: List ingredients with filters and pagination
 *     tags: [Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: 'Page number for pagination'
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: 'Number of items per page'
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *         description: 'Filter by ingredient type'
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *         description: 'Filter by ingredient name (partial match)'
 *     responses:
 *       200:
 *         description: Ingredients fetched
 *       500:
 *         description: Server error
 */
router.post('/', auth, adminRole, uploadImage, createIngredient);
router.get('/', auth, adminRole, getIngredients);

/**
 * @swagger
 * /api/v1/admin/ingredients/{id}:
 *   put:
 *     summary: Update an ingredient
 *     tags: [Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: 'Ingredient ID'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, description: 'Unique ingredient name' }
 *               type: { type: string, description: 'Ingredient category (references EnumValue)' }
 *               image: { type: string, description: 'URL of ingredient image' }
 *               prep_method: { type: array, items: { type: string }, description: 'Optional preparation methods' }
 *               allergen: { type: array, items: { type: string }, description: 'Optional allergens' }
 *               nutrient: 
 *                 type: object
 *                 properties:
 *                   protein: { type: number }
 *                   calories: { type: number }
 *                   carbs: { type: number }
 *                   fat: { type: number }
 *                 description: 'Optional nutritional information'
 *               brand: { type: string, description: 'Optional brand name' }
 *               description: { type: string, description: 'Optional descriptive text' }
 *     responses:
 *       200:
 *         description: Ingredient updated
 *       400:
 *         description: Bad request (e.g., invalid data)
 *       404:
 *         description: Ingredient not found
 *   delete:
 *     summary: Delete an ingredient
 *     tags: [Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: 'Ingredient ID'
 *     responses:
 *       200:
 *         description: Ingredient deleted
 *       404:
 *         description: Ingredient not found
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, adminRole, uploadImage, updateIngredient); // Added uploadImage middleware
router.delete('/:id', auth, adminRole, deleteIngredient);

module.exports = router;