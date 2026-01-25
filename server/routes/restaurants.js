const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Bounty = require('../models/Bounty');
const Recipe = require('../models/Recipe');

// GET /api/restaurants - Get all restaurants that have appeared in a bounty
router.get('/', async (req, res) => {
  try {
    const { cuisine } = req.query;

    // `Bounty.restaurant` has historically been stored inconsistently across codebases:
    //  - sometimes as the Restaurant _id (ObjectId)
    //  - sometimes as the Restaurant name (string)
    // This route supports both.
    const distinctRestaurants = await Bounty.distinct('restaurant');

    // If there are no bounties yet, return an empty list.
    if (!distinctRestaurants || distinctRestaurants.length === 0) {
      return res.json([]);
    }

    // Split into probable ObjectIds vs probable names.
    const isLikelyObjectId = (v) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v);

    const idValues = distinctRestaurants.filter(isLikelyObjectId);
    const nameValuesRaw = distinctRestaurants
      .filter((v) => typeof v === 'string' && !isLikelyObjectId(v));

    // Normalize names to reduce mismatch from extra spaces/case.
    const normalizeName = (s) => (s || '').trim();
    const nameValues = Array.from(new Set(nameValuesRaw.map(normalizeName).filter(Boolean)));

    // Build query.
    const orClauses = [];
    if (idValues.length > 0) {
      orClauses.push({ _id: { $in: idValues } });
    }

    // Exact name matches (fast path)
    if (nameValues.length > 0) {
      orClauses.push({ name: { $in: nameValues } });
    }

    // Case-insensitive / whitespace-tolerant name matching (slow path)
    // If the fast path returns nothing due to casing differences, this helps.
    // We keep this optional by only adding it when we have names.
    if (nameValues.length > 0) {
      const escaped = nameValues
        .slice(0, 100) // safety guard
        .map((n) => n.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'));
      orClauses.push({ name: { $in: escaped.map((e) => new RegExp(`^\\s*${e}\\s*$`, 'i')) } });
    }

    const filter = orClauses.length > 0 ? { $or: orClauses } : {};

    // Optional cuisine filter (applies on Restaurant documents)
    if (cuisine) filter.cuisine = cuisine;

    const restaurants = await Restaurant.find(filter).sort({ recipesUnlocked: -1 });

    // If there are bounties but no Restaurant documents yet, still return something useful.
    // Also, if some names from bounties don't have matching Restaurant docs, append them.
    let result = restaurants;

    if (!cuisine) {
      const normalizeKey = (s) => (s || '').trim().toLowerCase();
      const returnedNameSet = new Set((restaurants || []).map((r) => normalizeKey(r.name)));

      const missing = nameValues
        .filter((n) => !returnedNameSet.has(normalizeKey(n)))
        .map((n) => ({
          _id: null,
          name: n,
          location: null,
          cuisine: null,
          recipesUnlocked: 0,
          isFromBountyOnly: true,
        }));

      // If we found no Restaurant docs at all, return the bounty-derived list.
      // Otherwise, append missing names so the UI can still show them.
      result = (restaurants && restaurants.length > 0) ? [...restaurants, ...missing] : missing;
    }

    // Helpful debug logs for local dev
    console.log('[GET /api/restaurants] distinctRestaurants:', distinctRestaurants);
    console.log('[GET /api/restaurants] ids:', idValues.length, 'names:', nameValues.length);
    console.log('[GET /api/restaurants] returned:', result.length);

    res.json(result);
  } catch (error) {
    console.error('[GET /api/restaurants] error:', error);
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
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

module.exports = router;
