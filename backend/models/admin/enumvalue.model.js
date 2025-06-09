const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const enumValueSchema = new Schema({
  category: { type: String, required: true },
  value: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EnumValue', enumValueSchema);