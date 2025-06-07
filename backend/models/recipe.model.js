const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  id: String, // Added to match your data
  name: { type: String, required: true },
  description: String,
  image: String, // Changed from recipeImage to match your data
  category: String,
  difficulty: String,
  price: Number,
  cookingTime: Number,
  servings: Number, // Changed from servingSize to match your data
  author: String,
  cuisine: String,
  deviceSupport: String,
  preparationRequired: Boolean,
  
  // New fields from your data
  rating: Number,
  featured: Boolean,
  calories: Number,
  protein: Number,
  fat: Number,
  carbs: Number,
  
  // Simplified ingredients as string array (matches your data)
  ingredients: [String],
  
  // Simplified instructions as string array (matches your data)
  instructions: [String],
  
  // Keep the original complex structures as optional for backward compatibility
  containers: [{
    id: Number,
    name: String,
    ingredients: [{
      id: String,
      name: String,
      image: String,
      quantity: Number
    }]
  }],
  seasonings: [{
    id: String,
    name: String,
    image: String,
    count: Number,
    quantity: Number
  }],
  preparationItems: [{
    id: String,
    name: String,
    image: String
  }],
  utensils: [{
    id: String,
    name: String,
    image: String
  }],
  waterOil: [{
    id: String,
    name: String,
    image: String,
    quantity: Number
  }],
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);