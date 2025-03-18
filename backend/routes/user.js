const express = require("express");
const jwt = require("jsonwebtoken");
const z = require("zod");
const authMiddleWare = require("../middleware.js");

const { User, Account } = require("../db.js");
const { JWT_SECRET } = require("../config.js");

const signUpSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  userName: z.string().email(),
  password: z.string().min(6),
});

const router = express.Router();
// router.use(express.json());

// here with the methods like router.post or router.get
router.post("/signup", async (req, res) => {
  // console.log("req.body", req.body);
  const parsedSchema = signUpSchema.safeParse(req.body);
  // console.log("2. Schema validation result:", parsedSchema.success);

  if (!parsedSchema.success) {
    return res.status(411).send({
      message: "Email already taken / Incorrect inputs",
      error: parsedSchema.error,
    });
  }

  const existingUser = await User.findOne({
    userName: req.body.userName,
  });

  if (existingUser) {
    return res.status(411).send("Email already taken / Incorrect inputs");
  }

  const user = await User.create(req.body);
  const userId = user._id;

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign({ userId }, JWT_SECRET);

  res.json({ token: token, message: "User created successfully" });
});

const signInSchema = z.object({
  userName: z.string().email(),
  password: z.string().min(6),
});

router.post("/signin", async (req, res) => {
  const { userName, password } = req.body;
  const parsedSchema = signInSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    return res.status(411).send({
      message: "Incorrect inputs",
      error: parsedSchema.error,
    });
  }

  const user = await User.findOne({
    userName,
    password,
  });

  if (user._id) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    return res.json({ token });
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

const updateUserDetailSchema = z.object({
  firstName: z.string().optional(),
  password: z.string().optional(),
  lastName: z.string().optional(),
});

// not the current requst and handling
router.put("/", authMiddleWare, async (req, res) => {
  // const { firstName, lastName, password } = req.body;
  console.log(req.body);
  const parsedSchema = updateUserDetailSchema.safeParse(req.body);
  if (!parsedSchema.success) {
    return res.status(411).send({
      message: "Incorrect inputs",
      error: parsedSchema.error,
    });
  }

  await User.updateOne({ email: req.email }, req.body);

  return res.status(200).send({
    message: "User updated successfully",
  });
});

router.get("/bulk", authMiddleWare, async (req, res) => {
  console.log(req.query);

  const { filter } = req.query;

  const users = await User.find().or(
    { firstName: filter },
    { lastName: filter }
  );

  res.status(200).send({
    users: users.map((user) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })),
  });
});

module.exports = router;
