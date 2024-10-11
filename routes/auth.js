const express = require('express');
const User = require('../models/user.js');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    const existingSession = await req.sessionStore.get(user._id.toString());
    if (existingSession) {
      return res.status(400).send('User already logged in');
    }
    req.session.userId = user._id;
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logout successful');
});

module.exports = router;