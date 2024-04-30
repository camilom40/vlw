const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const {isAdmin} = require('../middleware/adminMiddleware');

// Route to render the form for adding a new profile
router.get('/add', isAdmin, (req, res) => {
  try {
    res.render('admin/addProfile');
  } catch (error) {
    console.error(`Error rendering add profile form: ${error.message}`, error);
    res.status(500).send({ message: 'Failed to render add profile form', error: error.message });
  }
});

// Create a new profile
router.post('/add',isAdmin, async (req, res) => {
  try {
    const { name, price, weight, profitMargin } = req.body;
    const newProfile = new Profile({ name, price, weight, profitMargin });
    await newProfile.save();
    console.log(`Profile created: ${name}`);
    res.redirect('/admin/profiles')
    

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
    res.render('admin/listProfiles', {profiles});
  } catch (error) {
    console.error(`Error fetching profiles: ${error.message}`, error);
    res.status(500).send({ message: 'Failed to fetch profiles', error: error.message });
  }
});

// Render the edit profile form
router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      console.log(`Profile not found with id: ${req.params.id}`);
      return res.status(404).render('admin/error', { message: 'Profile not found' });
    }
    res.render('admin/editProfile', { profile });
  } catch (error) {
    console.error(`Error fetching profile for edit: ${error.message}`, error);
    res.status(500).send({ message: 'Failed to fetch profile for editing', error: error.message });
  }
});

// Update a profile
router.post('/update/:id', isAdmin, async (req, res) => {
  try {
    const { name, price, weight, profitMargin } = req.body;
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, { name, price, weight, profitMargin }, { new: true });
    if (!updatedProfile) {
      console.log(`Profile not found for update with id: ${req.params.id}`);
      return res.status(404).send({ message: 'Profile not found' });
    }
    console.log(`Profile updated: ${updatedProfile.name}`);
    res.redirect('/admin/profiles');
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