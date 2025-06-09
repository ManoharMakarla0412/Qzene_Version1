const mongoose = require('mongoose');
const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, ref: 'EnumValue' }, // References EnumValue
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // New field
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ingredient', ingredientSchema);