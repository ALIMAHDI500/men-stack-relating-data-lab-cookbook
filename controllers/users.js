
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

 //GET /users Explore Our Community
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('username profilePic');
    res.render('users/index.ejs', { 
      users,
      currentUser: req.session.user 
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

//  GET /users/:userId/foods View My Pantry
router.get('/:userId/foods', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('pantry');
    res.render('foods/index.ejs', { 
      pantry: user.pantry,
      userId: req.params.userId,
      currentUser: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

//  GET /users/:userId User Profile Page
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('users/show.ejs', { 
      profileUser: user,
      currentUser: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
})



module.exports = router;