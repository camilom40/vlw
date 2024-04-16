const mongoose = require('mongoose');

const aluminumExtrusionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  pricePerMeter: {
    type: Number,
    required: true
  },
  windowSystems: [{
    systemType: {
      type: String,
      required: true
    },
    requiredLengthCalculation: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

aluminumExtrusionSchema.pre('save', function(next) {
  console.log(`Saving aluminum extrusion: ${this.name} with number: ${this.number}`);
  next();
});

aluminumExtrusionSchema.post('save', function(doc) {
  console.log(`Aluminum extrusion ${doc.name} with number: ${doc.number} saved successfully.`);
});

aluminumExtrusionSchema.post('remove', function(doc) {
  console.log(`Aluminum extrusion ${doc.name} with number: ${doc.number} removed successfully.`);
});

aluminumExtrusionSchema.post('find', function(docs) {
  console.log(`Found ${docs.length} aluminum extrusions.`);
});

aluminumExtrusionSchema.post('findOneAndUpdate', function(doc) {
  console.log(`Aluminum extrusion ${doc.name} with number: ${doc.number} updated successfully.`);
});

aluminumExtrusionSchema.post('findOneAndDelete', function(doc) {
  console.log(`Aluminum extrusion ${doc.name} with number: ${doc.number} deleted successfully.`);
});

const AluminumExtrusion = mongoose.model('AluminumExtrusion', aluminumExtrusionSchema);

module.exports = AluminumExtrusion;