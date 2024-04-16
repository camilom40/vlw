const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const { isAuthenticated } = require('./middleware/authMiddleware');
const PDFDocument = require('pdfkit');
const quotationCalculator = require('../utils/quotationCalculator');

router.get('/export-quotation/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id).populate('windows.profiles windows.accessories');
    if (!quotation) {
      console.log(`Quotation with ID: ${id} not found.`);
      return res.status(404).send('Quotation not found');
    }

    const totalPrice = await quotationCalculator.calculateQuotationPrice(id);
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=quotation-${id}.pdf`);

    doc.pipe(res);

    doc.fontSize(25).text('Quotation Details', { underline: true });
    doc.fontSize(15).text(`Project Name: ${quotation.projectName}`);
    doc.fontSize(15).text(`Client Name: ${quotation.clientName}`);
    doc.fontSize(15).text(`Total Price: $${totalPrice.toFixed(2)}`);
    doc.addPage();
    doc.fontSize(20).text('Window Details', { underline: true });
    quotation.windows.forEach(window => {
      // doc.fontSize(12).text(`System Type: ${window.systemType}, Width: ${window.width}mm, Height: ${window.height}mm, Glass Type: ${window.glassType}, Color: ${window.aluminumColor}`);
      doc.moveDown();
    });

    doc.end();
    console.log(`Exported quotation ${id} to PDF successfully.`);
  } catch (error) {
    console.error('Failed to export quotation to PDF:', error);
    res.status(500).send('Failed to export quotation to PDF');
  }
});

module.exports = router;