const express = require("express");
const { mongoose } = require("mongoose");

const { Account } = require("../db.js");
const authMiddleWare = require("../middleware.js");

const router = express.Router();

router.get("/balance", authMiddleWare, async (req, res) => {
  console.log(req.body);
  const account = await Account.findOne({ userId: req.userId });
  res.status(200).json({ balance: account?.balance });
});

router.post("/transfer", authMiddleWare, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { to, amount } = req.body;
  const account = await Account.findOne({ userId: req.userId });
  const toAccount = await Account.findOne({ userId: to });
  if (!toAccount) {
    return res.status(404).json({ message: "Account not found" });
  }
  if (account.balance < amount) {
    return res.status(403).json({ message: "Insufficient balance" });
  }
  account.balance -= amount;
  toAccount.balance += amount;
  await account.save();
  await toAccount.save();
  session.commitTransaction();
  res.status(200).json({ message: "Transfer successful" });
});

module.exports = router;
