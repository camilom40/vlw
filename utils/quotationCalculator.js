const Quotation = require('../models/Quotation');
const AluminumExtrusion = require('../models/AluminumExtrusion');
const Accessory = require('../models/Accessory');
const Glass = require('../models/Glass');

// Logger utility implementation
const logger = {
  info: function(message) {
    console.log(`INFO: ${message}`);
  },
  warn: function(message) {
    console.warn(`WARN: ${message}`);
  },
  error: function(error) {
    console.error(`ERROR: ${error.message}`, error);
  }
};

// Helper function to calculate the required length of an extrusion based on window dimensions and system type
function calculateRequiredLength(window, extrusion) {
  let length = 0;
  switch (extrusion.name) {
    case 'Sill':
    case 'Head':
      length = window.width;
      break;
    case 'Jamb':
      length = (window.height - 44.4246) * 2; // Assuming two jambs per window
      break;
    case 'Vent Sill':
    case 'Vent Head':
    case 'Interlock':
      length = window.width - 105.156;
      break;
    case 'Vent Jamb':
      length = (window.height + 87.4776) * 2; // Assuming two vent jambs per window
      break;
    default:
      logger.warn(`Unknown extrusion type: ${extrusion.name}`);
  }
  return length;
}

// Helper function to get the price per m2 for energetical low E glass
function getLowEPrice() {
  // Actual price for energetical low E glass
  return 15;
}

async function calculateQuotationPrice(quotationId) {
  try {
    const quotation = await Quotation.findById(quotationId).populate({
      path: 'windows',
      populate: [
        { path: 'profiles', model: 'AluminumExtrusion' },
        { path: 'accessories', model: 'Accessory' },
        { path: 'glass', model: 'Glass' }
      ]
    });
    if (!quotation) {
      throw new Error(`Quotation with ID ${quotationId} not found`);
    }

    let totalPrice = 0;

    for (const window of quotation.windows) {
      let windowPrice = 0;
      const extrusions = await AluminumExtrusion.find({ 'windowSystems.systemType': window.systemType });

      for (const extrusion of extrusions) {
        const requiredLength = calculateRequiredLength(window, extrusion) / 1000; // Convert mm to meters
        const extrusionPrice = requiredLength * extrusion.pricePerMeter;
        windowPrice += extrusionPrice;
      }

      // Calculate price for profiles
      for (const profile of window.profiles) {
        windowPrice += profile.price; // Assuming profile object has a price property
      }

      // Calculate price for accessories
      for (const accessory of window.accessories) {
        windowPrice += accessory.price; // Assuming accessory object has a price property
      }

      // Calculate price for glass based on area and type
      const glassArea = window.width * window.height / 1000000; // Convert mm2 to m2
      const glassPrice = glassArea * window.glass.pricePerSquareMeter;
      windowPrice += glassPrice;

      // Add energetical low E price if applicable
      if (window.energeticalLowE) {
        windowPrice += glassArea * getLowEPrice();
      }

      totalPrice += windowPrice;
    }

    logger.info(`Total price for quotation ${quotationId} calculated successfully: ${totalPrice}`);
    return totalPrice;
  } catch (error) {
    logger.error(`Error calculating price for quotation ${quotationId}: ${error.message}`, error);
    throw error;
  }
}

module.exports = {
  calculateQuotationPrice
};