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
    const { name, type, image, prep_method, allergen, nutrient, brand, description } = req.body;

    const camelCaseName = toCamelCase(name);

    // Parse nutrient if it's a string (from FormData)
    let parsedNutrient = nutrient;
    if (typeof nutrient === 'string') {
      try {
        parsedNutrient = JSON.parse(nutrient);
      } catch (parseError) {
        return sendError(res, 'Invalid nutrient format', StatusCodes.BAD_REQUEST);
      }
    }

    const ingredient = await Ingredient.create({
      name: camelCaseName,
      type,
      image, // Secure URL from Cloudinary
      prep_method: prep_method ? JSON.parse(prep_method) : [], // Parse if string, default to empty array
      allergen: allergen ? JSON.parse(allergen) : [], // Parse if string, default to empty array
      nutrient: parsedNutrient || null, // Use parsed nutrient or null
      brand: brand || null,
      description: description || null,
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
    sendError(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const updateIngredient = async (req, res) => {
  try {
    const { name, type, image, prep_method, allergen, nutrient, brand, description } = req.body;

    // Convert name to camelCase if provided
    const updateData = {
      ...(name && { name: toCamelCase(name) }),
      ...(type && { type }),
      ...(image && { image }),
      ...(prep_method && { prep_method }),
      ...(allergen && { allergen }),
      ...(nutrient && { nutrient }),
      ...(brand && { brand }),
      ...(description && { description }),
    };

    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Ensure validators run
    );

    if (!ingredient) return sendError(res, 'Ingredient not found', StatusCodes.NOT_FOUND);
    sendResponse(res, ingredient, 'Ingredient updated');
  } catch (error) {
    sendError(res, error.message, StatusCodes.BAD_REQUEST);
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return sendError(res, 'Ingredient not found', StatusCodes.NOT_FOUND);
    sendResponse(res, null, 'Ingredient deleted');
  } catch (error) {
    sendError(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { createIngredient, getIngredients, updateIngredient, deleteIngredient };