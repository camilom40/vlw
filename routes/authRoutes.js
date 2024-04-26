const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    // User model will automatically hash the password using bcrypt
    await User.create({ username: email, password, role });
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    // Sending an alert message in the response
    res.status(500).send(`
      <script>
        alert('Email Address Already In Use. Try A Different One.');
        window.location.href = '/auth/register'; 
      </script>
    `);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ username: email });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      console.log(`User ${email} logged in successfully.`);
      res.redirect('/quotation/dashboard'); // Redirecting to dashboard after successful login
    } else {
      return res.status(400).send(`
      <script>
        alert('Wrong Password. Please Try Again!');
        window.location.href = '/auth/login'; 
      </script>
    `);
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send(error.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      return res.status(500).send('Error logging out');
    }
    console.log('User logged out successfully.');
    res.redirect('/auth/login');
  });
});

module.exports = router;