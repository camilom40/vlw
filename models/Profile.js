const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
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
    required: true
  },
  profitMargin: {
    type: Number,
    required: true
  },
  applicableWindowSystems: [{
    type: String,
    required: true
  }]
}, { timestamps: true });

profileSchema.pre('save', function(next) {
  console.log(`Saving profile: ${this.name}`);
  next();
});

profileSchema.post('save', function(doc) {
  console.log(`Profile ${doc.name} saved successfully.`);
});

profileSchema.post('remove', function(doc) {
  console.log(`Profile ${doc.name} removed successfully.`);
});

profileSchema.post('find', function(docs) {
  console.log(`Found ${docs.length} profiles.`);
});

profileSchema.post('findOneAndUpdate', function(doc) {
  console.log(`Profile ${doc.name} updated successfully.`);
});

profileSchema.post('findOneAndDelete', function(doc) {
  console.log(`Profile ${doc.name} deleted successfully.`);
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;