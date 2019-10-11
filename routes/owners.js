const express = require("express");
const router = express.Router();
const Owner = require("../models/Owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res, next) => {
  try {
    const owner = await Owner.find();
    res.send(owner);
  } catch (err) {
    next(err);
  }
});

router.get("/secret", async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error();
    }
    const user = jwt.verify(req.cookies.token, "secret");
    res.send(`Hello ${user.name}`);
  } catch (error) {
    error.status = 401;
    next();
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
    const owner = new Owner(newOwner);
    await Owner.init();
    const savedOwner = await owner.save();
    res.send(savedOwner);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const owner = await Owner.findOne({ username });
    const result = await bcrypt.compare(password, owner.password);
    if (!result) {
      throw new Error("Wrong password");
    }
    const token = jwt.sign({ name: owner.username }, "secret");
    res.cookie("token", token);
    res.send(owner);
  } catch (err) {
    if (err.message === "Wrong password") {
      err.status = 400;
    }
    next(err);
  }
});

module.exports = router;
