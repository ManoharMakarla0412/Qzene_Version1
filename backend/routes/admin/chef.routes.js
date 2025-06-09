const express = require('express');
const router = express.Router();
const { getChefs, getChefById, suspendChef, activateChef, promoteChef } = require('../../controllers/admin/chefs.controller');
const {auth} = require('../../middleware/auth.middleware');
const adminRole = require('../../middleware/adminrole.middleware');

/**
 * @swagger
 * /api/v1/admin/chefs:
 *   get:
 *     summary: List all chefs with pagination
 *     tags: [Chefs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Chefs fetched
 * /api/v1/admin/chefs/{id}:
 *   get:
 *     summary: Get chef details by ID
 *     tags: [Chefs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chef details fetched
 * /api/v1/admin/chefs/{id}/suspend:
 *   patch:
 *     summary: Suspend a chef
 *     tags: [Chefs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chef suspended
 * /api/v1/admin/chefs/{id}/activate:
 *   patch:
 *     summary: Activate a chef
 *     tags: [Chefs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chef activated
 * /api/v1/admin/chefs/{id}/promote:
 *   patch:
 *     summary: Promote a chef to admin
 *     tags: [Chefs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chef promoted to admin
 */
router.get('/', auth, adminRole, getChefs);
router.get('/:id', auth, adminRole, getChefById);
router.patch('/:id/suspend', auth, adminRole, suspendChef);
router.patch('/:id/activate', auth, adminRole, activateChef);
router.patch('/:id/promote', auth, adminRole, promoteChef);

module.exports = router;