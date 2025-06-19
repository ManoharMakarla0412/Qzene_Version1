const express = require('express');
const router = express.Router();
const {
  createEnum,
  getEnumsByCategory,
  deleteEnum,
  getAllCategories,
  getAllEnums,
  updateEnum,
  updateCategory
} = require('../../controllers/admin/enum.controller');
const {auth} = require('../../middleware/auth.middleware');
const adminRole = require('../../middleware/adminrole.middleware');

/**
 * @swagger
 * tags:
 *   name: Enums
 *   description: Enum management APIs for admin
 */

/**
 * @swagger
 * /api/v1/admin/enums:
 *   post:
 *     summary: Create a new enum value
 *     tags: [Enums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - value
 *             properties:
 *               category:
 *                 type: string
 *                 example: unit
 *               value:
 *                 type: string
 *                 example: grams
 *     responses:
 *       201:
 *         description: Enum created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Enum created
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     category:
 *                       type: string
 *                     value:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation error
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 */

/**
 * @swagger
 * /api/v1/admin/enums/{category}:
 *   get:
 *     summary: Get enum values by category
 *     tags: [Enums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         example: unit
 *     responses:
 *       200:
 *         description: Enums fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Enums fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/admin/enums/categories/all:
 *   get:
 *     summary: Get all unique enum categories
 *     tags: [Enums]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Categories fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: unit
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/admin/enums/enums/all:
 *   get:
 *     summary: Get all enum values
 *     tags: [Enums]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enums fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Enums fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       category:
 *                         type: string
 *                       value:
 *                         type: string
 *                       createdBy:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/admin/enums/{id}:
 *   delete:
 *     summary: Delete an enum value
 *     tags: [Enums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Enum deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Enum deleted
 *                 data:
 *                   type: null
 *       404:
 *         description: Enum not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Enum not found
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */


/*
 * @swagger
 * /api/v1/admin/enums/{id}:
 *   put:
 *     summary: Update an enum value
 *     tags: [Enums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: unit
 *                 description: Optional - update category
 *               value:
 *                 type: string
 *                 example: kilograms
 *                 description: Optional - update value
 *     responses:
 *       200:
 *         description: Enum updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Enum updated
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     category:
 *                       type: string
 *                     value:
 *                       type: string
 *                     updatedBy:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation error
 *       404:
 *         description: Enum not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Enum not found
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authenticated
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin access required
 */

/**
 * @swagger
 * /api/v1/admin/enums/categories/update:
 *   put:
 *     summary: Update category name for all enum values
 *     description: Updates all enum values from one category to another category name. This is a bulk operation that affects all enums with the specified old category.
 *     tags: [Enums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldCategory
 *               - newCategory
 *             properties:
 *               oldCategory:
 *                 type: string
 *                 example: unit
 *                 description: The current category name to be updated
 *               newCategory:
 *                 type: string
 *                 example: measurement_unit
 *                 description: The new category name to replace the old one
 *           examples:
 *             rename_unit_category:
 *               summary: Rename unit category
 *               value:
 *                 oldCategory: "unit"
 *                 newCategory: "measurement_unit"
 *             update_status_category:
 *               summary: Update status category
 *               value:
 *                 oldCategory: "status"
 *                 newCategory: "item_status"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Category updated from 'unit' to 'measurement_unit'"
 *                 data:
 *                   type: object
 *                   properties:
 *                     modifiedCount:
 *                       type: integer
 *                       example: 5
 *                       description: Number of enum values that were updated
 *                     oldCategory:
 *                       type: string
 *                       example: unit
 *                       description: The original category name
 *                     newCategory:
 *                       type: string
 *                       example: measurement_unit
 *                       description: The new category name
 *             examples:
 *               successful_update:
 *                 summary: Successful category update
 *                 value:
 *                   success: true
 *                   message: "Category updated from 'unit' to 'measurement_unit'"
 *                   data:
 *                     modifiedCount: 5
 *                     oldCategory: "unit"
 *                     newCategory: "measurement_unit"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   message: "Both oldCategory and newCategory are required"
 *               same_categories:
 *                 summary: Same category names provided
 *                 value:
 *                   success: false
 *                   message: "Old and new categories cannot be the same"
 *       404:
 *         description: Old category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Old category not found"
 *       401:
 *         description: Unauthorized - authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authenticated"
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin access required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post('/', auth, adminRole, createEnum);
router.get('/:category', auth, adminRole, getEnumsByCategory);
router.get('/categories/all', auth, adminRole, getAllCategories);
router.get('/enums/all', auth, adminRole, getAllEnums);
router.put('/:id', auth, adminRole, updateEnum); // Add the PUT route
router.delete('/:id', auth, adminRole, deleteEnum);
router.put('/categories/update', auth, adminRole, updateCategory); // Add this route


module.exports = router;