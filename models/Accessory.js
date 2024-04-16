const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: false // Some accessories might not have a significant weight
  },
  applicableWindowSystems: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

accessorySchema.pre('save', function(next) {
  console.log(`Saving accessory: ${this.name}`);
  next();
});

accessorySchema.post('save', function(doc) {
  console.log(`Accessory ${doc.name} saved successfully.`);
});

accessorySchema.post('remove', function(doc) {
  console.log(`Accessory ${doc.name} removed successfully.`);
});

accessorySchema.post('find', function(docs) {
  console.log(`Found ${docs.length} accessories.`);
});

accessorySchema.post('findOneAndUpdate', function(doc) {
  console.log(`Accessory ${doc.name} updated successfully.`);
});

accessorySchema.post('findOneAndDelete', function(doc) {
  console.log(`Accessory ${doc.name} deleted successfully.`);
});

const Accessory = mongoose.model('Accessory', accessorySchema);

module.exports = Accessory;