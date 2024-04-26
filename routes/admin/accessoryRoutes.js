const express = require('express');
const router = express.Router();
const Accessory = require('../../models/Accessory');
const { isAdmin } = require('../../routes/middleware/adminMiddleware');

// Log utility
const logger = require('../../utils/logger');

// Route to list all accessories
router.get('/', isAdmin, async (req, res) => {
  try {
    const accessories = await Accessory.find({});
    res.render('admin/listAccessories', { accessories }); // Changed from 'accessoriesList' to 'listAccessories'
  } catch (error) {
    logger.error('Failed to fetch accessories:', error);
    res.status(500).send('Failed to fetch accessories');
  }
});

// Route to show the form for adding a new accessory
router.get('/add', isAdmin, (req, res) => {
  res.render('admin/addAccessory');
});

// Route to create a new accessory
router.post('/add', isAdmin, async (req, res) => {
  try {
    const { name, price, weight, applicableWindowSystems } = req.body;
    const newAccessory = new Accessory({ name, price, weight, applicableWindowSystems });
    await newAccessory.save();
    logger.info(`Accessory ${name} added successfully.`);
    res.redirect('/admin/accessories');
  } catch (error) {
    logger.error('Failed to add accessory:', error);
    res.status(500).send('Failed to add accessory');
  }
});

// Route to show the form for editing an accessory
router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id);
    if (!accessory) {
      logger.warn(`Accessory with ID: ${req.params.id} not found.`);
      return res.status(404).send('Accessory not found');
    }
    res.render('admin/editAccessory', { accessory });
  } catch (error) {
    logger.error('Failed to fetch accessory for editing:', error);
    res.status(500).send('Failed to fetch accessory for editing');
  }
});

// Route to update an accessory
router.post('/edit/:id', isAdmin, async (req, res) => {
  try {
    const { name, price, weight, applicableWindowSystems } = req.body;
    await Accessory.findByIdAndUpdate(req.params.id, { name, price, weight, applicableWindowSystems });
    logger.info(`Accessory with ID: ${req.params.id} updated successfully.`);
    res.redirect('/admin/accessories');
  } catch (error) {
    logger.error('Failed to update accessory:', error);
    res.status(500).send('Failed to update accessory');
  }
});

// Route to delete an accessory
router.get('/delete/:id', isAdmin, async (req, res) => {
  try {
    await Accessory.findByIdAndDelete(req.params.id);
    logger.info(`Accessory with ID: ${req.params.id} deleted successfully.`);
    res.redirect('/admin/accessories');
  } catch (error) {
    logger.error('Failed to delete accessory:', error);
    res.status(500).send('Failed to delete accessory');
  }
});

module.exports = router;