const mongoose = require('mongoose');

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
  }
}, { timestamps: true });

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;