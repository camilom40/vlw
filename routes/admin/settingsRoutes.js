const express = require('express');
const router = express.Router();
const CostSettings = require('../../models/CostSettings');
const { isAdmin } = require('../../routes/middleware/adminMiddleware');

// Route to get current settings
router.get('/settings', isAdmin, async (req, res) => {
  try {
    const settings = await CostSettings.findOne({});
    if (!settings) {
      console.log('No cost settings found, redirecting to settings form.');
      return res.render('admin/settings', { settings: null });
    }
    console.log('Cost settings found, rendering settings form.');
    res.render('admin/settings', { settings });
  } catch (error) {
    console.error('Error fetching cost settings:', error);
    res.status(500).send('Server error');
  }
});

// Route to update settings
router.post('/settings', isAdmin, async (req, res) => {
  const { seaFreight, landFreight, packaging, labor, administrativeExpenses } = req.body;
  try {
    const settings = await CostSettings.findOneAndUpdate({}, {
      seaFreight,
      landFreight,
      packaging,
      labor,
      administrativeExpenses
    }, { new: true, upsert: true });

    console.log(`Cost settings updated: ${settings._id}`);
    res.redirect('/admin/settings');
  } catch (error) {
    console.error('Error updating cost settings:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;