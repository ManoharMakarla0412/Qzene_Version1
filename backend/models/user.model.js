const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: {
    type: [String],
    enum: ["user", "chef", "admin"],
    default: ["admin"],
  },
  profile: {
    name: String,
    avatarUrl: String,
    bio: String,
  },
  chefProfile: {
    mainChefId: { type: Schema.Types.ObjectId, ref: "User" },
    subChefIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    totalRecipes: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
  },
  status: {
    type: String,
    enum: ["active", "banned", "disabled"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model("User", userSchema);
