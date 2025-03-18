const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config.js");

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("asdasd");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleWare;
