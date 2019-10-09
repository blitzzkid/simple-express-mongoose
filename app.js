const express = require("express");
const app = express();
require('./db')

// Add body parser
app.use(express.json());

// Define routes
const Kitten = require("./routes/kittens");
app.use("/kittens", Kitten);

const Owner = require("./routes/owners");
app.use("/owners", Owner);

module.exports = app;
