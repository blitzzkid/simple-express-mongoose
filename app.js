const express = require("express");
const app = express();

// Add body parser
app.use(express.json());

// Define routes
const Kitten = require("./routes/kittens");
app.use("/kittens", Kitten);

module.exports = app;
