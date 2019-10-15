const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

if (app.get("env") !== "test") {
  require("./db");
}

const corsOptions = {
  credentials: true,
  origin: "https://kitten-home.herokuapp.com/",
  allowedHeaders: "content-type"
};

app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.set("Access-Control-Allow-Credentials", "true");
//   res.set("Access-Control-Allow-Headers", "content-type");
//   res.set("Access-Control-Allow-Origin", "http://localhost:3000");
//   next();
// });

app.use(cookieParser());
app.use(express.json());

const Kitten = require("./routes/kittens");
app.use("/kittens", Kitten);

const Owner = require("./routes/owners");
app.use("/owners", Owner);

module.exports = app;
