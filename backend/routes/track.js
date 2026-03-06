const express = require('express');
const FeatureClick = require('../models/FeatureClick');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { featureName } = req.body;
    const click = new FeatureClick({
      userId: req.userId,
      featureName,
      timestamp: new Date()
    });
    await click.save();
    res.status(201).json({ message: 'Tracked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;