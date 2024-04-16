const express = require('express');
const router = express.Router();
const AluminumExtrusion = require('../../models/AluminumExtrusion');
const { isAdmin } = require('../middleware/adminMiddleware');

// Route to create a new aluminum extrusion
router.post('/create', isAdmin, async (req, res) => {
  try {
    const { name, number, pricePerMeter, windowSystems } = req.body;
    const newExtrusion = await AluminumExtrusion.create({
      name,
      number,
      pricePerMeter,
      windowSystems: JSON.parse(windowSystems) // Expecting windowSystems to be a JSON string representing an array
    });
    console.log(`Aluminum Extrusion created successfully: ${name}`);
    res.redirect('/admin/extrusions');
  } catch (error) {
    console.error('Failed to create aluminum extrusion:', error);
    res.status(500).json({ message: "Failed to create aluminum extrusion", error: error });
  }
});

// Route to list all aluminum extrusions
router.get('/', isAdmin, async (req, res) => {
  try {
    const extrusions = await AluminumExtrusion.find({}).lean();
    console.log('Listing all aluminum extrusions');
    res.render('admin/extrusionsList', { extrusions });
  } catch (error) {
    console.error('Failed to list aluminum extrusions:', error);
    res.status(500).send('Failed to list aluminum extrusions');
  }
});

// Route to get a specific aluminum extrusion for editing
router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const extrusion = await AluminumExtrusion.findById(id).lean();
    if (!extrusion) {
      console.log(`Aluminum Extrusion not found with ID: ${id}`);
      return res.status(404).send('Aluminum Extrusion not found');
    }
    console.log(`Editing Aluminum Extrusion: ${extrusion.name}`);
    res.render('admin/editExtrusion', { extrusion });
  } catch (error) {
    console.error('Failed to get aluminum extrusion for editing:', error);
    res.status(500).send('Failed to get aluminum extrusion for editing');
  }
});

// Route to update a specific aluminum extrusion
router.post('/update/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, number, pricePerMeter, windowSystems } = req.body;
    const extrusion = await AluminumExtrusion.findByIdAndUpdate(id, {
      name,
      number,
      pricePerMeter,
      windowSystems: JSON.parse(windowSystems) // Expecting windowSystems to be a JSON string representing an array
    }, { new: true });
    console.log(`Aluminum Extrusion updated successfully: ${extrusion.name}`);
    res.redirect('/admin/extrusions');
  } catch (error) {
    console.error('Failed to update aluminum extrusion:', error);
    res.status(500).json({ message: "Failed to update aluminum extrusion", error: error });
  }
});

// Route to delete a specific aluminum extrusion
router.get('/delete/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await AluminumExtrusion.findByIdAndDelete(id);
    console.log(`Aluminum Extrusion deleted with ID: ${id}`);
    res.redirect('/admin/extrusions');
  } catch (error) {
    console.error('Failed to delete aluminum extrusion:', error);
    res.status(500).send('Failed to delete aluminum extrusion');
  }
});

module.exports = router;