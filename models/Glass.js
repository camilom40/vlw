const mongoose = require('mongoose');

const glassSchema = new mongoose.Schema({
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
  },
  weight: {
    type: Number,
    required: true
  }
}, { timestamps: true });

glassSchema.pre('save', function(next) {
  console.log(`Saving glass type: ${this.type} with color: ${this.color}`);
  next();
});

glassSchema.post('save', function(doc) {
  console.log(`Glass type ${doc.type} with color: ${doc.color} saved successfully.`);
});

glassSchema.post('remove', function(doc) {
  console.log(`Glass type ${doc.type} with color: ${doc.color} removed successfully.`);
});

glassSchema.post('find', function(docs) {
  console.log(`Found ${docs.length} glass types.`);
});

glassSchema.post('findOneAndUpdate', function(doc) {
  console.log(`Glass type ${doc.type} with color: ${doc.color} updated successfully.`);
});

glassSchema.post('findOneAndDelete', function(doc) {
  console.log(`Glass type ${doc.type} with color: ${doc.color} deleted successfully.`);
});

const Glass = mongoose.model('Glass', glassSchema);

module.exports = Glass;