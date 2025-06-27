const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient.js');


router.get('/', async (req, res) => {
  const ingredients = await Ingredient.find();
  res.render('ingredients/index', { ingredients });
});

router.post('/', async (req, res) => {
  try {
    // Prevent duplicate ingredient names
    let existing = await Ingredient.findOne({ name: req.body.name });
    if (!existing) {
      await Ingredient.create({ name: req.body.name });
    }
    res.redirect('ingredients/index');
  } catch (e) {
    res.redirect('/ingredients');
  }
});

module.exports = router;