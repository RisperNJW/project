const router = require("express").Router();
const { register, login } = require("../controllers/authController");
router.post("/register", register);
router.post("/login", login);
module.exports = router;

// server/middleware/auth.js
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.sendStatus(403);
  }
};