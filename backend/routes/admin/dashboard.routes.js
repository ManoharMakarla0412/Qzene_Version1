const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../../controllers/admin/dashboard.controller');
const {auth} = require('../../middleware/auth.middleware');
const adminRole = require('../../middleware/adminrole.middleware');

/**
 * @swagger
 * /api/v1/admin/dashboard/metrics:
 *   get:
 *     summary: Get admin dashboard metrics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRecipes: { type: number }
 *                     totalOrders: { type: number }
 *                     totalRevenue: { type: number }
 *                     activeChefs: { type: number }
 *                     revenueTrends: { type: array }
 *                     popularRecipes: { type: array }
 *                     topChefs: { type: array }
 */
router.get('/metrics', auth, adminRole, getDashboardMetrics);

module.exports = router;    