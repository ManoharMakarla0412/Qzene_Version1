const { sendResponse, sendError } = require('../../utils/response');
const { getPagination } = require('../../utils/pagination');
const { StatusCodes } = require('http-status-codes');
const Ingredient = require('../../models/admin/ingredient.model');
/**
 * Convert a string to camelCase
 */
const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};


const createIngredient = async (req, res) => {
  try {
    const { name, type, image } = req.body;

    const camelCaseName = toCamelCase(name);

    const ingredient = await Ingredient.create({
      name: camelCaseName,
      type,
      image, // Secure URL from Cloudinary
      createdBy: req.user._id, // From auth middleware
    });

    sendResponse(res, ingredient, 'Ingredient created', StatusCodes.CREATED);
  } catch (error) {
    sendError(res, error.message, StatusCodes.BAD_REQUEST);
  }
};

const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find()
      .populate('createdBy', 'profile.name') // Populate createdBy with profile.name
      .lean(); // Convert to plain JavaScript object for easier manipulation

    // Map the ingredients to include createdBy as a string (name)
    const formattedIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      createdBy: ingredient.createdBy && ingredient.createdBy.profile && ingredient.createdBy.profile.name 
        ? ingredient.createdBy.profile.name 
        : 'Unknown', // Fallback if user or profile.name not found
    }));

    sendResponse(res, formattedIngredients, 'Ingredients fetched');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

const updateIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ingredient) return sendError(res, 'Ingredient not found', 404);
    sendResponse(res, ingredient, 'Ingredient updated');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return sendError(res, 'Ingredient not found', 404);
    sendResponse(res, null, 'Ingredient deleted');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

module.exports = { createIngredient, getIngredients, updateIngredient, deleteIngredient };