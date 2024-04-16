const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const { isAuthenticated } = require('./middleware/authMiddleware');
const AluminumExtrusion = require('../models/AluminumExtrusion');
const Accessory = require('../models/Accessory');
const Glass = require('../models/Glass');
const quotationCalculator = require('../utils/quotationCalculator');
const PDFDocument = require('pdfkit');

// Route to create a new quotation
router.post('/create-quotation', isAuthenticated, async (req, res) => {
  try {
    const { projectName, clientName } = req.body;
    const newQuotation = await Quotation.create({
      projectName,
      clientName,
      createdBy: req.session.userId,
      windows: []
    });
    console.log(`Quotation created successfully for project: ${projectName}`);
    res.redirect('/quotation/dashboard');
  } catch (error) {
    console.error('Failed to create quotation:', error);
    res.status(500).json({ message: "Failed to create quotation", error: error });
  }
});

// Route to add a window to a quotation
router.post('/add-window/:quotationId', isAuthenticated, async (req, res) => {
  const { width, height, positiveLoad, negativeLoad, impactType, ventSizes, handle, aluminumColor, glassType, glassColor, energeticalLowE, systemType } = req.body;
  const { quotationId } = req.params;

  try {
    const quotation = await Quotation.findById(quotationId);

    // Check if the logged-in user is the owner of the quotation
    if (!quotation || quotation.createdBy.toString() !== req.session.userId.toString()) {
      console.log('Attempt to modify a quotation without permission.');
      return res.status(403).send('You do not have permission to modify this quotation.');
    }

    // Add the new window to the quotation
    quotation.windows.push({
      width,
      height,
      positiveLoad,
      negativeLoad,
      impactType,
      ventSizes: ventSizes.split(',').map(size => size.trim()),
      handle,
      aluminumColor,
      glassType,
      glassColor,
      energeticalLowE: energeticalLowE === 'on',
      systemType
    });
    await quotation.save();

    console.log(`Window added successfully to quotation with ID: ${quotationId}`);
    res.redirect("/quotation/dashboard");
  } catch (error) {
    console.error('Failed to add window to quotation:', error);
    res.status(500).json({ message: "Failed to add window", error: error });
  }
});

// Route to display dashboard with quotations list
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const quotations = await Quotation.find({ createdBy: req.session.userId }).lean();
    console.log(`Displaying dashboard for user ID: ${req.session.userId}`);
    res.render('dashboard', { quotations });
  } catch (error) {
    console.error('Failed to display dashboard:', error);
    res.status(500).send('Failed to display dashboard');
  }
});

// Route to show the form for creating a new quotation
router.get('/create-quotation', isAuthenticated, (req, res) => {
  try {
    res.render('createQuotation');
    console.log('Navigated to create quotation form.');
  } catch (error) {
    console.error('Error displaying create quotation form:', error);
    res.status(500).send('Failed to display create quotation form');
  }
});

router.get('/add-window/:quotationId', isAuthenticated, (req, res) => {
  try {
    const { quotationId } = req.params;
    res.render('addWindow', {quotationId});
    console.log('Navigated to Add window form.');
  } catch (error) {
    console.error('Error displaying window form:', error);
    res.status(500).send('Failed to display window form');
  }
});

// Additional routes for admin to manage aluminum extrusions, accessories, and glasses
// Assuming CRUD operations are implemented in admin/extrusionRoutes.js, admin/accessoryRoutes.js, and admin/glassRoutes.js

module.exports = router;