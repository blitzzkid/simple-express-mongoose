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

const protectedRoutes = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error();
    }
    req.user = jwt.verify(req.cookies.token, "secret");
    next();
  } catch (error) {
    res.status(401).end();
  }
};

router.get("/:name", protectedRoutes, async (req, res, next) => {
  try {
    const ownerFirstName = req.params.name;
    const regex = new RegExp(ownerFirstName, "gi");
    const owners = await Owner.find({ firstName: regex });
    // const person = {
    //   fullName: `${owners[0].salutation} ${owners[0].firstName} ${owners[0].lastName}`
    // };
    res.send(owners);
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

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;
