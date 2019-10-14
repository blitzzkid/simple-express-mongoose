const express = require("express");
const router = express.Router();
const Kitten = require("../models/Kitten");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  try {
    const kittens = await Kitten.find(req.query);
    res.send(kittens);
  } catch (err) {
    next(err);
  }
});

router.get("/:name", async (req, res, next) => {
  try {
    const kittyName = req.params.name;
    const regex = new RegExp(kittyName, "gi");
    const kittens = await Kitten.find({ name: regex });
    res.send(kittens);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const newKitty = req.body;
    const fluffy = new Kitten(newKitty);
    await Kitten.init();
    const newKitten = await fluffy.save();
    res.send(newKitten);
  } catch (err) {
    console.error(err);
    if (err.name === "MongoError" && err.code === 11000) {
      err.status = 400;
    }
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

router.put("/:name", async (req, res, next) => {
  try {
    const kittenToUpdateName = req.params.name;
    const regex = new RegExp(kittenToUpdateName, "gi");
    const kittenToUpdateDetails = req.body.name;
    const newKitten = await Kitten.findOneAndReplace(
      { name: regex },
      { name: kittenToUpdateDetails },
      { new: true }
    );
    res.send(newKitten);
  } catch (err) {
    next(err);
  }
});

const protectedRoutes = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("You are not authorized");
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).end();
  }
};

router.delete("/delete/:id", protectedRoutes, async (req, res, next) => {
  try {
    const kittenToDelete = req.params.id;
    await Kitten.findByIdAndDelete(kittenToDelete);
    res.send(`Successfully deleted kitten`);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

module.exports = router;
