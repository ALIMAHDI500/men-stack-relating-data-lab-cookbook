const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// GET /recipes current user
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id }).populate('ingredients');
    res.render('recipes/index.ejs', { recipes });
  } catch (e) {
    res.redirect('/');
  }
});

// NEW: GET /recipes/new
router.get('/new', async (req, res) => {
  const ingredients = await Ingredient.find();
  res.render('recipes/new.ejs', { ingredients });
});

// CREATE: POST /recipes
router.post('/', async (req, res) => {
  try {
    // Ingredients: 
    const recipe = new Recipe({
      name: req.body.name,
      instructions: req.body.instructions,
      owner: req.session.user._id,
      ingredients: req.body.ingredients 
    });
    await recipe.save();
    res.redirect('/recipes');
  } catch (e) {
    res.redirect('/recipes');
  }
});

// SHOW: GET /recipes/:recipeId
router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('ingredients');
    // Access control: only allow owner to view
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.redirect('/recipes');
    }
    res.render('recipes/show.ejs', { recipe });
  } catch (e) {
    res.redirect('/recipes');
  }
});

// EDIT: GET /recipes/:recipeId/edit
router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe.owner.equals(req.session.user._id)) return res.redirect('/recipes');
    const ingredients = await Ingredient.find();
    res.render('recipes/edit.ejs', { recipe, ingredients });
  } catch (e) {
    res.redirect('/recipes');
  }
});

// UPDATE: PUT /recipes/:recipeId
router.put('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe.owner.equals(req.session.user._id)) return res.redirect('/recipes');
    recipe.name = req.body.name;
    recipe.instructions = req.body.instructions;
    recipe.ingredients = req.body.ingredients 
    await recipe.save();
    res.redirect(`/recipes/${recipe._id}`);
  } catch (e) {
    res.redirect('/recipes');
  }
});

//  DELETE /recipes/:recipeId
router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe.owner.equals(req.session.user._id)) return res.redirect('/recipes');
    await recipe.deleteOne();
    res.redirect('/recipes');
  } catch (e) {
    res.redirect('/recipes');
  }
});

module.exports = router;