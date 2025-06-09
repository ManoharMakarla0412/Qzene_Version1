const { Purchase, User } = require('mongoose').models;
const { sendResponse, sendError } = require('../../utils/response');
const { getPagination } = require('../../utils/pagination');

const getTotalEarnings = async (req, res) => {
  try {
    const total = await Purchase.aggregate([{ $group: { _id: null, total: { $sum: '$price' } } }]);
    sendResponse(res, { total: total[0]?.total || 0 }, 'Total earnings fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getChefEarnings = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip, limitNum } = getPagination(page, limit);

    const chefs = await User.find({ roles: 'chef' })
      .skip(skip)
      .limit(limitNum)
      .select('username chefProfile.totalEarnings');
    const total = await User.countDocuments({ roles: 'chef' });

    sendResponse(res, { chefs, total, page, limit: limitNum }, 'Chef earnings fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getChefEarningsById = async (req, res) => {
  try {
    const chef = await User.findById(req.params.id).select('username chefProfile.totalEarnings');
    if (!chef) return sendError(res, 'Chef not found', 404);
    sendResponse(res, chef, 'Chef earnings fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getTotalEarnings, getChefEarnings, getChefEarningsById };