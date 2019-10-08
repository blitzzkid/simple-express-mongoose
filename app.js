const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbName = "test";
app.use(express.json());

mongoose.connect(`mongodb://localhost/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we are connected!");
});

const kittySchema = new mongoose.Schema({
  name: String
});

// Create the model
const Kitten = mongoose.model("Kitten", kittySchema);

app.post("/kittens/new", async (req, res) => {
  const newKitty = req.body;
  // Create a new document
  const fluffy = new Kitten(newKitty);
  console.log(fluffy.name);

  // Save document to database
  await fluffy.save(function(err, kittens, next) {
    if (err) {
      console.error(err);
      next(err);
    }
    console.log(kittens);
    res.send(`Successfully created a new kitten ${fluffy.name}`);
  });
});

app.get("/kittens/", async (req, res, next) => {
  await Kitten.find((err, kittens) => {
    if (err) {
      next(err);
    }
    res.send(kittens);
  });
});

app.get("/kittens/:name", async (req, res, next) => {
  const kittyName = req.params.name;
  const regex = new RegExp(kittyName, "gi");
  await Kitten.find({ name: regex }, (err, kittens) => {
    if (err) {
      next(err);
    }
    res.send(kittens);
  });
});

module.exports = app;
