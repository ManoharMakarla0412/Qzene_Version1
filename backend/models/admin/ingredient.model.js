const mongoose = require('mongoose');
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness
    index: true, // Index for fast lookup
    trim: true,
  },
  type: {
    type: String,
    required: true,
    ref: 'EnumValue', // References EnumValue
  },
  prep_method: {
    type: [String], // Optional list of preparation methods
    default: [],
  },
  allergen: {
    type: [String], // Optional list of allergens
    default: [],
  },
  nutrient: {
    type: {
      protein: { type: Number, default: 0 },
      calories: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    }, // Optional nutritional information
    default: null,
  },
  brand: {
    type: String, // Optional brand information
    default: null,
    trim: true,
  },
  description: {
    type: String, // Optional descriptive text
    default: null,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` on save
ingredientSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for name
ingredientSchema.index({ name: 1 });

module.exports = mongoose.model('Ingredient', ingredientSchema);