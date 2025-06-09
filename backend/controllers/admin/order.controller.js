const { Purchase } = require('mongoose').models;
const { sendResponse, sendError } = require('../../utils/response');
const { getPagination } = require('../../utils/pagination');

const getOrders = async (req, res) => {
  try {
    const { page, limit, dateFrom, dateTo } = req.query;
    const { skip, limitNum } = getPagination(page, limit);
    const query = {};
    if (dateFrom && dateTo) {
      query.purchaseDate = { $gte: new Date(dateFrom), $lte: new Date(dateTo) };
    }

    const orders = await Purchase.find(query)
      .skip(skip)
      .limit(limitNum)
      .populate('recipeId', 'title')
      .populate('buyerId', 'username')
      .select('recipeId buyerId price purchaseDate paymentStatus');
    const total = await Purchase.countDocuments(query);

    sendResponse(res, { orders, total, page, limit: limitNum }, 'Orders fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getOrders };