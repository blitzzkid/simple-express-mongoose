const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");

router.get("/", async (req, res, next) => {
  try {
    const owner = await Owner.find();
    res.send(owner);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req, res, next) => {
  try {
    const ownerFirstName = req.params.name;
    const regex = new RegExp(ownerFirstName, "gi");
    const owners = await Owner.find({ firstName: regex });
    const person = {
      fullName: `${owners[0].salutation} ${owners[0].firstName} ${owners[0].lastName}`
    };
    res.send(person);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const newOwner = req.body;
    // Create a new document
    const owner = new Owner(newOwner);
    // Save document to database
    const savedOwner = await owner.save();
    res.send(`Successfully created a new owner ${savedOwner.firstName}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
