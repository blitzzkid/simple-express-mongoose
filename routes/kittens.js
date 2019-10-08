const express = require("express");
const router = express.Router();
const Kitten = require("../models/Kitten");

router.post("/new", async (req, res, next) => {
  try {
    const newKitty = req.body;
    // Create a new document
    const fluffy = new Kitten(newKitty);
    // Save document to database
    await Kitten.init();
    const newKitten = await fluffy.save(fluffy);
    res.send(`Successfully created a new kitten ${newKitten.name}`);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const kitten = await Kitten.find();
    res.send(kitten);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req, res, next) => {
  try {
    const kittyName = req.params.name;
    const regex = new RegExp(kittyName, "gi");
    const kittenName = await Kitten.find({ name: regex });
    res.send(kittenName);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
