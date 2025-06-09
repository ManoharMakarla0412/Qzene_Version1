const express = require('express');
const router = express.Router();
const { getPayments } = require('../../controllers/admin/payment.controller');
const {auth} = require('../../middleware/auth.middleware');
const adminRole = require('../../middleware/adminrole.middleware');

/**
 * @swagger
 * /api/v1/admin/payments:
 *   get:
 *     summary: List all payments with filters and pagination
 *     tags: [Payments]
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
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: dateFrom
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: dateTo
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: amountMin
 *         schema: { type: number }
 *       - in: query
 *         name: amountMax
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Payments fetched
 */
router.get('/', auth, adminRole, getPayments);

module.exports = router;