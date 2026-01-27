const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Bounty = require('../models/Bounty');

// GET /api/recipes - get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
});

// GET /api/recipes/:id - get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
});

// POST /api/recipes - submit a new recipe
router.post('/', async (req, res) => {
  try {
    const {
      bountyId,
      dishName,
      restaurant,
      ingredients,
      steps,
      questLog,
      difficultyTag,
      submittedBy
    } = req.body;

    // create the recipe
    const newRecipe = new Recipe({
      bountyId,
      dishName,
      restaurant,
      ingredients,
      steps,
      questLog,
      difficultyTag,
      submittedBy
    });

    const savedRecipe = await newRecipe.save();

    // update the bounty status: completed
    if (bountyId) {
      await Bounty.findByIdAndUpdate(bountyId, { status: 'completed' });
    }

    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error: error.message });
  }
});

// POST /api/recipes/:id/verify - add a verification to a recipe
router.post('/:id/verify', async (req, res) => {
  try {
    const { verifiedBy, method, accuracyRating, notes } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.verifications.push({
      verifiedBy,
      method,
      accuracyRating,
      notes
    });

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error adding verification', error: error.message });
  }
});

// GET /api/recipes/bounty/:bountyId - get recipe for a specific bounty
router.get('/bounty/:bountyId', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ bountyId: req.params.bountyId });
    if (!recipe) {
      return res.status(404).json({ message: 'No recipe found for this bounty' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
});

module.exports = router;
