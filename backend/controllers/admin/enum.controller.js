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

const updateEnum = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, value } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    if (category) updateData.category = category;
    if (value) updateData.value = value;
    
    // Add updatedBy and updatedAt fields
    updateData.updatedBy = req.user._id;
    updateData.updatedAt = new Date();
    
    const enumValue = await EnumValue.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('category value updatedBy updatedAt');
    
    if (!enumValue) {
      return sendError(res, 'Enum not found', 404);
    }
    
    sendResponse(res, enumValue, 'Enum updated');
  } catch (error) {
    console.error('Error in updateEnum:', error.message);
    sendError(res, error.message, 400);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { oldCategory, newCategory } = req.body;
    
    if (!oldCategory || !newCategory) {
      return sendError(res, 'Both oldCategory and newCategory are required', 400);
    }
    
    if (oldCategory === newCategory) {
      return sendError(res, 'Old and new categories cannot be the same', 400);
    }
    
    // Check if old category exists
    const existingEnums = await EnumValue.find({ category: oldCategory });
    if (existingEnums.length === 0) {
      return sendError(res, 'Old category not found', 404);
    }
    
    // Update all enums with the old category
    const result = await EnumValue.updateMany(
      { category: oldCategory },
      { 
        category: newCategory,
        updatedBy: req.user._id,
        updatedAt: new Date()
      }
    );
    
    sendResponse(res, {
      modifiedCount: result.modifiedCount,
      oldCategory,
      newCategory
    }, `Category updated from '${oldCategory}' to '${newCategory}'`);
    
  } catch (error) {
    console.error('Error in updateCategory:', error.message);
    sendError(res, error.message, 500);
  }
};

module.exports = { createEnum, getEnumsByCategory, deleteEnum, getAllCategories,getAllEnums, updateEnum, updateCategory };