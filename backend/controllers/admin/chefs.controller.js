const { User } = require('mongoose').models;
const { sendResponse, sendError } = require('../../utils/response');
const { getPagination } = require('../../utils/pagination');

const getChefs = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { skip, limitNum } = getPagination(page, limit);

    const chefs = await User.find({ roles: 'chef' })
      .skip(skip)
      .limit(limitNum)
      .select('username profile chefProfile status');
    const total = await User.countDocuments({ roles: 'chef' });

    sendResponse(res, { chefs, total, page, limit: limitNum }, 'Chefs fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const getChefById = async (req, res) => {
  try {
    const chef = await User.findById(req.params.id).select('username profile chefProfile status');
    if (!chef) return sendError(res, 'Chef not found', 404);
    sendResponse(res, chef, 'Chef details fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const suspendChef = async (req, res) => {
  try {
    const chef = await User.findByIdAndUpdate(req.params.id, { status: 'banned' }, { new: true });
    if (!chef) return sendError(res, 'Chef not found', 404);
    sendResponse(res, chef, 'Chef suspended');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const activateChef = async (req, res) => {
  try {
    const chef = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!chef) return sendError(res, 'Chef not found', 404);
    sendResponse(res, chef, 'Chef activated');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const promoteChef = async (req, res) => {
  try {
    const chef = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { roles: 'admin' } },
      { new: true }
    );
    if (!chef) return sendError(res, 'Chef not found', 404);
    sendResponse(res, chef, 'Chef promoted to admin');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { getChefs, getChefById, suspendChef, activateChef, promoteChef };