// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');




// View all pantry items
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('foods/index.ejs');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});
// New - Show form to add new item
router.get('/new', (req, res) => {
  res.render('foods/new', { userId: req.params.userId });
});


//  - GET /users/:userId/foods/new
// router.get('/new', (req, res) => {
//   res.render('foods/new', {
//     userId: req.params.userId,
//     currentUser: req.session.user
//   });
// });

// CREATE ITEM - POST /users/:userId/foods
// router.post('/', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     user.pantry.push({
//       name: req.body.name,
//   
//     });
//     await user.save();
//     res.redirect(`/users/${req.params.userId}/foods`);
//   } catch (err) {
//     console.error(err);
//     res.redirect('/');
//   }
// });

// router.get('/new', async (req, res) => {
//   const pantry = await pantry.find();
//   res.render('foods/new.ejs', { pantry });
// });



// Create - Add new item to pantry
router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.userId);

    currentUser.foods.push(req.body)
   
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});


router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.pantry.push({ name: req.body.name });
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});


// Edit - Show form to edit item
router.get('/:itemId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params._id);
    const food=currentUser.foods.id(req.params.foodsId)
  
    
      res.redirect(`/foods/edit`,{food:food,userId:req.body.userId});

  
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Update and edit form
router.put('/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    
 const foods=currentUser.foods.id(req.params.foodsId)

    foods.set(req.body);
    await currentUser.save();

    res.redirect(`/users/${currentUser._id}/foods/${req.params.foodsId}`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Delete - Remove item from pantry
router.delete('/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    
    currentUser.foods.id(req.params.foodsId).deleteOne()

    await currentUser.save();
    
    res.redirect(`/users/${currentUser._id}/foods`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;