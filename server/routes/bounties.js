const express = require('express');
const router = express.Router();
const Bounty = require('../models/Bounty');
const Restaurant = require('../models/Restaurant');

// GET /api/bounties - Get all bounties
router.get('/', async (req, res) => {
  try {
    // Optional query params for filtering
    const { status, category, cuisine } = req.query;
    
    // Build filter object
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const bounties = await Bounty.find(filter).sort({ createdAt: -1 });
    res.json(bounties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bounties', error: error.message });
  }
});

// GET /api/bounties/:id - Get single bounty
router.get('/:id', async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }
    res.json(bounty);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bounty', error: error.message });
  }
});

// POST /api/bounties - Create new bounty
router.post('/', async (req, res) => {
  try {
    const { dishName, restaurant, location, description, category, pointReward, postedBy, cuisine } = req.body;

    // Normalize restaurant name so we can reliably match between bounties and restaurants
    const normalizedRestaurantName = (restaurant || '').trim();

    // If we have a restaurant name, ensure there is a Restaurant document for it.
    // This is what allows /api/restaurants to return cuisine/location instead of null.
    if (normalizedRestaurantName) {
      await Restaurant.findOneAndUpdate(
        { name: normalizedRestaurantName },
        {
          $setOnInsert: { name: normalizedRestaurantName },
          // Only set fields if they were provided (avoid overwriting existing data with empty values)
          $set: {
            ...(location ? { location } : {}),
            ...(cuisine ? { cuisine } : {}),
          },
        },
        { upsert: true, new: true }
      );
    }

    const newBounty = new Bounty({
      dishName,
      // Store the normalized name so it matches Restaurant.name exactly
      restaurant: normalizedRestaurantName,
      location,
      description,
      category,
      pointReward,
      postedBy,
      ...(cuisine ? { cuisine } : {}),
    });

    const savedBounty = await newBounty.save();
    res.status(201).json(savedBounty);
  } catch (error) {
    res.status(400).json({ message: 'Error creating bounty', error: error.message });
  }
});

// PUT /api/bounties/:id/claim - Claim a bounty
router.put('/:id/claim', async (req, res) => {
  try {
    const { username } = req.body;

    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }
    if (bounty.status !== 'open') {
      return res.status(400).json({ message: 'Bounty is not available to claim' });
    }

    bounty.status = 'claimed';
    bounty.claimedBy = username;
    bounty.claimedAt = new Date();

    const updatedBounty = await bounty.save();
    res.json(updatedBounty);
  } catch (error) {
    res.status(400).json({ message: 'Error claiming bounty', error: error.message });
  }
});

// PUT /api/bounties/:id/want - Add yourself to "want this" list
router.put('/:id/want', async (req, res) => {
  try {
    const { username } = req.body;

    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }

    // Check if user already wants this
    if (bounty.wantedBy.includes(username)) {
      return res.status(400).json({ message: 'You already want this bounty' });
    }

    bounty.wantedBy.push(username);
    const updatedBounty = await bounty.save();
    res.json(updatedBounty);
  } catch (error) {
    res.status(400).json({ message: 'Error updating bounty', error: error.message });
  }
});

// DELETE /api/bounties/:id - Delete a bounty (for testing)
router.delete('/:id', async (req, res) => {
  try {
    const bounty = await Bounty.findByIdAndDelete(req.params.id);
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }
    res.json({ message: 'Bounty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bounty', error: error.message });
  }
});

module.exports = router;
