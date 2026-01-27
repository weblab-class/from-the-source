const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Bounty = require('../models/Bounty');
const Recipe = require('../models/Recipe');

// GET /api/restaurants - get all restaurants that have appeared in a bounty
router.get('/', async (req, res) => {
  try {
    const { cuisine } = req.query;

    const distinctRestaurants = await Bounty.distinct('restaurant');

    // if no bounties yet, return an empty list
    if (!distinctRestaurants || distinctRestaurants.length === 0) {
      return res.json([]);
    }

    // split into probable ObjectIds vs probable names
    const isLikelyObjectId = (v) => typeof v === 'string' && /^[a-fA-F0-9]{24}$/.test(v);

    const idValues = distinctRestaurants.filter(isLikelyObjectId);
    const nameValuesRaw = distinctRestaurants
      .filter((v) => typeof v === 'string' && !isLikelyObjectId(v));

    // normalize names to reduce mismatch from extra spaces/case
    const normalizeName = (s) => (s || '').trim();
    const nameValues = Array.from(new Set(nameValuesRaw.map(normalizeName).filter(Boolean)));

    const orClauses = [];
    if (idValues.length > 0) {
      orClauses.push({ _id: { $in: idValues } });
    }

    if (nameValues.length > 0) {
      orClauses.push({ name: { $in: nameValues } });
    }

    if (nameValues.length > 0) {
      const escaped = nameValues
        .slice(0, 100)
        .map((n) => n.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'));
      orClauses.push({ name: { $in: escaped.map((e) => new RegExp(`^\\s*${e}\\s*$`, 'i')) } });
    }

    const filter = orClauses.length > 0 ? { $or: orClauses } : {};

    // OPTIONAL cuisine filter
    if (cuisine) filter.cuisine = cuisine;

    const restaurants = await Restaurant.find(filter).sort({ recipesUnlocked: -1 });

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

      result = (restaurants && restaurants.length > 0) ? [...restaurants, ...missing] : missing;
    }
    console.log('[GET /api/restaurants] distinctRestaurants:', distinctRestaurants);
    console.log('[GET /api/restaurants] ids:', idValues.length, 'names:', nameValues.length);
    console.log('[GET /api/restaurants] returned:', result.length);

    res.json(result);
  } catch (error) {
    console.error('[GET /api/restaurants] error:', error);
    res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
  }
});

// GET /api/restaurants/name/:name - get restaurant by name
router.get('/name/:name', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      name: { $regex: new RegExp(req.params.name, 'i') }  // Case insensitive search
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // get bounties and recipes
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

// GET /api/restaurants/:id - get single restaurant with its bounties and recipes
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

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

// POST /api/restaurants - create new restaurant
router.post('/', async (req, res) => {
  try {
    const { name, location, cuisine } = req.body;
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
