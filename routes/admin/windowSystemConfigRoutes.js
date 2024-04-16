const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const AluminumExtrusion = require('../../models/AluminumExtrusion');
const Accessory = require('../../models/Accessory');
const Glass = require('../../models/Glass');
const WindowSystem = require('../../models/WindowSystem'); // Assuming this model exists for window system configurations

// Route to display form for creating or editing window system configurations
router.get('/configure-window-system/:systemType?', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { systemType } = req.params;
    let windowSystemConfig = null;
    if (systemType) {
      windowSystemConfig = await WindowSystem.findOne({ systemType }).lean();
    }
    const aluminumExtrusions = await AluminumExtrusion.find().lean();
    const accessories = await Accessory.find().lean();
    const glasses = await Glass.find().lean();

    res.render('admin/configureWindowSystem', {
      aluminumExtrusions,
      accessories,
      glasses,
      windowSystemConfig,
    });
  } catch (error) {
    console.error('Failed to load window system configuration form:', error);
    res.status(500).send('Failed to display window system configuration form');
  }
});

// Route to save window system configuration
router.post('/configure-window-system', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { systemType, extrusions, accessories, glass } = req.body;
    let windowSystemConfig = await WindowSystem.findOne({ systemType });

    if (windowSystemConfig) {
      windowSystemConfig.extrusions = extrusions;
      windowSystemConfig.accessories = accessories;
      windowSystemConfig.glass = glass;
    } else {
      windowSystemConfig = new WindowSystem({
        systemType,
        extrusions,
        accessories,
        glass,
      });
    }

    await windowSystemConfig.save();
    console.log(`Window system configuration saved for ${systemType}`);
    res.redirect('/admin/window-systems'); // Corrected redirect path to an existing route
  } catch (error) {
    console.error('Failed to save window system configuration:', error);
    res.status(500).send('Failed to save window system configuration');
  }
});

module.exports = router;