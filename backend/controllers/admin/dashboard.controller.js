const { Purchase, Recipe, User } = require('mongoose').models;
const { sendResponse } = require('../../utils/response');
const { getPagination } = require('../../utils/pagination');

const getDashboardMetrics = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments({ status: 'active' });
    const totalOrders = await Purchase.countDocuments();
    const totalRevenue = await Purchase.aggregate([{ $group: { _id: null, total: { $sum: '$price' } } }]);
    const activeChefs = await User.countDocuments({ roles: 'chef', status: 'active' });

    const revenueTrends = await Purchase.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$purchaseDate' } }, total: { $sum: '$price' } } },
      { $sort: { _id: 1 } },
    ]);

    const popularRecipes = await Recipe.find({ status: 'active' })
      .sort({ viewCount: -1 })
      .limit(5)
      .select('title viewCount');

    const topChefs = await User.find({ roles: 'chef', status: 'active' })
      .sort({ 'chefProfile.totalEarnings': -1 })
      .limit(5)
      .select('username chefProfile.totalEarnings');

    sendResponse(res, {
      totalRecipes,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      activeChefs,
      revenueTrends,
      popularRecipes,
      topChefs,
    }, 'Dashboard metrics fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getDashboardMetrics };