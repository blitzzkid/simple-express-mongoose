const mongoose = require("mongoose");

const kittySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
    minlength: 3
  },
  age: { type: Number, min: 0, max: 20 },
  sex: { type: String, enum: ["male", "female"] }
});

// Create the model
const Kitten = mongoose.model("Kitten", kittySchema);

module.exports = Kitten;
