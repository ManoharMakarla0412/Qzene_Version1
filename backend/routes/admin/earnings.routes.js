const express = require('express');
const router = express.Router();
const { getTotalEarnings, getChefEarnings, getChefEarningsById } = require('../../controllers/admin/earnings.controller');
const {auth} = require('../../middleware/auth.middleware');
const adminRole = require('../../middleware/adminrole.middleware');

/**
 * @swagger
 * /api/v1/admin/earnings/total:
 *   get:
 *     summary: Get total platform earnings
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total earnings fetched
 * /api/v1/admin/earnings/chefs:
 *   get:
 *     summary: List earnings per chef with pagination
 *     tags: [Earnings]
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
 *         description: Chef earnings fetched
 * /api/v1/admin/earnings/chefs/{id}:
 *   get:
 *     summary: Get earnings for a specific chef
 *     tags: [Earnings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Chef earnings fetched
 */
router.get('/total', auth, adminRole, getTotalEarnings);
router.get('/chefs', auth, adminRole, getChefEarnings);
router.get('/chefs/:id', auth, adminRole, getChefEarningsById);

module.exports = router;