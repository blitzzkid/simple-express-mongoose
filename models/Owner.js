const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  salutation: { type: String, enum: ["Dr", "Mr", "Mrs", "Ms", "Miss", "Mdm"] },
  username: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true, select: true }
});

ownerSchema.virtual("fullName").get(function() {
  return `${this.salutation} ${this.firstName} ${this.lastName}`;
});

ownerSchema.pre("save", async function(next) {
  const rounds = 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

// Create the model
const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
