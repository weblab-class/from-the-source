const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Bounty = require('../models/Bounty');
const Recipe = require('../models/Recipe');

// GET /api/restaurants - Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine } = req.query;
    
    let filter = {};
    if (cuisine) filter.cuisine = cuisine;

    const restaurants = await Restaurant.find(filter).sort({ recipesUnlocked: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
});

// GET /api/restaurants/:id - Get single restaurant with its bounties and recipes
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get bounties for this restaurant
    const bounties = await Bounty.find({ restaurant: restaurant.name });
    
    // Get recipes for this restaurant
    const recipes = await Recipe.find({ restaurant: restaurant.name });

    res.json({
      ...restaurant.toJSON(),
      bounties,
      recipes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
  }
});

// POST /api/restaurants - Create new restaurant
router.post('/', async (req, res) => {
  try {
    const { name, location, cuisine } = req.body;

    // Check if restaurant already exists
    const existing = await Restaurant.findOne({ name: name });
    if (existing) {
      return res.status(400).json({ message: 'Restaurant already exists' });
    }

    const newRestaurant = new Restaurant({
      name,
      location,
      cuisine
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: 'Error creating restaurant', error: error.message });
  }
});

// GET /api/restaurants/name/:name - Get restaurant by name
router.get('/name/:name', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ 
      name: { $regex: new RegExp(req.params.name, 'i') }  // Case insensitive search
    });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get bounties and recipes
    const bounties = await Bounty.find({ restaurant: restaurant.name });
    const recipes = await Recipe.find({ restaurant: restaurant.name });

    res.json({
      ...restaurant.toJSON(),
      bounties,
      recipes
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error: error.message });
  }
});

module.exports = router;
