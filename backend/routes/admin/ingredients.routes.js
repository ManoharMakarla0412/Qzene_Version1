const express = require('express');
const router = express.Router();
const { createIngredient, getIngredients, updateIngredient, deleteIngredient } = require('../../controllers/admin/ingredient.controller');
const {auth} = require('../../middleware/auth.middleware');
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
 *             properties:
 *               name: { type: string }
 *               type: { type: string }
 *               image: { type: string }
 *     responses:
 *       201:
 *         description: Ingredient created
 *   get:
 *     summary: List ingredients with filters and pagination
 *     tags: [Ingredients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ingredients fetched
 */
router.post('/', auth, adminRole, uploadImage,  createIngredient);
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               type: { type: string }
 *               image: { type: 'string' }
 *     responses:
 *       200:
 *         description: Ingredient updated
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
 *     responses:
 *       200:
 *         description: Ingredient deleted
 */
router.put('/:id', auth, adminRole, updateIngredient);
router.delete('/:id', auth, adminRole, deleteIngredient);

module.exports = router;