const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const {isAdmin} = require('../middleware/adminMiddleware');



// Create a new profile
router.post('/',isAdmin, async (req, res) => {
  try {
    const { name, price, weight, profitMargin } = req.body;
    const newProfile = new Profile({ name, price, weight, profitMargin });
    await newProfile.save();
    console.log(`Profile created: ${name}`);
    res.status(201).send(newProfile);
  } catch (error) {
    console.error(`Error creating profile: ${error.message}`, error);
    res.status(500).send({ message: 'Failed to create profile', error: error.message });
  }
});

// Get all profiles
router.get('/',isAdmin, async (req, res) => {
  try {
    const profiles = await Profile.find({});
    console.log('Fetched all profiles');
    res.status(200).send(profiles);
  } catch (error) {
    console.error(`Error fetching profiles: ${error.message}`, error);
    res.status(500).send({ message: 'Failed to fetch profiles', error: error.message });
  }
});

// Get a single profile by ID
router.get('/:id', isAdmin, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      console.log(`Profile not found with id: ${req.params.id}`);
      return res.status(404).send({ message: 'Profile not found' });
    }
    console.log(`Fetched profile: ${profile.name}`);
    res.status(200).send(profile);
  } catch (error) {
    console.error(`Error fetching profile: ${error.message}`, error);
    res.status(500).send({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update a profile
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { name, price, weight, profitMargin } = req.body;
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, { name, price, weight, profitMargin }, { new: true });
    if (!updatedProfile) {
      console.log(`Profile not found for update with id: ${req.params.id}`);
      return res.status(404).send({ message: 'Profile not found' });
    }
    console.log(`Profile updated: ${updatedProfile.name}`);
    res.status(200).send(updatedProfile);
  } catch (error) {
    console.error(`Error updating profile: ${error.message}`, error);
    res.status(500).send({ message: 'Failed to update profile', error: error.message });
  }
});

// Delete a profile
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) {
      console.log(`Profile not found for deletion with id: ${req.params.id}`);
      return res.status(404).send({ message: 'Profile not found' });
    }
    console.log(`Profile deleted: ${deletedProfile.name}`);
    res.status(200).send({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error(`Error deleting profile: ${error.message}`, error);
    res.status(500).send({ message: 'Failed to delete profile', error: error.message });
  }
});

module.exports = router;