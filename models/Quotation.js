const mongoose = require('mongoose');
const AluminumExtrusion = require('./AluminumExtrusion');
const Accessory = require('./Accessory');
const Glass = require('./Glass');
const CostSettings = require('./CostSettings');

const quotationSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  windows: [{
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    positiveLoad: {
      type: Number,
      required: true
    },
    negativeLoad: {
      type: Number,
      required: true
    },
    impactType: {
      type: String,
      enum: ['Small Missile', 'Large Missile'],
      required: true
    },
    ventSizes: [{
      type: String
    }],
    handle: {
      type: String,
      enum: ['Handle 1', 'Handle 2'],
      required: true
    },
    aluminumColor: {
      type: String,
      enum: ['Black', 'White', 'Bronce'],
      required: true
    },
    glassType: {
      type: String,
      enum: ['Single Glazed', 'Double Glazed'],
      required: true
    },
    glassColor: {
      type: String,
      enum: ['Clear', 'Lake Blue', 'Dark Blue', 'Green', 'Bronce'],
      required: true
    },
    energeticalLowE: {
      type: Boolean,
      required: true
    },
    systemType: {
      type: String,
      enum: ['Fixed Window', 'Single Hung Window', 'Horizontal Roller', 'French Door'],
      required: true
    },
    profiles: [{
      profileName: String,
      length: Number,
      quantity: Number
    }],
    accessories: [{
      accessoryName: String,
      quantity: Number,
      price: Number
    }],
    glass: {
      type: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      pricePerSquareMeter: {
        type: Number,
        required: true
      }
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalCost: {
    type: Number,
    required: false // This field is not required at creation but will be calculated and updated later.
  }
}, { timestamps: true });

quotationSchema.methods.calculateTotalCost = async function() {
  try {
    const costSettings = await CostSettings.findOne(); // Fetch global cost settings
    if (!costSettings) {
      console.error('Global cost settings not found');
      return;
    }

    this.totalCost = await this.windows.reduce(async (accPromise, window) => {
      const acc = await accPromise;
      let windowCost = 0;
      // Calculate cost based on profiles
      for (const profile of window.profiles) {
        const extrusion = await AluminumExtrusion.findOne({ name: profile.profileName });
        const profileCost = profile.length * profile.quantity * (extrusion ? extrusion.pricePerMeter : 0);
        windowCost += profileCost;
      }

      // Calculate cost based on accessories
      for (const accessory of window.accessories) {
        const accessoryItem = await Accessory.findOne({ name: accessory.accessoryName });
        const accessoryCost = accessory.quantity * (accessoryItem ? accessoryItem.price : 0);
        windowCost += accessoryCost;
      }

      // Calculate cost based on glass
      const glassArea = window.width * window.height / 1000000; // Convert mm2 to m2
      const glassItem = await Glass.findOne({ type: window.glass.type, color: window.glass.color });
      const glassCost = glassArea * (glassItem ? glassItem.pricePerSquareMeter : 0);
      windowCost += glassCost;

      // Include global costs proportionally
      const globalCosts = costSettings.seaFreight + costSettings.landFreight + costSettings.packaging + costSettings.labor + costSettings.administrativeExpenses;
      windowCost += globalCosts / this.windows.length; // Distribute global costs evenly across all windows

      return acc + windowCost;
    }, Promise.resolve(0));

    await this.save();
    console.log(`Total cost for quotation ${this._id} calculated successfully: ${this.totalCost}`);
  } catch (error) {
    console.error(`Error calculating total cost for quotation ${this._id}:`, error);
    throw error; // Rethrow the error after logging
  }
};

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;