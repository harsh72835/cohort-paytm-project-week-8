const express = require("express");
const userRouter = require("./user");
const accontRouter = require("./account");

const router = express.Router();

router.use(
  "/user",
  (req, res) => {
    // console.log("hello from user router");
    req.next();
  },
  userRouter
);

router.use(
  "/account",
  (req, res) => {
    req.next();
  },
  accontRouter
);

module.exports = router;
