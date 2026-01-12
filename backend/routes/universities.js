const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const University = require('../models/University');

// Get all universities
router.get('/', async (req, res) => {
  try {
    const { country } = req.query;
    const filter = { isActive: true };
    
    if (country) {
      filter.country = country;
    }

    const universities = await University.find(filter).sort({ ranking: 1 });
    res.json({ universities });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

// Create university (admin only)
router.post('/', authMiddleware, roleMiddleware('super_admin'), async (req, res) => {
  try {
    const university = new University({
      universityId: uuidv4(),
      ...req.body
    });

    await university.save();
    res.status(201).json({ message: 'University created', university });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create university' });
  }
});

module.exports = router;