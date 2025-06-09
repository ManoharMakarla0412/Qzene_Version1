const EnumValue = require('../../models/admin/enumvalue.model');
const { sendResponse, sendError } = require('../../utils/response');

const createEnum = async (req, res) => {
  try {
    const { category, value } = req.body;
    const enumValue = await EnumValue.create({ category, value, createdBy: req.user._id }); // Use _id
    sendResponse(res, enumValue, 'Enum created', 201);
  } catch (error) {
    console.error('Error in createEnum:', error.message);
    sendError(res, error.message, 400);
  }
};

const getEnumsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const enums = await EnumValue.find({ category }).select('value category');
    sendResponse(res, enums, 'Enums fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const deleteEnum = async (req, res) => {
  try {
    const enumValue = await EnumValue.findByIdAndDelete(req.params.id);
    if (!enumValue) return sendError(res, 'Enum not found', 404);
    sendResponse(res, null, 'Enum deleted');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await EnumValue.distinct('category');
    if (categories.length === 0) {
      return sendResponse(res, [], 'No categories found');
    }
    sendResponse(res, categories, 'Categories fetched');
  } catch (error) {
    console.error('Error in getAllCategories:', error.message);
    sendError(res, error.message, 500);
  }
};

const getAllEnums = async (req, res) => {
  try {
    const enums = await EnumValue.find().select('category value createdBy createdAt').lean();
    if (enums.length === 0) {
      return sendResponse(res, [], 'No enums found');
    }
    sendResponse(res, enums, 'Enums fetched');
  } catch (error) {
    console.error('Error in getAllEnums:', error.message);
    sendError(res, error.message, 500);
  }
};

module.exports = { createEnum, getEnumsByCategory, deleteEnum, getAllCategories,getAllEnums };