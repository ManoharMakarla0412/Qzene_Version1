const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./../models/recipe.model');
const { recipes } = require('../data/recipes');

dotenv.config();

const seedRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected");
    

    await Recipe.deleteMany(); // Optional: clears old data
    await Recipe.insertMany(recipes);

    console.log("✅ All recipes added successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seedRecipes();
