//server.js
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
// Middlewares
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const passUserToView = require('./middleware/pass-user-to-view');
const isSignedIn = require('./middleware/is-signed-in');
const User = require('./models/user.js');

const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');

const usersController = require('./controllers/users.js');
const foodsController = require('./controllers/foods.js');


const ejs = require('ejs');
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');


// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
// Session Configurations
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);
app.use('/users/:userId/foods', require('./controllers/foods'));


// Require Controller
const authController = require("./controllers/auth");


app.use("/auth", authController);
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);

app.use('/users', usersController);
app.use('/recipes', recipesController);
app.use('/ingredients', ingredientsController);




// VIP-lounge


// app.get("/vip-lounge", isSignedIn, (req, res) => {
//   res.send(`Welcome to the party`);
// });
// GET
app.get("/", async(req, res) => {
  res.render("index.ejs");
});

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});