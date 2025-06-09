const mongoose = require('mongoose');

const adminrecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  cuisine_type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  recipe_type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipe_json: {
    type: Object,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

adminrecipeSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('AdminRecipe', adminrecipeSchema);