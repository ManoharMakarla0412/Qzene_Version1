const { Purchase } = require('mongoose').models;
const { sendResponse, sendError } = require('../../utils/response');
const { getPagination } = require('../../utils/pagination');

const getPayments = async (req, res) => {
  try {
    const { page, limit, status, dateFrom, dateTo, amountMin, amountMax } = req.query;
    const { skip, limitNum } = getPagination(page, limit);
    const query = {};
    if (status) query.paymentStatus = status;
    if (dateFrom && dateTo) query.purchaseDate = { $gte: new Date(dateFrom), $lte: new Date(dateTo) };
    if (amountMin && amountMax) query.price = { $gte: amountMin, $lte: amountMax };

    const payments = await Purchase.find(query)
      .skip(skip)
      .limit(limitNum)
      .populate('recipeId', 'title')
      .populate('buyerId', 'username')
      .select('recipeId buyerId price currency paymentStatus purchaseDate');
    const total = await Purchase.countDocuments(query);

    sendResponse(res, { payments, total, page, limit: limitNum }, 'Payments fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getPayments };