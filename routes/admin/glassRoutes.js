const express = require('express');
const router = express.Router();
const Glass = require('../../models/Glass');
const {isAdmin} = require('../middleware/adminMiddleware');

// Log for server actions
const logAction = (message) => {
  console.log(`[GlassRoutes] ${new Date().toISOString()} - ${message}`);
};


// Add new glass
router.post('/add',isAdmin, async (req, res) => {
  try {
    const { type, color, pricePerSquareMeter, weight } = req.body;
    const newGlass = new Glass({ type, color, pricePerSquareMeter, weight });
    await newGlass.save();
    logAction(`New glass added: ${type}, ${color}`);
    res.redirect('/admin/glass');
  } catch (error) {
    console.error('Failed to add new glass:', error);
    res.status(500).send('Failed to add new glass');
  }
});

// Get all glasses
router.get('/',isAdmin, async (req, res) => {
  try {
    const glasses = await Glass.find({});
    logAction('Fetched all glasses');
    res.render('admin/glassList', { glasses });
  } catch (error) {
    console.error('Failed to fetch glasses:', error);
    res.status(500).send('Failed to fetch glasses');
  }
});

// Get glass by ID for edit
router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const glass = await Glass.findById(id);
    if (!glass) {
      logAction(`Glass not found with ID: ${id}`);
      return res.status(404).send('Glass not found');
    }
    logAction(`Editing glass: ${glass.type}, ${glass.color}`);
    res.render('admin/editGlass', { glass });
  } catch (error) {
    console.error('Failed to get glass for edit:', error);
    res.status(500).send('Failed to get glass for edit');
  }
});

// Update glass
router.post('/update/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, color, pricePerSquareMeter, weight } = req.body;
    const updatedGlass = await Glass.findByIdAndUpdate(id, { type, color, pricePerSquareMeter, weight }, { new: true });
    logAction(`Updated glass: ${updatedGlass.type}, ${updatedGlass.color}`);
    res.redirect('/admin/glass');
  } catch (error) {
    console.error('Failed to update glass:', error);
    res.status(500).send('Failed to update glass');
  }
});

// Delete glass
router.get('/delete/:id',isAdmin , async (req, res) => {
  try {
    const { id } = req.params;
    await Glass.findByIdAndDelete(id);
    logAction(`Deleted glass with ID: ${id}`);
    res.redirect('/admin/glass');
  } catch (error) {
    console.error('Failed to delete glass:', error);
    res.status(500).send('Failed to delete glass');
  }
});

module.exports = router;